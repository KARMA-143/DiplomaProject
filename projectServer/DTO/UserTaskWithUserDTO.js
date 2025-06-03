const CommentDTO = require("./CommentDTO");

class UserTaskWithUserDTO {
    constructor(userTask) {
        this.id=userTask.id;
        this.text = userTask.text;
        this.files = userTask.files;
        this.mark = userTask.mark;
        this.user = userTask.User;
        this.taskTitle = userTask.Task.title;
        this.courseName = userTask.Task.Course.name;
        this.comments= userTask.comments.map((comment)=>{
            return new CommentDTO(comment);
        });
    }
}

module.exports = UserTaskWithUserDTO;