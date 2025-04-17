const {Course, User, CourseUsers, File} = require("../models/models");
const {Op} = require("sequelize");
const CourseCardDTO = require("../DTO/CourseCardDTO");
const uuid=require('uuid')
const APIError = require("../exceptions/APIError");
const taskService = require("../services/taskService");
const postService = require("../services/postService");
const CourseInfoDTO = require("../DTO/CourseInfoDTO");

class courseService{
    async getUsersAllCourses(UserId, page){
        const courses= await Course.findAll({
            subQuery: false,
            where: {
                [Op.or]: [
                    { creatorId: UserId },
                    { '$Users.id$': UserId }
                ]
            },
            order:[["id", "ASC"]],
            offset: (page-1)*15,
            limit:15,
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: User,
                    through: { attributes: [] },
                },
            ],
        });
        const count=await Course.count({
            where: {
                [Op.or]: [
                    { creatorId: UserId },
                    { '$Users.id$': UserId }
                ]
            },
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: User,
                    through: { attributes: [] },
                },
            ],});
        return new CourseCardDTO({courses, count});
    }

    async createCourse(course, userId){
        const code =uuid.v4().slice(12);
        return await Course.create({name: course.name, cover: course.cover, creatorId: userId, code: code});
    }

    async addCourseUser(userId, code){
        const candidate=await Course.findOne({where:{code:code, creatorId: userId}});
        if(candidate){
            return {CourseId:candidate.id};
        }
        const course= await Course.findOne({where:{code:code}});
        if(!course){
            throw APIError.BadRequestError(`Course with code ${userId} not found!`);
        }
        const courseUser= await CourseUsers.findOne({where:{UserId: userId, CourseId: course.id}});
        if(courseUser){
            return courseUser;
        }
        return await CourseUsers.create({UserId: userId, CourseId: course.id});
    }

    async getCourseInfo(courseId, userId){
        const course = await Course.findOne({where:{id:courseId}, include:[{model:User, as: "creator", attributes:["id", "email", "name"]}]});
        const courseUsers = await CourseUsers.findAll({
            where:{
                CourseId:course.id
            },
            include:[
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                }
            ]
        });
        const posts=await postService.getCoursePosts(courseId);
        const tasks=await taskService.getCourseTasks(courseId);
        return new CourseInfoDTO({
          course:course,
          members:courseUsers,
          posts:posts,
          tasks:tasks
        });
    }

    async checkCourseUser(courseId, userId){
        const course= await Course.findOne({where:{id:courseId}});
        if(!course){
            throw APIError.BadRequestError(`Course with code ${userId} not found!`);
        }
        const candidate=await Course.findOne({where:{id:courseId, creatorId: userId}});
        if(candidate){
            return {isCreator: true};
        }
        const courseUser= await CourseUsers.findOne({where:{UserId: userId, CourseId: courseId}});
        if(courseUser){
            return {isCreator: false};
        }
        throw APIError.BadRequestError("User is not a member of this course!");
    }

    async getCourseFile(fileId){
        return await File.findOne({where: {id: fileId}});
    }
}

module.exports = new courseService();