const FileDTO = require("./FileDTO");

class TaskDTO {
    constructor(data) {
        this.title = data.title;
        this.text = data.text;
        this.openDate = data.openDate;
        this.dueDate=data.dueDate;
        this.files= data.files.map((file)=>{
            return new FileDTO(file);
        })
        this.courseName= data.Course.name;
        this.isOpen=Date.now()>=new Date(data.openDate);
    }
}

module.exports = TaskDTO;