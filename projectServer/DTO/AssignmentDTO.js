class AssignmentDTO{
    constructor(assignment) {
        this.id = assignment.id;
        this.title = assignment.title;
        this.openDate = assignment.openDate;
        this.dueDate = assignment.dueDate;
        this.type = assignment.type;
    }
}

module.exports = AssignmentDTO;