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
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                p: 2,
                mt:1,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "background-color 0.3s",
                "&:hover": {
                    backgroundColor: "#fafafa"
                }
            }}
            className="member-card"
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                <Avatar
                    alt={invitation.user.name}
                    src={
                        invitation.user.avatarUrl ||
                        "https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
                    }
                    sx={{ width: 50, height: 50 }}
                />
                <Box>
                    <Typography fontWeight={600}>
                        {invitation.user.name}{" "}
                        <Typography component="span" variant="body2" color="text.secondary">
                            ({invitation.isMentor ? "mentor" : "member"})
                        </Typography>
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {invitation.user.email}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton aria-label="email" size="large">
                    <EmailIcon />
                </IconButton>

                <IconButton
                    aria-label="more"
                    size="large"
                    onClick={handleClick}
                    aria-haspopup="true"
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button"
                    }}
                >
                    <MenuItem onClick={editInvitation}>
                        <EditIcon sx={{ mr: 1 }} />
                        Edit role
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setOpenConfirmDialog(true);
                        }}
                        sx={{ color: "error.main" }}
                    >
                        <DeleteIcon sx={{ mr: 1 }} />
                        Delete
                    </MenuItem>
                </Menu>

                <EditInvitation
                    invitation={invitation}
                    open={editInvitationOpen}
                    setOpen={setEditInvitationOpen}
                />
            </Box>

            <ConfirmDialog
                title="Delete invitation"
                open={openConfirmDialog}
                onConfirm={deleteInvitation}
                onClose={() => {
                    setOpenConfirmDialog(false);
                }}
                message="Are you sure you want to delete this invitation?"
            />
        </Box>
    );
};

export default InvitationCard;