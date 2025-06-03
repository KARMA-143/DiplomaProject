const CommentDTO = require("./CommentDTO");

class UserTaskDTO {
    constructor(userTask) {
        this.id=userTask.id;
        this.text = userTask.text;
        this.files = userTask.files;
        this.mark = userTask.mark;
        this.userId = userTask.UserId;
        this.comments= userTask.comments.map((comment)=>{
            return new CommentDTO(comment);
        });
        this.isEditable=Date.now()<new Date(userTask.Task.dueDate) && userTask.mark===null;
    }
}

module.exports = UserTaskDTO;