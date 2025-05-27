const {Invitation, User, Course, CourseUsers} = require("../models/models");
const InvitationDTO = require("../DTO/InvitationDTO");
const sequelize = require("../db");
const InvitationWithCourseDTO = require("../DTO/InvitationWithCourseDTO");
const APIError = require("../exceptions/APIError");

class invitationService {
    async getCourseInvitations(courseId){
        const invitations = await Invitation.findAll({where:{courseId: courseId}, include: [{model:User, as:"user", attributes:["id", "name", "email"]}]});
        return invitations.map(invitation=> new InvitationDTO(invitation));
    }

    async createInvitation(courseId, invitation){
        const t = await sequelize.transaction();
        try{
            const tempInvitation = await Invitation.create({courseId: courseId, userId: invitation.userId, isMentor: invitation.isMentor},{transaction:t});
            await t.commit();
            const newInvitation = await Invitation.findOne({where:{id: tempInvitation.id}, include:[{model:User, as:"user", attributes:["id", "name", "email"]}]});
            return new InvitationDTO(newInvitation);
        }
        catch (err){
            console.log(err);
            await t.rollback();
            throw err;
        }
    }

    async getInvitedUserIds(courseId){
        const invitations = await Invitation.findAll({where:{courseId: courseId}});
        return invitations.map(invitation=> invitation.userId);
    }

    async deleteInvitation(id, user){
        const t = await sequelize.transaction();
        try{
            const invitation = await Invitation.findOne({where:{id:id, userId: user.id}});
            if(!invitation){
                throw new APIError(403, "access denied");
            }
            invitation.destroy();
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateInvitation(invitationId, invitation){
        const t = await sequelize.transaction();
        try {
            await Invitation.update({isMentor: invitation.isMentor==="mentor"},{where:{id:invitationId}});
            await t.commit();
            const updatedInvitation = await Invitation.findOne({where:{id: invitationId}, include:[{model:User, as:"user", attributes:["id", "name", "email"]}]});
            return new InvitationDTO(updatedInvitation);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async getUserInvitationCount(userId){
        return await Invitation.count({where: {userId: userId}});
    }

    async getUsersInvitation(userId){
        const invitations = await Invitation.findAll({where:{userId: userId}, include:[{model: Course, as:"course", attributes:["id", "name", "cover"], include: [{model: User, as: "creator", attributes: ["id", "name", "email"]}]}]});
        return invitations.map(invitation=> new InvitationWithCourseDTO(invitation));
    }

    async acceptInvitation(invitationId, user){
        const t = await sequelize.transaction();
        try{
            const invitation = await Invitation.findOne({where:{id:invitationId, userId:user.id}});
            if(!invitation){
                throw new APIError(403, "access denied");
            }
            await CourseUsers.create({CourseId: invitation.courseId, UserId: invitation.userId, isMentor:invitation.isMentor});
            await Invitation.destroy({where:{id: invitationId}});
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new invitationService();