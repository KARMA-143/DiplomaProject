import React, {useContext, useState} from 'react';
import {Avatar, Box, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Context} from "../index";
import {deleteCourseUser} from "../http/courseAPI";
import {useNavigate, useParams} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import {observer} from "mobx-react-lite";
import "../styles/MemberCard.css"
import ConfirmDialog from "./ConfirmDialog";
import {CHAT_PAGE_ROUTE} from "../utils/consts";

const MemberCard = ({member}) => {
    const {CourseContent, SnackbarStore, User} = useContext(Context);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const {id} = useParams();
    const [userEditIsOpen, setUserEditIsOpen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const navigate = useNavigate();

    const handleClick=(event)=>{
        setAnchorEl(event.currentTarget);
    }

    const handleClose=()=>{
        setAnchorEl(null);
    }

    const editMemberRole=()=>{
        handleClose();
        setUserEditIsOpen(true);
    }

    const deleteMember=()=>{
        deleteCourseUser(id, member.id).then(res=>{
            CourseContent.members=CourseContent.members.filter(Member=>Member.id!==member.id);
            SnackbarStore.show("Member has been deleted!", "success");
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
                    alt={member.user.name}
                    src={
                        member.user.avatarUrl ||
                        "https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
                    }
                    sx={{ width: 50, height: 50 }}
                />
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight={600}>{member.user.name}</Typography>
                        {User.id === member.user.id && (
                            <Typography color="text.secondary" variant="body2">
                                (you)
                            </Typography>
                        )}
                    </Box>
                    <Typography color="text.secondary" variant="body2">
                        {member.user.email}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {User.id !== member.user.id && (
                    <IconButton aria-label="email" size="large" onClick={()=>navigate(CHAT_PAGE_ROUTE.replace(":id", id).replace(":userId", member.user.id))}>
                        <EmailIcon />
                    </IconButton>
                )}

                {CourseContent.course.role !== "member" && User.id !== member.user.id && (
                    <>
                        <IconButton
                            aria-label="actions"
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
                            <MenuItem onClick={editMemberRole}>
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
                    </>
                )}
            </Box>

            <ChangeUserRoleModal
                member={member}
                open={userEditIsOpen}
                setOpen={setUserEditIsOpen}
            />
            <ConfirmDialog
                open={openConfirmDialog}
                onConfirm={deleteMember}
                onClose={() => {
                    setOpenConfirmDialog(false);
                }}
                message="Are you sure you want to delete this member from the course?"
                title="Delete member from course"
            />
        </Box>
    );
};

export default observer(MemberCard);