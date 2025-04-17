const postService = require('../services/postService');

class PostController {
    async createPost(req, res, next) {
        try{
            const user = req.user;
            const courseId = req.params.id;
            const post = req.body;
            const files = req.files?.files;
            const newPost = await postService.createPost(courseId, post, user.id, files);
            return res.status(200).json(newPost);
        }
        catch(err){
            next(err);
        }
    }

    async deletePost(req, res, next){
        try{
            const postId=req.params.postId;
            await postService.deletePost(postId);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async editPost(req, res, next){
        try{
            const post = req.body;
            const postId = req.params.postId;
            const files = req.files?.files;
            const updatedPost = await postService.editPost(postId, post, files);
            return res.status(200).json(updatedPost);
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new PostController();