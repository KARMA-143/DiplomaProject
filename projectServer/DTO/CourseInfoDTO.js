class CourseInfoDTO {
    constructor(courseInfo) {
        this.id= courseInfo.id;
        this.name= courseInfo.name;
        this.cover= courseInfo.cover;
        this.code= courseInfo.code;
        this.creator= courseInfo.creator;
    }
}

module.exports = CourseInfoDTO;