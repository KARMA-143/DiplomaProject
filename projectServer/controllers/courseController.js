const courseService= require('../services/courseService');
const path= require('node:path');

class CourseController {
    async getUserCourses(req,res, next){
        try{
            const user=req.user;
            const page = req.headers.page;
            const courses = await courseService.getUsersAllCourses(user.id, page);
            return res.status(200).json(courses);
        }
        catch(err){
            next(err);
        }
    }

    async createCourse(req,res,next){
        try{
            const user=req.user;
            const course=req.body;
            const newCourse= await courseService.createCourse(course, user.id);
            return res.status(200).json({id: newCourse.id});
        }
        catch(err){
            next(err);
        }
    }

    async joinCourseWithCode(req,res,next){
        try{
            const user=req.user;
            const {code}=req.body;
            const courseUser=await courseService.addCourseUser(user.id, code);
            return res.status(200).json({id: courseUser.CourseId});
        }
        catch(err){
            next(err);
        }
    }

    async getCourseInfo(req,res,next){
        try{
            const id = req.params.id;
            const courseInfo = await courseService.getCourseInfo(id);
            return res.status(200).json(courseInfo);
        }
        catch(err){
            next(err);
        }
    }

    async downloadCourseFile(req,res,next){
        try{
            const fileId=req.params.fileId;
            const file = await courseService.getCourseFile(fileId);
            return res.download(path.join(__dirname, "..", "static", file.path), file.name,(err)=>{
                if(err){
                    next(err);
                }
            });
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new CourseController();