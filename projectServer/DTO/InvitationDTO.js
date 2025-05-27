class InvitationDTO {
    constructor(invitation){
        this.id = invitation.id;
        this.isMentor = invitation.isMentor;
        this.user = {
            id: invitation.user.id,
            email: invitation.user.email,
            name: invitation.user.name,
        }
    }
}

module.exports = InvitationDTO;