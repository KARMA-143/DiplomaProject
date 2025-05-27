const bcrypt = require('bcrypt');
const {User} = require("../models/models");
const tokenService = require("./tokenService");
const mailService = require("./mailService");
const UserDTO = require("../DTO/UserDTO");
const APIError = require("../exceptions/APIError");
const sequelize = require('../db')
const {Op} = require("sequelize");
const invitationService = require("./invitationService");
const courseService = require("./courseService");

class userService {
    async register(user) {
        const t = await sequelize.transaction();
        try{
            const hashedPassword=bcrypt.hashSync(user.password, 10);
            const candidate=await User.findOne({where:{email:user.email}});
            if(candidate){
                throw APIError.BadRequestError(`User with email ${user.email} already exists!`);
            }
            const newUser = await User.create({name: user.name, email: user.email, password: hashedPassword, isActivated: false}, {transaction: t});
            const userDTO=new UserDTO(newUser);
            const tokens = await tokenService.createToken({...userDTO});
            const activationLink=await mailService.createActivationLink(newUser.id, t);
            await tokenService.saveToken(newUser.id, tokens.refreshToken, t);
            await t.commit();
            await mailService.sendActivationLink(newUser.email, `${process.env.API_URL}/api/user/activate/${activationLink.link}`);
            return {...tokens, ...userDTO};
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async login(user){
        const t = await sequelize.transaction();
        try{
            const candidate=await User.findOne({where:{email:user.email}});
            if(!candidate){
                throw APIError.BadRequestError(`There is no user found with email ${user.email}`);
            }
            if(!bcrypt.compareSync(user.password,candidate.password)){
                throw APIError.BadRequestError(`Password does not match!`);
            }
            const userDTO=new UserDTO(candidate);
            const tokens = await tokenService.createToken({...userDTO});
            await tokenService.saveToken(candidate.id, tokens.refreshToken, t);
            await t.commit();
            return {...tokens, ...userDTO};
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async activateUser(link){
        const t = await sequelize.transaction();
        try{
            const userId = await mailService.activate(link, t);
            const user = await User.findOne({where:{id:userId}});
            if(user){
                user.isActivated = true;
                await user.save({transaction: t});
                await t.commit();
                return;
            }
            throw APIError(`There is no user with this activation link!`);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async refreshToken(refreshToken){
        const t =await sequelize.transaction();
        try{
            if(!refreshToken){
                throw APIError.UnauthorizedError();
            }
            const userData=tokenService.validateRefreshToken(refreshToken);
            const tokenFromDB=await tokenService.findRefreshToken(refreshToken);
            if(!tokenFromDB || !userData){
                throw APIError.UnauthorizedError();
            }
            const user = await User.findOne({where:{id:userData.id}});
            const userDTO=new UserDTO(user);
            const tokens = await tokenService.createToken({...userDTO});
            await tokenService.saveToken(user.id, tokens.refreshToken, t);
            await t.commit();
            return {...tokens, ...userDTO};
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async logout(token){
        const t =await sequelize.transaction();
        try{
            const userData = tokenService.validateRefreshToken(token);
            await tokenService.deleteRefreshToken(userData.id, t);
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async resendActivationLink(user){
        const t = await sequelize.transaction();
        try{
            const link=await mailService.createActivationLink(user.id, t);
            await t.commit();
            await mailService.sendActivationLink(user.email, `${process.env.API_URL}/api/user/activate/${link.link}`);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async getUserById(userId) {
        return await User.findOne({where:{id: userId}});
    }

    async findUsersWithPattern(pattern, courseId){
        const excludedUsersIds = [
            ...await invitationService.getInvitedUserIds(courseId),
            ...await courseService.getCourseUsersIds(courseId),
        ]
        const users = await User.findAll({where:{email:{ [Op.iLike]: `%${pattern}%`}, id:{[Op.notIn]: excludedUsersIds}}, limit: 10});
        return users.map(user=>new UserDTO(user));
    }
}

module.exports = new userService();