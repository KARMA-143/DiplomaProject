const {Post, File, User} = require("../models/models");
const PostDTO = require("../DTO/PostDTO");
const commentService = require("./commentService");
const fileService = require("./fileService");
const userService = require("./userService");
const sequelize = require("../db");

class postService {
    async getCoursePosts(courseId){
        const  posts = await Post.findAll({where: {CourseId: courseId}, include:[{model:User, attributes:["id", "name", "email"]}], order:[["id", "DESC"]]});
        const collectedPost = await Promise.all(posts.map(async (post)=>{
            post = post.get({plain:true});
            post["comments"] = await commentService.getAllEntityComments("Post", post.id);
            post["files"]=await fileService.getAllFiles("Post", post.id);
            return post;
        }));
        return collectedPost.map(post=>new PostDTO(post));
    }

    async createPost(courseId, post, userId, postFiles){
        const t = await sequelize.transaction();
        let addedFiles=[];
        try{
            const newPost = await Post.create({text: post.text, CourseId: courseId, UserId: userId}, {transaction:t});
            const newPostPlainObject = newPost.get({plain:true});
            newPostPlainObject["User"]=await userService.getUserById(userId);
            newPostPlainObject["comments"] = [];
            newPostPlainObject["files"] = await fileService.addEntityFiles("Post", newPostPlainObject.id, postFiles, t);
            addedFiles = newPostPlainObject["files"];
            await t.commit();
            await fileService.moveFilesFromTempToStatic(newPostPlainObject["files"]);
            return new PostDTO(newPostPlainObject);
        }
        catch (err){
            await fileService.deleteFromTemp(addedFiles);
            await t.rollback();
            throw err;
        }
    }

    async deletePost(postId){
        const t = await sequelize.transaction();
        try{
            const files = await fileService.deleteEntityFiles("Post", postId, t);
            await commentService.deleteAllEntityComments("Post", postId, t);
            await Post.destroy({where:{id: postId}, transaction:t});
            await t.commit();
            await fileService.deleteFilesFromStatic(files);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async editPost(postId, post, files){
        const t = await sequelize.transaction();
        try{
            await Post.update({text: post.text}, { where:{id: postId}, transaction: t});
            const editedPost = await Post.findOne({where:{id: postId}, include:[{model:User, attributes:["id", "name", "email"]}], transaction: t});
            const editedPostPlainObject = editedPost.get({plain:true});
            const filesToDelete = await fileService.deleteExistingFiles("Post", postId, post.filesId, t);
            files = await fileService.addEntityFiles("Post", postId, files, t);
            await t.commit();
            await fileService.deleteFilesFromStatic(filesToDelete);
            await fileService.moveFilesFromTempToStatic(files);
            editedPostPlainObject["files"] = await fileService.getAllFiles("Post", postId);
            editedPostPlainObject["comments"] = await commentService.getAllEntityComments("Post", editedPostPlainObject.id);
            return new PostDTO(editedPostPlainObject);
        }
        catch(err){
            await fileService.deleteFromTemp(files);
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new postService();