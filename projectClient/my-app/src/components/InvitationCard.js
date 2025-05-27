import React, {useContext, useState} from 'react';
import {Avatar, Box, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditInvitation from "./EditInvitation";
import ConfirmDialog from "./ConfirmDialog";
import {deleteCourseInvitation} from "../http/invitationAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";

const InvitationCard = ({invitation}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const {CourseContent, SnackbarStore} = useContext(Context);
    const menuOpen = Boolean(anchorEl);
    const [editInvitationOpen, setEditInvitationOpen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const {id} = useParams();

    const handleClick=(event)=>{
        setAnchorEl(event.currentTarget);
    }

    const handleClose=()=>{
        setAnchorEl(null);
    }

    const editInvitation = ()=>{
        handleClose();
        setEditInvitationOpen(true);
    }

    const deleteInvitation = ()=>{
        deleteCourseInvitation(id, invitation.id).then(res=>{
            console.log("a")
            const index = CourseContent.invitations.findIndex(Invitation=>Invitation.id===invitation.id);
            CourseContent.invitations.splice(index,1);
            const uploadedArray = CourseContent.invitations;
            CourseContent.invitations = uploadedArray;
            SnackbarStore.show("invitation was deleted successfully!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    }

    return (
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}} className={"member-card"}>
            <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center", width:"100%"}}>
                <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center"}}>
                    <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center"}}>
                        <Typography>{`${invitation.user.name} ${invitation.isMentor?"(mentor)":"(member)"}`}</Typography>
                    </Box>
                    <Typography color={"textSecondary"} variant={"body2"}>{invitation.user.email}</Typography>
                </Box>
            </Box>
            <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center"}}>
                <IconButton aria-label="actions" size="large" aria-haspopup="true">
                    <EmailIcon/>
                </IconButton>
                <>
                    <IconButton aria-label="actions" size="large" onClick={handleClick}
                                aria-haspopup="true">
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={editInvitation}>
                            <EditIcon sx={{marginRight: "5px"}}/>
                            Edit role
                        </MenuItem>
                        <MenuItem onClick={()=>{handleClose();setOpenConfirmDialog(true)}} sx={{color:"red"}}>
                            <DeleteIcon sx={{marginRight:"5px"}}/>
                            Delete
                        </MenuItem>
                    </Menu>
                </>
                <EditInvitation invitation={invitation} open={editInvitationOpen} setOpen={setEditInvitationOpen}/>
            </Box>
            <ConfirmDialog title={"Delete invitation"} open={openConfirmDialog} onConfirm={deleteInvitation} onClose={()=>{setOpenConfirmDialog(false)}} message={"Are you sure you want to delete invitation?"}/>
        </Box>
    );
};

export default InvitationCard;