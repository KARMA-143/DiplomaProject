const courseRouter = require("express").Router();
const courseController = require("../controllers/CourseController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkCourseUserMiddleware=require("../middlewares/checkCourseUserMiddleware");
const checkIsMentorMiddleware = require("../middlewares/CheckIsMentorMiddleware");

courseRouter.get("/", authMiddleware, courseController.getUserCourses);
courseRouter.post("/", authMiddleware, courseController.createCourse);
courseRouter.post("/join", authMiddleware, courseController.joinCourseWithCode);
courseRouter.get("/:id", authMiddleware, checkCourseUserMiddleware, courseController.getCourseInfo);
courseRouter.get("/:id/download/:fileId", authMiddleware, checkCourseUserMiddleware, courseController.downloadCourseFile);
courseRouter.get("/:id/users", authMiddleware, checkCourseUserMiddleware, courseController.getCourseUsers);
courseRouter.delete("/:id/users/:userId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, courseController.deleteCourseUser);
courseRouter.put("/:id/users/:userId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, courseController.updateCourseUser);
courseRouter.get("/:id/role", authMiddleware, checkCourseUserMiddleware, courseController.getUserRole);

module.exports = courseRouter;