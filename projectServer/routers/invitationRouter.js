const authMiddleware = require("../middlewares/authMiddleware");
const checkCourseUserMiddleware = require("../middlewares/checkCourseUserMiddleware");
const invitationRouter = require('express').Router();
const invitationController = require('../controllers/invitationController');
const checkIsMentorMiddleware = require("../middlewares/CheckIsMentorMiddleware");

invitationRouter.get("/count", authMiddleware, invitationController.getUserInvitationCount);
invitationRouter.get("/user", authMiddleware, invitationController.getUsersInvitation);
invitationRouter.get("/:id", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, invitationController.getCourseInvitations);
invitationRouter.post("/:id", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, invitationController.createInvitation);
invitationRouter.delete("/:id/:invitationId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, invitationController.deleteInvitation);
invitationRouter.put("/:id/:invitationId", authMiddleware, checkCourseUserMiddleware, checkIsMentorMiddleware, invitationController.updateInvitation);
invitationRouter.delete("/:id", authMiddleware, invitationController.deleteUserInvitation);
invitationRouter.put("/:id", authMiddleware, invitationController.acceptInvitation);

module.exports = invitationRouter;