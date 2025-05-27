class CourseUserDTO {
    constructor(courseUser) {
        this.id = courseUser.id;
        this.user = {
            id: courseUser.User.id,
            name: courseUser.User.name,
            email: courseUser.User.email,
            role: courseUser.isMentor? "mentor":"member",
        }
    }
}

module.exports = CourseUserDTO;