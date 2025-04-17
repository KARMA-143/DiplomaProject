const PostDTO = require("./PostDTO");

class CourseInfoDTO {
    constructor(courseInfo) {
        this.course={
            id: courseInfo.course.id,
            name: courseInfo.course.name,
            cover: courseInfo.course.cover,
            code: courseInfo.course.code,
        }
        this.posts = courseInfo.posts.map((post)=>{
            return {
                ... new PostDTO(post)
            }
        });
        this.tasks=courseInfo.tasks;
        this.members=courseInfo.members;
    }
}

module.exports = CourseInfoDTO;