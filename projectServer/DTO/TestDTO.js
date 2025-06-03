class TestDTO {
    constructor(data) {
        this.title = data.title;
        this.openDate = data.openDate;
        this.dueDate=data.dueDate;
        this.questions = data.questions;
        this.courseName= data.Course.name;
        this.timeLimit = data.timeLimit;
        this.isOpen=Date.now()>=new Date(data.openDate) && Date.now()<=new Date(data.dueDate);
    }
}

module.exports = TestDTO;