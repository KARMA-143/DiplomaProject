const CommentDTO = require("./CommentDTO");
const FileDTO = require("./FileDTO");

class PostDTO {
    constructor(post){
        this.id= post.id;
        this.text= post.text;
        this.createdAt= post.createdAt;
        this.updatedAt= post.updatedAt;
        this.user= {
            id: post.User.id,
            name: post.User.name,
            email: post.User.email,
        };
        this.comments= post.comments.map((comment)=>{
            return new CommentDTO(comment);
        });
        this.files= post.files.map((file)=>{
            return new FileDTO(file);
        })
    }
}

module.exports = PostDTO;