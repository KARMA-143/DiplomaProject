class CourseCardDTO {
    constructor(courses){
        this.courses=courses.courses.map((course)=>{
            return {
                id:course.id,
                name:course.name,
                owner:course.creator.name,
                cover:`${process.env.API_URL}/static/${course.cover}`
            }
        });
        this.count=courses.count;
    }
}

module.exports = CourseCardDTO;