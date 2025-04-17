const courseRouter = require("express").Router();
const courseController = require("../controllers/CourseController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkCourseUserMiddleware=require("../middlewares/checkCourseUserMiddleware");

courseRouter.get("/", authMiddleware, courseController.getUserCourses);
courseRouter.post("/", authMiddleware, courseController.createCourse);
courseRouter.post("/join", authMiddleware, courseController.joinCourseWithCode);
courseRouter.get("/:id", authMiddleware, checkCourseUserMiddleware, courseController.getCourseInfo);
courseRouter.get("/:id/download/:fileId", authMiddleware, checkCourseUserMiddleware, courseController.downloadCourseFile);

module.exports = courseRouter;