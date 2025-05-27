const commentRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const checkCourseUserMiddleware = require("../middlewares/checkCourseUserMiddleware");
const commentController = require("../controllers/commentController");

commentRouter.post("/:id/:entityType/:entityId", authMiddleware, checkCourseUserMiddleware, commentController.addComment);
commentRouter.delete("/:id/:commentId", authMiddleware, checkCourseUserMiddleware, commentController.deleteComment);
commentRouter.put("/:id/:commentId", authMiddleware, checkCourseUserMiddleware, commentController.updateComment)

module.exports = commentRouter;