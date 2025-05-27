class TestDTO {
    constructor(data) {
        this.title = data.title;
        this.openDate = data.openDate;
        this.dueDate=data.dueDate;
        this.questions = data.questions;
    }
}

module.exports = TestDTO;