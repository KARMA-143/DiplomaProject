const {Chat, ChatUsers, Message, User} = require("../models/models");
const userService = require("../services/userService");
const MessageDTO = require("../DTO/messageDTO");
const sequelize = require("../db");

class ChatService {
    async getChatId(userId1, userId2){
        const chats = await Chat.findAll({
            include: [
                {
                    model: ChatUsers,
                    where: {
                        UserId: [userId1, userId2]
                    },
                    attributes: ['UserId']
                }
            ]
        });
        for (const chat of chats) {
            const userIds = chat.ChatUsers.map(cu => cu.UserId);
            if (
                userIds.length === 2 &&
                userIds.includes(+userId1) &&
                userIds.includes(+userId2)
            ) {
                return chat.id;
            }
        }
        return null;
    }

    async getChatMessages(userId1, userId2){
        const id = await this.getChatId(userId1, userId2);
        if(!id){
            return {
                user: await userService.getUserById(userId2),
                messages:[]
            };
        }
        else{
            const messages = await Message.findAll({where:{ChatId:id}, include:[{model:User, attributes:["id", "name", "email"]}], order: [['createdAt', 'ASC']]});
            return {
                user: await userService.getUserById(userId2),
                messages:messages.map(message=>new MessageDTO(message))
            };
        }
    }

    async addNewMessage(userId1, userId2, message){
        const t = await sequelize.transaction();
        try{
            const id = await this.getChatId(userId1, userId2);
            if(!id){
                const newChat = await Chat.create({});
                await ChatUsers.create({ChatId:newChat.id, UserId:userId1});
                await ChatUsers.create({ChatId:newChat.id, UserId:userId2});
            }
            const newMessage = await Message.create({UserId:userId1, content:message.content, ChatId:id});
            const messageWithUser = await Message.findOne({where:{id:newMessage.id}, include:[{model:User, attributes:["id", "name", "email"]}]});
            await t.commit();
            return {
                ... new MessageDTO(messageWithUser),
                tempId:message.tempId
            }
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async deleteMessage(id){
        const t = await sequelize.transaction();
        try{
            await Message.destroy({where:{id:id}});
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateMessage(id, message){
        const t = await sequelize.transaction();
        try{
            await Message.update({content: message},{where:{id:id}});
            const messageWithUser = await Message.findOne({where:{id:id}, include:[{model:User, attributes:["id", "name", "email"]}]});
            await t.commit();
            return new MessageDTO(messageWithUser);

        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new ChatService();