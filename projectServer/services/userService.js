const bcrypt = require('bcrypt');
const {User} = require("../models/models");
const tokenService = require("./tokenService");
const mailService = require("./mailService");
const UserDTO = require("../DTO/UserDTO");
const APIError = require("../exceptions/APIError");

class userService {
    async register(user) {
        const hashedPassword=bcrypt.hashSync(user.password, 10);
        const candidate=await User.findOne({where:{email:user.email}});
        if(candidate){
            throw APIError.BadRequestError(`User with email ${user.email} already exists!`);
        }
        const newUser = await User.create({name: user.name, email: user.email, password: hashedPassword, isActivated: false});
        const userDTO=new UserDTO(newUser);
        const tokens = await tokenService.createToken({...userDTO});
        const activationLink=await mailService.createActivationLink(newUser.id);
        await mailService.sendActivationLink(newUser.email, `${process.env.API_URL}/api/user/activate/${activationLink.link}`);
        await tokenService.saveToken(newUser.id, tokens.refreshToken);
        return {...tokens, ...userDTO};
    }

    async login(user){
        const candidate=await User.findOne({where:{email:user.email}});
        if(!candidate){
            throw APIError.BadRequestError(`There is no user found with email ${user.email}`);
        }
        if(!bcrypt.compareSync(user.password,candidate.password)){
            throw APIError.BadRequestError(`Password does not match!`);
        }
        const userDTO=new UserDTO(candidate);
        const tokens = await tokenService.createToken({...userDTO});
        await tokenService.saveToken(candidate.id, tokens.refreshToken);
        return {...tokens, ...userDTO};
    }

    async activateUser(link){
        const userId = await mailService.activate(link);
        const user = await User.findOne({where:{id:userId}});
        if(user){
            user.isActivated = true;
            await user.save();
            return;
        }
        throw APIError(`There is no user with this activation link!`);
    }

    async refreshToken(refreshToken){
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
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, ...userDTO};
    }

    async logout(token){
        const userData = tokenService.validateRefreshToken(token);
        await tokenService.deleteRefreshToken(userData.id);
    }

    async resendActivationLink(user){
        const link=await mailService.createActivationLink(user.id);
        await mailService.sendActivationLink(user.email, `${process.env.API_URL}/api/user/activate/${link.link}`);
    }
}

module.exports = new userService();