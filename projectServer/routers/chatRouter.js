const authMiddleware = require("../middlewares/authMiddleware");
const chatRouter = require("express").Router();
const chatController = require("../controllers/chatController");

chatRouter.get("/:userId", authMiddleware, chatController.getChatMessages);
chatRouter.post("/:userId/message", authMiddleware, chatController.addNewMessage);
chatRouter.delete("/:userId/message/:id", authMiddleware, chatController.deleteMessage);
chatRouter.put("/:userId/message/:id", authMiddleware, chatController.updateMessage);

module.exports = chatRouter;