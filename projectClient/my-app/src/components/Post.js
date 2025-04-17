import React, {useContext, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Divider,
    IconButton,
    InputAdornment, Menu, MenuItem,
    TextField,
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

const Post = ({post}) => {
    const [comment, setComment] = useState('');
    const [expanded, setExpanded] = React.useState(false);
    const [fileExpanded,setFileExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen=Boolean(anchorEl);
    const {id} = useParams();
    const {CourseContent, SnackbarStore} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const editPost=()=>{
        handleClose();
        setIsEdit(true);
    }

    const sendComment = () => {
        console.log(`post: ${post.id}\ncomment: ${comment}`);
    }

    const deletePost = ()=>{
        handleClose();
        setLoading(true);
        deleteCoursePost(id, post.id).then(r=>{
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

    return (
        <Box component={"div"} sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: "1px grey solid", borderRadius: 4, width: 700, padding: "5px"}}>
            {
                isEdit?
                    <NewPostFeed currentPostText={post.text} currentPostFiles={post.files} isEdit={isEdit} setIsEdit={setIsEdit} postId={post.id}/>
                    :
                    <Box sx={{width:'100%'}}>
                        <Loading open={loading}/>
                        <Box component={"div"} sx={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", width:"100%"}}>
                            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>
                                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                                    <Typography component={"span"} sx={{marginLeft: "10px", padding:"5px 0 0 0"}}>{post.user.name}</Typography>
                                    <Typography size="small" color="textSecondary" sx={{marginLeft: "10px", padding:"0 0 5px 0"}}>{`${format(post.createdAt, "dd MMM yyyy, HH:mm")}${post.updatedAt!==post.createdAt?" (edited)":""}`}</Typography>
                                </Box>
                            </Box>
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
                                <MenuItem onClick={editPost}>
                                    <EditIcon sx={{marginRight: "5px"}}/>
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={deletePost}>
                                    <DeleteIcon sx={{marginRight:"5px"}}/>
                                    Delete
                                </MenuItem>
                            </Menu>

                        </Box>
                        <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                        {
                            post.text && <Typography component={"pre"} sx={{marginLeft: "10px", padding:"5px", whiteSpace: "pre-wrap"}}>{post.text}</Typography>
                        }
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
                                            return <Box sx={{marginBottom: index!==post.comments.length-1?"5px":"0"}}>
                                                <Box component={"div"} sx={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", width:"100%"}}>
                                                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                        <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>
                                                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                            <Typography component={"span"} sx={{marginLeft: "10px", padding:"5px 0 0 0"}}>{comment.author.name}</Typography>
                                                            <Typography size="small" color="textSecondary" sx={{marginLeft: "10px", padding:"0 0 5px 0"}}>{`${format(comment.createdAt, "dd MMM yyyy, HH:mm")}${comment.updatedAt!==comment.createdAt?" (edited)":""}`}</Typography>
                                                        </Box>
                                                    </Box>

                                                    <IconButton aria-label="actions">
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Box>
                                                <Typography component={"span"} sx={{marginLeft: "10px", padding:"5px"}}>{comment.text}</Typography>
                                            </Box>
                                        })
                                    }
                                </AccordionDetails>
                            </Accordion>
                        }
                        <TextField
                            multiline
                            placeholder={"comment"}
                            value={comment}
                            maxRows={4}
                            size={"small"}
                            fullWidth={true}
                            onClick={()=>setExpanded(true)}
                            onChange={(e) => setComment(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position={"end"}>
                                        <IconButton aria-label="delete" onClick={sendComment}>
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>,
                                },
                            }}
                        />
                    </Box>
            }
        </Box>
    );
};

export default observer(Post);