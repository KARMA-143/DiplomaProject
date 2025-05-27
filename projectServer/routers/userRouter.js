const userRouter=require('express').Router();
const userController=require('../controllers/userController');
const authMiddleware=require('../middlewares/authMiddleware');

userRouter.post('/login', userController.login);
userRouter.post('/register',userController.register);
userRouter.get('/activate/:link', userController.activate);
userRouter.get('/refresh', userController.refresh);
userRouter.get('/logout', userController.logout);
userRouter.get('/resend', authMiddleware, userController.resendActivationLink);
userRouter.get('/:id/:pattern', authMiddleware, userController.findUsersWithPattern)

module.exports=userRouter;