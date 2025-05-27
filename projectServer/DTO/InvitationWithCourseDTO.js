class InvitationWithCourseDTO {
    constructor(invitation) {
        this.id = invitation.id;
        this.isMentor = invitation.isMentor;
        this.course = {
            id: invitation.course.id,
            name: invitation.course.name,
            cover:`${process.env.API_URL}/static/${invitation.course.cover}`,
            owner: invitation.course.creator,
        }
    }
}

module.exports = InvitationWithCourseDTO;