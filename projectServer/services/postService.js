const {Post, Comment, File, User} = require("../models/models");
const {join} = require("node:path");
const {promises} = require("node:fs");
const uuid=require('uuid')
const path = require("path");
const PostDTO = require("../DTO/PostDTO");
const fs = require("node:fs");
const {Op} = require("sequelize");

class postService {
    async getCoursePosts(courseId){
        const  posts = await Post.findAll({where: {CourseId: courseId}, include:[{model:User, attributes:["id", "name", "email"]}], order:[["id", "DESC"]]});
        return Promise.all(posts.map(async (post)=>{
            post = post.get({plain:true});
            post["comments"] = await Comment.findAll({where:{entityId: post.id, entityType:"Post"}, include:[{model:User, as: "author", attributes:["id", "name", "email"]}]});
            post["files"]=await File.findAll({where:{entityId: post.id, entityType:"Post"}});
            post["files"]=await Promise.all(post["files"].map(async (file)=>{
                file = file.get({plain:true});
                const fullPath = join(__dirname, "..", "static", file.path);
                const stats = await promises.stat(fullPath);
                file["size"]=stats.size;
                return file;
            }));
            return post;
        }));
    }

    async createPost(courseId, post, userId, postFiles){
        const newPost = await Post.create({text: post.text, CourseId: courseId, UserId: userId});
        const newPostPlainObject = newPost.get({plain:true});
        postFiles= Array.isArray(postFiles)
            ? postFiles
            : postFiles ? [postFiles] : [];
        const user = await User.findOne({where:{id: userId}, attributes:["id", "name"]});
        newPostPlainObject["User"]=user.get({plain:true});
        newPostPlainObject["comments"] = await Comment.findAll({where:{entityId: newPost.id, entityType:"Post"}, include:[{model:User, as: "author", attributes:["id", "name", "email"]}]});
        newPostPlainObject["files"] = await Promise.all(postFiles.map(async (file)=>{
            const ext = file.name.split(".").pop();
            const filePath = `${uuid.v4()}.${ext}`;
            await file.mv(path.resolve(__dirname, '..', 'static', filePath));
            const createdFile = await File.create({name: Buffer.from(file.name, 'latin1').toString('utf8'), path: filePath, entityId: newPostPlainObject.id, entityType: "Post"});
            const stats = await promises.stat(path.resolve(__dirname, '..', 'static', filePath));
            file = createdFile.get({plain:true});
            file["size"]=stats.size;
            return file;
        }));
        return new PostDTO(newPostPlainObject);
    }

    async deletePost(postId){
        const postFiles = await File.findAll({where:{entityId:postId, entityType: "Post"}});
        for (const file of postFiles) {
            await fs.unlink(path.resolve(__dirname, "..", "static", file.path), (err)=>{
                if(err) throw err;
            });
        }
        await File.destroy({where:{entityId:postId, entityType: "Post"}});
        await Comment.destroy({where:{entityId:postId, entityType:"Post"}});
        await Post.destroy({where:{id: postId}});
    }

    async editPost(postId, post, files){
        await Post.update({text: post.text}, { where:{id: postId}});
        const editedPost = await Post.findOne({where:{id: postId}, include:[{model:User, attributes:["id", "name", "email"]}]});
        const editedPostPlainObject = editedPost.get({plain:true});
        post.filesId=JSON.parse(post.filesId);
        const removedFiles = await File.findAll({where:{entityId:postId, entityType: "Post", id:{[Op.notIn]:post.filesId}}});
        for (const file of removedFiles) {
            await fs.unlink(path.resolve(__dirname, "..", "static", file.path), (err)=>{
                if(err) throw err;
            });
        }
        await File.destroy({where:{entityId:postId, entityType: "Post", id:{[Op.notIn]:post.filesId}}});
        files= Array.isArray(files)
            ? files
            : files ? [files] : [];
        for(const file of files){
            const ext = file.name.split(".").pop();
            const filePath = `${uuid.v4()}.${ext}`;
            await file.mv(path.resolve(__dirname, '..', 'static', filePath));
            await File.create({name: Buffer.from(file.name, 'latin1').toString('utf8'), path: filePath, entityId: editedPostPlainObject.id, entityType: "Post"});
        }
        editedPostPlainObject["comments"] = await Comment.findAll({where:{entityId: postId, entityType:"Post"}, include:[{model:User, as: "author", attributes:["id", "name", "email"]}]});
        const postFiles = await File.findAll({where:{entityId:postId, entityType: "Post"}});
        editedPostPlainObject["files"] = await Promise.all(postFiles.map(async (file)=>{
            file=file.get({plain: true});
            const stats = await promises.stat(path.resolve(__dirname, '..', 'static', file.path));
            file["size"]=stats.size;
            return file;
        }));
        return new PostDTO(editedPostPlainObject);
    }
}

module.exports = new postService();