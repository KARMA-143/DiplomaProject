const userRouter = require("./userRouter");
const courseRouter = require("./courseRouter");
const postRouter = require("./postRouter");
const commentRouter = require("./commentRouter");
const invitationRouter = require("./invitationRouter");
const assignmentRouter = require("./assignmentRouter")
const chatRouter = require("./chatRouter");
const router = require("express").Router();

router.use('/user', userRouter);
router.use('/course', courseRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use("/invitation", invitationRouter);
router.use("/assignment", assignmentRouter);
router.use("/chat", chatRouter);

module.exports = router;