const chatService = require('../services/chatService');

class ChatController {
    async getChatMessages(req, res, next) {
        try{
            const user = req.user;
            const userId = req.params.userId;
            const messages = await chatService.getChatMessages(user.id, userId);
            return res.status(200).json(messages);
        }
        catch (err) {
            next(err);
        }
    }

    async addNewMessage(req, res, next){
        try{
            const user = req.user;
            const userId = req.params.userId;
            const message = req.body;
            const newMessage = await chatService.addNewMessage(user.id, userId, message);
            return res.status(200).json(newMessage);
        }
        catch(err){
            next(err);
        }
    }

    async deleteMessage(req,res,next){
        try{
            const id = req.params.id;
            await chatService.deleteMessage(id);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async updateMessage(req, res, next){
        try{
            const id = req.params.id;
            const message = req.body;
            const updatedMessage = await chatService.updateMessage(id, message.content);
            return res.status(200).json(updatedMessage);
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new ChatController();