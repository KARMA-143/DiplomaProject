import React, {useContext, useState} from 'react';
import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileList from "./FileList";
import {useParams} from "react-router-dom";
import {createCoursePost, editCoursePost} from "../http/postAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Loading from "./Loading";

const NewPostFeed = ({currentPostText="", currentPostFiles=[], isEdit=false, setIsEdit, postId}) => {
    const [postText, setPostText] = React.useState(currentPostText || '');
    const [postFiles, setPostFiles] = React.useState(currentPostFiles || []);
    const fileInput = React.useRef(null);
    const [drag, setDrag] = React.useState(false);
    const {id} = useParams();
    const {CourseContent, SnackbarStore} = useContext(Context);
    const [loading, setLoading] = useState(false);

    const openFileInput=(event)=>{
        fileInput.current.click();
    }

    const setFiles = (event) => {
        setPostFiles([...postFiles, ...event.target.files]);
        console.log([...postFiles, ...event.target.files]);
    };
    const dragStartHandler=(e)=>{
        e.preventDefault();
        setDrag(true);
    }

    const dragLeaveHandler=(e)=>{
        e.preventDefault();
        setDrag(false);
    }

    const onDropHandler=(e)=>{
        e.preventDefault();
        setPostFiles([...postFiles, ...e.dataTransfer.files]);
        setDrag(false);
    }

    const createPost=()=>{
        setLoading(true);
        const data = new FormData();
        postFiles.forEach((file)=>{
            data.append('files', file);
        })
        data.append("text", postText);
        createCoursePost(id, data).then(res=>{
            CourseContent.posts=[res, ...CourseContent.posts];
            setPostText('');
            setPostFiles([]);
            SnackbarStore.show("Post was created!", "success");
        })
            .catch((error)=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const editPost=()=>{
        setLoading(true);
        const data = new FormData();
        const newFiles = postFiles.filter(file => file.id === undefined);
        const existingFiles = postFiles.filter(file => file.id !== undefined).map(file=>file.id);
        newFiles.forEach((file) => {
            data.append('files', file);
        });
        data.append("filesId", JSON.stringify(existingFiles));
        data.append("text", postText);
        editCoursePost(id, postId, data).then(res=>{
            const index = CourseContent.posts.findIndex(post=>postId === post.id);
            const updatedPosts = [
                ...CourseContent.posts.slice(0, index),
                res,
                ...CourseContent.posts.slice(index + 1),
            ];
            CourseContent.posts = updatedPosts;
            SnackbarStore.show("File was updated successfully!", "success");
        })
            .catch((error)=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
                setIsEdit(false);
                setLoading(false);
            })
    }

    return (
        <Box sx={{width:'100%'}}>
            <Loading open={loading}/>
            {
                drag?
                    <Box component="div"
                         sx={{height:"160px", display: "flex", alignItems:"center", justifyContent:"center"}}
                         onDragStart={e=>dragStartHandler(e)}
                         onDragLeave={e=>dragLeaveHandler(e)}
                         onDragOver={e=>dragStartHandler(e)}
                         onDrop={e=>onDropHandler(e)}
                    >
                        <Typography variant={"h3"}>
                            Drag and drop here
                        </Typography>
                    </Box>
                    :
                    <Box
                        onDragStart={e=>dragStartHandler(e)}
                        onDragLeave={e=>dragLeaveHandler(e)}
                        onDragOver={e=>dragStartHandler(e)}
                    >
                        <TextField
                            multiline
                            placeholder={isEdit? "type post here":"type new post here"}
                            value={postText}
                            rows={4}
                            maxRows={4}
                            size={"small"}
                            fullWidth={true}
                            onChange={(e) => setPostText(e.target.value)}
                        />
                        {
                            postFiles.length>0 &&
                            <FileList files={postFiles} isCreate={true} setFiles={setPostFiles}/>
                        }
                        <Box sx={{display: "flex", justifyContent: "flex-end", alignItems:"center"}}>
                            <IconButton title={"add file"} onClick={openFileInput}>
                                <AttachFileIcon />
                                <input
                                    type="file"
                                    hidden={true}
                                    ref={fileInput}
                                    onChange={setFiles}
                                    multiple
                                />
                            </IconButton>
                            {
                                isEdit?
                                    <>
                                        <Button variant="outlined" color={"error"} onClick={()=>setIsEdit(false)} sx={{marginRight: "5px"}}>
                                            Cancel
                                        </Button>
                                        <Button variant="outlined" onClick={editPost}>
                                            Save
                                        </Button>
                                    </>
                                    :
                                    <Button variant="outlined" onClick={createPost}>
                                        Create Post
                                    </Button>
                            }

                        </Box>
                    </Box>
            }
        </Box>
    );
};

export default observer(NewPostFeed);