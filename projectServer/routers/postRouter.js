const checkCourseUserMiddleware = require("../middlewares/checkCourseUserMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const postController = require("../controllers/postController");
const postRouter = require("express").Router();
const checkIsMentorMiddleware = require("../middlewares/CheckIsMentorMiddleware");

postRouter.post("/:id", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, postController.createPost);
postRouter.delete("/:id/:postId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, postController.deletePost);
postRouter.put("/:id/:postId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, postController.editPost);
postRouter.get("/:id", authMiddleware, checkCourseUserMiddleware, postController.getCoursePosts);

module.exports = postRouter;