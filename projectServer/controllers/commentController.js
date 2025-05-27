const commentService = require("../services/commentService");

class CommentController {
    async addComment(req, res, next) {
        try{
            const entityType=req.params.entityType;
            const entityId = req.params.entityId;
            const comment = req.body;
            const user=req.user;
            const newComment = await commentService.addComment(entityType, entityId, comment.text, user.id);
            return res.status(200).json(newComment);
        }
        catch (err) {
            next(err);
        }
    }

    async deleteComment(req, res, next){
        try{
            const user = req.user;
            const role = req.role;
            const commentId = req.params.commentId;
            await commentService.deleteComment(commentId, user, role);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async updateComment(req, res, next){
        try{
            const commentId = req.params.commentId;
            const comment = req.body;
            const user = req.user;
            const editedComment = await commentService.updateComment(commentId, comment.text, user.id);
            return res.status(200).json(editedComment);
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new CommentController();