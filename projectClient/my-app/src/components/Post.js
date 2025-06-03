import React, {useContext, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box, Button, Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import FileList from "./FileList";
import {format} from "date-fns";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteCoursePost} from "../http/postAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";
import Loading from "./Loading";
import {observer} from "mobx-react-lite";
import NewPostFeed from "./NewPostFeed";
import {sendNewComment, updateComment} from "../http/commentAPI";
import PostComment from "./PostComment";
import * as uuid from "uuid";
import HtmlTooltip from "./HtmlTooltip";
import ConfirmDialog from "./ConfirmDialog";
import TextEditor from "./TextEditor";

const Post = ({post, editDenied, setEditDenied}) => {
    const [commentText, setCommentText] = useState('');
    const [expanded, setExpanded] = React.useState(false);
    const [fileExpanded,setFileExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen=Boolean(anchorEl);
    const {id} = useParams();
    const {CourseContent, SnackbarStore, User} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [commentIsEdit, setCommentIsEdit] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [tempCommentText, setTempCommentText] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const editPost=()=>{
        handleClose();
        setIsEdit(true);
        setEditDenied(true);
    }

    const isEmptyContent=(html)=> {
        const div = document.createElement("div");
        div.innerHTML = html;

        const text = div.textContent.replace(/\u00A0/g, '');
        return text.trim() === '';
    }

    const sendComment = () => {
        const text = commentText;
        if (!text.trim() || isEmptyContent(text)) {
            setCommentText("");
            return;
        }
        if(commentIsEdit){
            const index = post.comments.indexOf(selectedComment);
            post.comments[index]={
                id: selectedComment.id,
                text: text,
                author: User,
                status: "updating..."
            };
            updateComment(id, selectedComment.id, text).then(res=>{
                const index = post.comments.findIndex(comment=>comment.id === selectedComment.id);
                post.comments[index]=res;
                SnackbarStore.show("comment was updated successfully!", "success");
                cancelEditComment();
            }).catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
        }else{
            setCommentText('');
            const tempId = uuid.v4();
            post.comments.push({
                id: tempId,
                text: text,
                author:User,
                status:"sending..."
            })
            sendNewComment(id, post.id, "Post", text).then(r =>{
                const index = post.comments.findIndex(comment=>comment.id === tempId);
                post.comments[index]=r;
            })
                .catch((error)=>{
                    const index = post.comments.findIndex(comment=>comment.id === tempId);
                    post.comments[index].status="error";
                    SnackbarStore.show(error.response.data.message, "error");
                })
        }
        setExpanded(true);
    }

    const deletePost = ()=>{
        setLoading(true);
        deleteCoursePost(id, post.id).then((r)=>{
            SnackbarStore.show("Post was deleted!", "success");
            CourseContent.posts = CourseContent.posts.filter((Post) => Post.id !== post.id);
        })
            .catch(error=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const editComment=(Comment)=>{
        setEditDenied(true);
        setCommentIsEdit(true);
        setSelectedComment(Comment);
        setTempCommentText(commentText);
        setCommentText(Comment.text);
    }

    const cancelEditComment=()=>{
        setCommentText(tempCommentText);
        setTempCommentText("");
        setSelectedComment(null);
        setCommentIsEdit(false);
        setEditDenied(false);
    }

    return (
        <Box
            component={"div"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: "1px solid #ccc",
                borderRadius: 4,
                width: 700,
                maxWidth: 700,
                padding: 2,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                marginBottom: 3,
            }}
        >
            {
                isEdit ?
                    <NewPostFeed currentPostText={post.text} currentPostFiles={post.files} isEdit={isEdit} setIsEdit={setIsEdit} postId={post.id} setEditDenied={setEditDenied} />
                    :
                    <Box sx={{ width: '100%' }}>
                        <Loading open={loading} />
                        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                                <HtmlTooltip title={(
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar alt={post.user.name} src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{ width: 30, height: 30 }} />
                                        <Box>
                                            <Typography>{post.user.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">{post.user.email}</Typography>
                                        </Box>
                                    </Box>
                                )}>
                                    <Chip
                                        avatar={<Avatar alt={post.user.name} src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{ width: 40, height: 40 }} />}
                                        label={`${post.user.name}${post.user.id === User.id ? " (you)" : ""} • ${format(post.createdAt, "dd MMM yyyy, HH:mm")}${post.updatedAt !== post.createdAt ? " (edited)" : ""}`}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "999px",
                                            fontSize: "0.875rem",
                                            backgroundColor: "#f5f5f5",
                                            padding: "4px 8px"
                                        }}
                                    />
                                </HtmlTooltip>
                            </Box>
                            {
                                (CourseContent.course.role === "creator" || (post.user.id === User.id && CourseContent.course.role !== "member")) && !editDenied &&
                                <>
                                    <IconButton size="small" onClick={handleClick}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={menuOpen}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={editPost}>
                                            <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleClose(); setOpenConfirmDialog(true); }} sx={{ color: "error.main" }}>
                                            <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </Box>
                        <Divider sx={{ my: 1, width: "100%", borderColor: "#eee" }} />
                        {post.text && (
                            <Box
                                sx={{ marginLeft: 1, padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                                dangerouslySetInnerHTML={{ __html: post.text }}
                            />
                        )}
                        {
                            post.files.length > 0 &&
                            <Accordion expanded={fileExpanded} onChange={() => setFileExpanded(!fileExpanded)} sx={{
                                width: "100%",
                                my: 1,
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#fafafa",
                                boxShadow: "none",
                                '&:before': { display: 'none' },
                            }}>
                                <AccordionSummary sx={{ color: "blue", textDecoration: "underline" }}>
                                    {`${post.files.length} file(s)`}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FileList files={post.files} isCreate={false} />
                                </AccordionDetails>
                            </Accordion>
                        }
                        <Divider sx={{ my: 1, width: "100%", borderColor: "#eee" }} />
                        {
                            post.comments.length > 0 &&
                            <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{
                                width: "100%",
                                my: 1,
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#fafafa",
                                boxShadow: "none",
                                '&:before': { display: 'none' },
                            }}>
                                <AccordionSummary sx={{ color: "blue", textDecoration: "underline" }}>
                                    {`${post.comments.length} comment(s)`}
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        post.comments.map((comment, index) => (
                                            <Box sx={{ marginBottom: index !== post.comments.length - 1 ? 1 : 0 }} key={index}>
                                                <PostComment comment={comment} editDenied={editDenied} post={post} editComment={editComment} selectedComment={selectedComment} />
                                            </Box>
                                        ))
                                    }
                                </AccordionDetails>
                            </Accordion>
                        }
                        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, mt: 1, width: "100%",  justifyContent:"center"}}>
                            <TextEditor
                                value={commentText}
                                onChange={setCommentText}
                                type={"simple"}
                                placeholder={"Write a comment..."}
                                visible={false}
                                minHeight={"32px"}
                                maxHeight={"120px"}
                            />
                            <Box sx={{display:"flex"}}>
                                <IconButton
                                    aria-label="send"
                                    onClick={sendComment}
                                    sx={{
                                        alignSelf: "center",
                                        color: "#1976d2",
                                        '&:hover': {
                                            backgroundColor: "rgba(25, 118, 210, 0.1)"
                                        }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                                {
                                    commentIsEdit &&
                                    <Button
                                        variant={"outlined"}
                                        color="error"
                                        onClick={cancelEditComment}
                                        sx={{
                                            color: "gray",
                                            alignSelf: "center",
                                            textTransform: "none",
                                            ml:1
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                }
                            </Box>
                        </Box>
                    </Box>
            }
            <ConfirmDialog open={openConfirmDialog} title={"Delete post"} message={"Are you sure want to delete this post?"} onConfirm={deletePost} onClose={() => { setOpenConfirmDialog(false) }} />
        </Box>

    );
};

export default observer(Post);