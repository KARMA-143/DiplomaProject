const assignmentRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const checkCourseUserMiddleware = require("../middlewares/checkCourseUserMiddleware");
const assignmentController = require("../controllers/assignmentController");
const checkIsMentorMiddleware = require("../middlewares/CheckIsMentorMiddleware");

assignmentRouter.get("/:id", authMiddleware, checkCourseUserMiddleware, assignmentController.getCourseAssignments);
assignmentRouter.post("/:id/task", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.createTask);
assignmentRouter.get("/:id/task/:taskId", authMiddleware, checkCourseUserMiddleware, assignmentController.getTask);
assignmentRouter.delete("/:id/task/:taskId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.deleteTask);
assignmentRouter.put("/:id/task/:taskId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.updateTask);
assignmentRouter.post("/:id/test", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.createTest);
assignmentRouter.get("/:id/test/:testId", authMiddleware, checkCourseUserMiddleware, assignmentController.getTest);
assignmentRouter.delete("/:id/test/:testId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.deleteTest);
assignmentRouter.put("/:id/test/:testId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, assignmentController.updateTest);

module.exports = assignmentRouter;