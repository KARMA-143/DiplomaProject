class CommentDTO {
    constructor(comment) {
        this.id= comment.id;
        this.text= comment.text;
        this.createdAt= comment.createdAt;
        this.updatedAt= comment.updatedAt;
        this.author= {
            id: comment.author.id,
            name: comment.author.name,
        }
    }
}

module.exports = CommentDTO;