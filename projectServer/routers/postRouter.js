const checkCourseUserMiddleware = require("../middlewares/checkCourseUserMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const postController = require("../controllers/postController");
const postRouter = require("express").Router();

postRouter.post("/:id", authMiddleware, checkCourseUserMiddleware, postController.createPost);
postRouter.delete("/:id/:postId", authMiddleware, checkCourseUserMiddleware, postController.deletePost);
postRouter.put("/:id/:postId", authMiddleware, checkCourseUserMiddleware, postController.editPost);

module.exports = postRouter;