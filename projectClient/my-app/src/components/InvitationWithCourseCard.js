import React, {useContext} from 'react';
import {Box, Button, Typography, Avatar} from '@mui/material';
import {Context} from "../index";
import ConfirmDialog from "./ConfirmDialog";
import {acceptUserInvitation, declineUserInvitation} from "../http/invitationAPI";
import {useNavigate} from "react-router-dom";
import {COURSE_PAGE_ROUTE} from "../utils/consts";

const InvitationWithCourseCard = ({invitation}) => {
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const {SnackbarStore, Invitations} = useContext(Context);
    const navigate = useNavigate();

    const declineInvitation=()=>{
        declineUserInvitation(invitation.id).then(r=>{
            const index = Invitations.invitations.findIndex(Invitation => Invitation.id === invitation.id);
            Invitations.invitations.splice(index,1);
            const uploadedArray = Invitations.invitations;
            Invitations.invitations = uploadedArray;
            SnackbarStore.show("Invitation was declined!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    };

    const acceptInvitation=()=>{
        acceptUserInvitation(invitation.id).then(r=>{
            navigate(COURSE_PAGE_ROUTE.replace(":id", invitation.course.id).replace(":tab", "feed"));
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '10px',
                width: "700px",
                padding: "10px"
            }}
        >
            <Avatar
                variant="rounded"
                src={invitation.course.cover}
                alt="Course cover"
                sx={{width: 200, height: 150}}
            />
            <Box sx={{display: "flex", flexDirection: "column", justifyContent:"space-between", width: "100%", height:"100%"}}>
                <Box sx={{flexGrow: 1, mx: 2, justifyContent:"flex-start"}}>
                    <Typography variant="h6">{invitation.course.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Owner: {invitation.course.owner.name}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{mt: 1}}>
                        Role: {invitation.isMentor ? 'Mentor' : 'Member'}
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent:"flex-end"}}>
                    <Button variant="outlined" color="error" onClick={()=>{setOpenConfirmDialog(true)}} sx={{marginRight: '5px'}}>
                        Decline
                    </Button>
                    <Button variant="contained" color="primary" onClick={acceptInvitation}>
                        Accept
                    </Button>
                </Box>
            </Box>
            <ConfirmDialog open={openConfirmDialog} title={"Decline invitation"} onConfirm={declineInvitation} message={"Are you sure want to decline this invitation?"} onClose={()=>{setOpenConfirmDialog(false)}}/>
        </Box>
    );
};

export default InvitationWithCourseCard;
