const {Course, User, CourseUsers, File} = require("../models/models");
const {Op} = require("sequelize");
const CourseCardDTO = require("../DTO/CourseCardDTO");
const uuid=require('uuid')
const APIError = require("../exceptions/APIError");
const CourseInfoDTO = require("../DTO/CourseInfoDTO");
const sequelize = require('../db');
const CourseUserDTO = require("../DTO/CourseUserDTO");

class courseService{
    async getUsersAllCourses(UserId, page = 1, searchQuery = '', role = 'all') {
        const whereConditions = [];

        if (searchQuery) {
            whereConditions.push({
                name: {
                    [Op.iLike]: `%${searchQuery}%`
                }
            });
        }

        let roleCondition;

        if (role === 'mentor') {
            roleCondition = {
                [Op.or]: [
                    { creatorId: UserId },
                    {
                        '$users.CourseUsers.isMentor$': true,
                        '$users.id$': UserId
                    }
                ]
            };
        } else if (role === 'member') {
            roleCondition = {
                creatorId: { [Op.ne]: UserId },
                '$users.CourseUsers.isMentor$': false,
                '$users.id$': UserId
            };
        } else {
            roleCondition = {
                [Op.or]: [
                    { creatorId: UserId },
                    sequelize.where(sequelize.col("users.id"), UserId)
                ]
            };
        }

        const whereClause = {
            [Op.and]: [
                ...whereConditions,
                roleCondition
            ]
        };

        const includeUsers = {
            model: User,
            as: "users",
            attributes: [],
            through: { attributes: ["isMentor"] },
            where: role !== 'all' ? { id: UserId } : undefined,
            required: false
        };

        const includeCreator = {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email"]
        };

        const courses = await Course.findAll({
            subQuery: false,
            distinct: true,
            order: [["id", "ASC"]],
            offset: (page - 1) * 15,
            limit: 15,
            include: [includeCreator, includeUsers],
            where: whereClause
        });

        const count = await Course.count({
            distinct: true,
            include: [includeCreator, includeUsers],
            where: whereClause
        });

        return new CourseCardDTO({ courses, count });
    }

    async createCourse(course, userId){
        const t = await sequelize.transaction();
        try{
            const code =uuid.v4().slice(0,12);
            const newCourse = await Course.create({name: course.name, cover: course.cover, creatorId: userId, code: code}, {transaction: t});
            await t.commit();
            return newCourse;
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async addCourseUser(userId, code){
        const t = await sequelize.transaction();
        try{
            const candidate=await Course.findOne({where:{code:code, creatorId: userId}});
            if(candidate){
                return {CourseId:candidate.id};
            }
            const course= await Course.findOne({where:{code:code}});
            if(!course){
                throw APIError.BadRequestError(`Course with code ${code} not found!`);
            }
            const courseUser= await CourseUsers.findOne({where:{UserId: userId, CourseId: course.id}});
            if(courseUser){
                return courseUser;
            }
            const newCourseUser = await CourseUsers.create({UserId: userId, CourseId: course.id}, {transaction: t});
            await t.commit();
            return newCourseUser;
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async getCourseInfo(courseId){
        const course = await Course.findOne({where:{id:courseId}, include:[{model:User, as: "creator", attributes:["id", "email", "name"]}]});
        return new CourseInfoDTO(course);
    }

    async checkCourseUser(courseId, userId){
        const course= await Course.findOne({where:{id:courseId}});
        if(!course){
            throw APIError.BadRequestError(`Course with code ${courseId} not found!`);
        }
        const candidate=await Course.findOne({where:{id:courseId, creatorId: userId}});
        if(candidate){
            return "creator";
        }
        const courseUser= await CourseUsers.findOne({where:{UserId: userId, CourseId: courseId}});
        if(courseUser){
            return courseUser.isMentor? "mentor":"member";
        }
        throw APIError.BadRequestError("User is not a member of this course!");
    }

    async getCourseFile(fileId){
        return await File.findOne({where: {id: fileId}});
    }

    async getCourseUsers(id){
        const courseWithUsers = await CourseUsers.findAll({
            where: { CourseId: id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        return courseWithUsers.map(user=>{
            return new CourseUserDTO(user);
        })
    }

    async deleteCourseUser(userId){
        const t = await sequelize.transaction();
        try{
            await CourseUsers.destroy({where:{id:userId}, transaction: t});
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateCourseUser(userId, role, courseId){
        const t = await sequelize.transaction();
        try{
            if(role==="owner"){
                const courseCreator = await Course.findOne({where:{id: courseId}});
                const courseUser = await CourseUsers.findOne({where:{id:userId}});
                await Course.update({creatorId: courseUser.UserId},{where:{id: courseId}, transaction: t});
                await CourseUsers.update({UserId: courseCreator.creatorId, isMentor: true}, {where:{id: userId}, transaction: t});
            }
            else{
                await CourseUsers.update({isMentor: role === "mentor"},{where:{id: userId}, transaction: t})
            }
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async getCourseUsersIds(courseId){
        const courseUsers = await CourseUsers.findAll({where:{CourseId: courseId}});
        const courseOwner = await Course.findOne({where:{id: courseId}});
        return [...courseUsers.map(user=>{return user.UserId}), courseOwner.creatorId];
    }

    async getCourseMembers(courseId){
        return await CourseUsers.findAll({where:{CourseId: courseId, isMentor: false}, include: [
                {
                    model: User,
                    attributes: ['email']
                }
            ]});
    }

    async deleteCourse(id){
        const t = await sequelize.transaction();
        try{
            await Course.destroy({where:{id:id}, transaction:t})
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateCourse(id, data){
        const t = await sequelize.transaction();
        try{
            await Course.update({name:data.name, cover:data.cover},{where:{id:id}, transaction:t});
            await t.commit();
            return await this.getCourseInfo(id)
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new courseService();