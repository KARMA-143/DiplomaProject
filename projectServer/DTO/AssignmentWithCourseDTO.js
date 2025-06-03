class AssignmentWithCourseDTO{
    constructor(assignment, role, type) {
        this.id = assignment.id;
        this.title = assignment.title;
        this.openDate = assignment.openDate;
        this.dueDate = assignment.dueDate;
        this.course = {
            id: assignment.Course.id,
            name: assignment.Course.name,
        }
        this.role = role?"mentor":"member";
        this.type=type;
    }
}

module.exports = AssignmentWithCourseDTO;