import React, { useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    Avatar,
    Paper,
    Stack
} from '@mui/material';
import { Context } from "../index";
import ConfirmDialog from "./ConfirmDialog";
import { acceptUserInvitation, declineUserInvitation } from "../http/invitationAPI";
import { useNavigate } from "react-router-dom";
import { COURSE_PAGE_ROUTE } from "../utils/consts";

const InvitationWithCourseCard = ({ invitation }) => {
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const { SnackbarStore, Invitations } = useContext(Context);
    const navigate = useNavigate();

    const declineInvitation = () => {
        declineUserInvitation(invitation.id).then(() => {
            const index = Invitations.invitations.findIndex(inv => inv.id === invitation.id);
            Invitations.invitations.splice(index, 1);
            Invitations.invitations = [...Invitations.invitations];
            SnackbarStore.show("Invitation was declined!", "success");
        }).catch(err => {
            SnackbarStore.show(err.response.data.message, "error");
        });
    };

    const acceptInvitation = () => {
        acceptUserInvitation(invitation.id).then(() => {
            navigate(COURSE_PAGE_ROUTE.replace(":id", invitation.course.id).replace(":tab", "feed"));
        }).catch(err => {
            SnackbarStore.show(err.response.data.message, "error");
        });
    };

    return (
        <Paper
            elevation={4}
            sx={{
                width: 720,
                borderRadius: 3,
                overflow: 'hidden',
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                backgroundColor: 'background.default',
            }}
        >
            <Avatar
                variant="rounded"
                src={invitation.course.cover}
                alt="Course cover"
                sx={{ width: 180, height: 120 }}
            />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600}>
                        {invitation.course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Owner: {invitation.course.owner.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Role: <strong>{invitation.isMentor ? 'Mentor' : 'Member'}</strong>
                    </Typography>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenConfirmDialog(true)}
                        sx={{ mr: 1 }}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={acceptInvitation}
                    >
                        Accept
                    </Button>
                </Box>
            </Box>

            <ConfirmDialog
                open={openConfirmDialog}
                title="Decline invitation"
                message="Are you sure you want to decline this invitation?"
                onConfirm={declineInvitation}
                onClose={() => setOpenConfirmDialog(false)}
            />
        </Paper>
    );
};

export default InvitationWithCourseCard;
