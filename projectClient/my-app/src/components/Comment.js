import React, {useContext, useState} from 'react';
import {Avatar, Box, Chip, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {format} from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Context} from "../index";
import {deletePostComment} from "../http/commentAPI";
import {useParams} from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

const Comment = ({comment, editDenied, post, editComment, selectedComment}) => {
    const {User, CourseContent, SnackbarStore} = useContext(Context);
    const [commentMenu, setCommentMenu] = useState(null);
    const commentMenuOpen=Boolean(commentMenu);
    const {id} = useParams();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const openCommentMenu = (event)=>{
        setCommentMenu(event.currentTarget);
    }

    const handleMenuClose=()=>{
        setCommentMenu(null);
    }

    const deleteComment=()=>{
        deletePostComment(id, comment.id).then(r=>{
            const index = post.comments.findIndex(Comment=>Comment.id===comment.id);
            post.comments.splice(index,1);
            SnackbarStore.show("Comment was deleted!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    }

    return (
        <Box sx={{border: comment===selectedComment?"black dashed 1px":"" }}>
            <Box component={"div"} sx={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", width:"100%"}}>
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Chip
                        avatar={<Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>}
                        label={`${comment.author.name}${comment.author.id===User.id?"(you)":""} ${
                        comment.createdAt===undefined ?comment.status: `${format(comment.createdAt, "dd MMM yyyy, HH:mm")}${comment.updatedAt !== comment.createdAt ? " (edited)" : ""}`}`}
                        variant="outlined"
                    />
                </Box>
                {
                    (CourseContent.course.role!=="member" || comment.author.id===User.id) && !editDenied &&
                    <>
                        <IconButton aria-label="actions" onClick={openCommentMenu}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={commentMenu}
                            open={commentMenuOpen}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {
                                comment.author.id===User.id &&
                                <MenuItem onClick={()=> {
                                    handleMenuClose();
                                    editComment(comment);
                                }}>
                                    <EditIcon sx={{marginRight: "5px"}}/>
                                    Edit
                                </MenuItem>
                            }
                            <MenuItem onClick={()=>{handleMenuClose(); setOpenConfirmDialog(true)}} sx={{color:"red"}}>
                                <DeleteIcon sx={{marginRight:"5px"}}/>
                                Delete
                            </MenuItem>
                        </Menu>
                    </>
                }
            </Box>
            <Typography component={"span"} sx={{marginLeft: "10px", padding:"5px"}}>{comment.text}</Typography>
            <ConfirmDialog open={openConfirmDialog} onConfirm={deleteComment} onClose={()=>{setOpenConfirmDialog(false)}} message={"Are you sure want to delete this comment?"} title={"Delete comment"}/>
        </Box>
    );
};

export default Comment;