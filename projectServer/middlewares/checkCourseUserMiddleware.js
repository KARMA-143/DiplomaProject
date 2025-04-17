const courseService = require("../services/courseService");

const checkCourseUserMiddleware = async (req, res, next) => {
    try{
        const user=req.user;
        const id = req.params.id;
        req.role=await courseService.checkCourseUser(id, user.id);
        next();
    }
    catch(err){
        next(err);
    }
}

module.exports = checkCourseUserMiddleware;