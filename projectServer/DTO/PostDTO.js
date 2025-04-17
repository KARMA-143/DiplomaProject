class PostDTO {
    constructor(post){
        this.id= post.id;
        this.text= post.text;
        this.createdAt= post.createdAt;
        this.updatedAt= post.updatedAt;
        this.user= {
            id: post.User.id,
            name: post.User.name,
        };
        this.comments= post.comments.map((comment)=>{
            return {
                id: comment.id,
                text: comment.text,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                author: {
                    id: comment.author.id,
                    name: comment.author.name,
                }
            }
        });
        this.files= post.files.map((file)=>{
            return {
                id: file.id,
                name: file.name,
                size: file.size,
            }
        })
    }
}

module.exports = PostDTO;