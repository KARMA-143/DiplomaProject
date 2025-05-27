const invitationService = require('../services/invitationService');

class invitationController {
    async getCourseInvitations(req, res, next) {
        try{
            const id = req.params.id;
            const invitations = await invitationService.getCourseInvitations(id)
            return res.status(200).json(invitations);
        }
        catch(err){
            next(err);
        }
    }

    async createInvitation(req, res, next){
        try{
            const id = req.params.id;
            const invitation = req.body;
            const newInvitation = await invitationService.createInvitation(id, invitation);
            return res.status(200).json(newInvitation);
        }
        catch(err){
            next(err);
        }
    }

    async deleteInvitation(req, res, next){
        try{
            const invitationId = req.params.invitationId;
            await invitationService.deleteInvitation(invitationId);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async updateInvitation(req, res, next){
        try {
            const invitationId = req.params.invitationId;
            const invitation = req.body;
            const updatedInvitation = await invitationService.updateInvitation(invitationId, invitation);
            return res.status(200).json(updatedInvitation);
        }
        catch(err){
            next(err);
        }
    }

    async getUserInvitationCount(req,res,next){
        try{
            const user = req.user;
            const count = await invitationService.getUserInvitationCount(user.id);
            return res.status(200).json(count);
        }
        catch (err){
            next(err);
        }
    }

    async getUsersInvitation(req,res,next){
        try{
            const user = req.user;
            const invitations = await invitationService.getUsersInvitation(user.id);
            return res.status(200).json(invitations);
        }
        catch(err){
            next(err);
        }
    }

    async deleteUserInvitation(req, res, next){
        try{
            const user = req.user;
            const id = req.params.id;
            await invitationService.deleteInvitation(id, user);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async acceptInvitation(req, res, next){
        try{
            const user = req.user;
            await invitationService.acceptInvitation(req.params.id, user);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new invitationController();