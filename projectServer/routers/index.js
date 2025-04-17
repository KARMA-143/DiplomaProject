const userRouter = require("./userRouter");
const courseRouter = require("./courseRouter");
const postRouter = require("./postRouter");
const router = require("express").Router();

router.use('/user',userRouter);
router.use('/course',courseRouter);
router.use('/post',postRouter);

module.exports = router;