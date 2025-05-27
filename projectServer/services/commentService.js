const {Comment, User} = require("../models/models");
const userService = require("./userService");
const sequelize = require("../db");
const CommentDTO = require("../DTO/CommentDTO");
const APIError = require("../exceptions/APIError");

class commentService {
    async addComment(entityType, entityId, text, userId) {
        const t = await sequelize.transaction();
        try{
            const newComment = await Comment.create({entityType: entityType, entityId: entityId, text: text, authorId: userId}, {transaction: t});
            await t.commit();
            const commentPlainObject = newComment.get({plain: true});
            commentPlainObject["author"] =await userService.getUserById(userId);
            return new CommentDTO(commentPlainObject);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async getAllEntityComments(entityType, entityId, transaction) {
        return await Comment.findAll({where:{entityId: entityId, entityType:entityType},
            include:[{model:User, as: "author", attributes:["id", "name", "email"]}],
            transaction,
            order: [["createdAt", "ASC"]]
        });
    }

    async deleteAllEntityComments(entityType, entityId, transaction) {
        await Comment.destroy({where:{entityId: entityId, entityType:entityType}, transaction});
    }

    async deleteComment(commentId, user, role){
        const t = await sequelize.transaction();
        try{
            if(role==="member"){
                const comment = await Comment.findOne({where:{id: commentId, authorId:userId}})
                if(!comment){
                    throw new APIError(403, "access denied");
                }
            }

            await Comment.destroy({where:{id: commentId}, transaction: t});
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateComment(commentId, text, userId){
        const t = await sequelize.transaction();
        try{
            const oldComment=await Comment.findOne({where:{id:commentId, authorId: userId}});
            if(!oldComment){
                throw new APIError(403, "access denied");
            }
            await Comment.update({text: text},{where:{id: commentId}, transaction: t});
            await t.commit();
            const newComment = await  Comment.findOne({where:{id: commentId}});
            const comment = newComment.get({plain: true});
            comment["author"] =await userService.getUserById(userId);
            return new CommentDTO(comment);
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new commentService();