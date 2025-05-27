import React, {useContext, useRef, useState} from 'react';
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
import {sendNewComment, updatePostComment} from "../http/commentAPI";
import Comment from "./Comment";
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
    const commentRef = useRef(null);
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

    const sendComment = () => {
        const text = commentText;
        if(commentIsEdit){
            const index = post.comments.indexOf(selectedComment);
            post.comments[index]={
                id: selectedComment.id,
                text: text,
                author: User,
                status: "updating..."
            };
            updatePostComment(id, selectedComment.id, text).then(res=>{
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
        setTimeout(()=>{
            commentRef.current.focus();
            commentRef.current.setSelectionRange(
                commentRef.current.value.length,
                commentRef.current.value.length
            );
        },0)
    }

    const cancelEditComment=()=>{
        setCommentText(tempCommentText);
        setTempCommentText("");
        setSelectedComment(null);
        setCommentIsEdit(false);
        setEditDenied(false);
    }

    return (
        <Box component={"div"} sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: "1px grey solid", borderRadius: 4, width: 700, padding: "5px"}}>
            {
                isEdit?
                    <NewPostFeed currentPostText={post.text} currentPostFiles={post.files} isEdit={isEdit} setIsEdit={setIsEdit} postId={post.id} setEditDenied={setEditDenied}/>
                    :
                    <Box sx={{width:'100%'}}>
                        <Loading open={loading}/>
                        <Box component={"div"} sx={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", width:"100%"}}>
                            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center", width:"100%"}}>
                                                <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 30, height: 30}}/>
                                                <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center"}}>
                                                    <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center"}}>
                                                        <Typography>{post.user.name}</Typography>
                                                        {
                                                            User.id===post.user.id &&
                                                            <Typography sx={{marginLeft: "5px"}} color={"textSecondary"}>(you)</Typography>
                                                        }
                                                    </Box>
                                                    <Typography color={"textSecondary"} variant={"body2"}>{post.user.email}</Typography>
                                                </Box>
                                            </Box>
                                        </React.Fragment>
                                    }
                                >
                                    <Chip
                                        avatar={<Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>}
                                        label={`${post.user.name}${post.user.id===User.id?"(you)":""} ${format(post.createdAt, "dd MMM yyyy, HH:mm")}${post.updatedAt !== post.createdAt ? " (edited)" : ""}`}
                                        variant="outlined"
                                    />
                                </HtmlTooltip>
                            </Box>
                            {
                                (CourseContent.course.role==="creator" || (post.user.id===User.id && CourseContent.course.role!=="member")) && !editDenied &&
                                <>
                                    <IconButton aria-label="actions" size="small" onClick={handleClick}
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
                                        <MenuItem onClick={editPost}>
                                            <EditIcon sx={{marginRight: "5px"}}/>
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={()=>{handleClose();setOpenConfirmDialog(true);}} sx={{color:"red"}}>
                                            <DeleteIcon sx={{marginRight:"5px"}}/>
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </Box>
                        <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                        {post.text && (
                            <Box
                                sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                                dangerouslySetInnerHTML={{ __html: post.text }}
                            />
                        )}
                        {
                            post.files.length>0 &&
                            <Accordion expanded={fileExpanded} onChange={()=>setFileExpanded(!fileExpanded)} sx={{width: "100%", margin:"5px 0 5px 0", border: "1px solid grey", borderRadius:"10px"}}>
                                <AccordionSummary sx={{height: "15px", color: "blue", textDecoration: "underline"}}>
                                    {`${post.files.length} file(s)`}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FileList files={post.files} isCreate={false}/>
                                </AccordionDetails>
                            </Accordion>
                        }
                        <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                        {
                            post.comments.length > 0 &&
                            <Accordion expanded={expanded} onChange={()=>setExpanded(!expanded)} sx={{width: "100%", margin:"5px 0 5px 0", border: "1px solid grey", borderRadius:"10px"}}>
                                <AccordionSummary sx={{height: "15px", color: "blue", textDecoration: "underline"}}>
                                    {`${post.comments.length} comment(s)`}
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        post.comments.map((comment, index) => {
                                            return <Box sx={{marginBottom: index!==post.comments.length-1?"5px":"0"}} key={index}>
                                                <Comment comment={comment} editDenied={editDenied} post={post} editComment={editComment} selectedComment={selectedComment}/>
                                            </Box>
                                        })
                                    }
                                </AccordionDetails>
                            </Accordion>
                        }
                        <Box sx={{display: "flex"}}>
                            <TextEditor value={commentText} onChange={setCommentText} type={"simple"} placeholder={"Comment"} visible={false} minHeight={"24px"} maxHeight={"120"}/>
                            <IconButton aria-label="delete" onClick={sendComment}>
                                <SendIcon />
                            </IconButton>
                            {
                                commentIsEdit &&
                                <Button onClick={()=>cancelEditComment()}>
                                    Cancel
                                </Button>
                            }
                        </Box>
                    </Box>
            }
            <ConfirmDialog open={openConfirmDialog} title={"Delete post"} message={"Are you sure want to delete this post?"} onConfirm={deletePost} onClose={()=>{setOpenConfirmDialog(false)}}/>
        </Box>
    );
};

export default observer(Post);