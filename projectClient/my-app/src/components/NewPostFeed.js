import React, {useContext, useRef, useState} from 'react';
import {Box, Button, IconButton, Typography} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileList from "./FileList";
import {useParams} from "react-router-dom";
import {createCoursePost, editCoursePost} from "../http/postAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Loading from "./Loading";
import TextEditor from "./TextEditor";

const NewPostFeed = ({
                         currentPostText = "",
                         currentPostFiles = [],
                         isEdit = false,
                         setIsEdit,
                         postId,
                         setEditDenied
                     }) => {
    const [postText, setPostText] = useState(currentPostText || '');
    const [postFiles, setPostFiles] = useState(currentPostFiles || []);
    const fileInput = useRef(null);
    const [drag, setDrag] = useState(false);
    const {id} = useParams();
    const {CourseContent, SnackbarStore} = useContext(Context);
    const [loading, setLoading] = useState(false);

    const openFileInput = () => fileInput.current.click();

    const setFiles = (event) => {
        setPostFiles([...postFiles, ...event.target.files]);
    };

    const dragStartHandler = (e) => {
        e.preventDefault();
        setDrag(true);
    };

    const dragLeaveHandler = (e) => {
        e.preventDefault();
        setDrag(false);
    };

    const onDropHandler = (e) => {
        e.preventDefault();
        setPostFiles([...postFiles, ...e.dataTransfer.files]);
        setDrag(false);
    };

    const createPost = () => {
        setLoading(true);
        const data = new FormData();
        postFiles.forEach((file) => data.append('files', file));
        data.append("text", postText);
        createCoursePost(id, data)
            .then(res => {
                CourseContent.posts = [res, ...CourseContent.posts];
                setPostText('');
                setPostFiles([]);
                SnackbarStore.show("Post was created!", "success");
            })
            .catch(error => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {setLoading(false)});
    };

    const editPost = () => {
        setLoading(true);
        const data = new FormData();
        const newFiles = postFiles.filter(file => file.id === undefined);
        const existingFiles = postFiles.filter(file => file.id !== undefined).map(file => file.id);
        newFiles.forEach((file) => data.append('files', file));
        data.append("filesId", JSON.stringify(existingFiles));
        data.append("text", postText);
        editCoursePost(id, postId, data)
            .then(res => {
                const index = CourseContent.posts.findIndex(post => postId === post.id);
                const updatedPosts = [
                    ...CourseContent.posts.slice(0, index),
                    res,
                    ...CourseContent.posts.slice(index + 1),
                ];
                CourseContent.posts = updatedPosts;
                SnackbarStore.show("Post was updated successfully!", "success");
            })
            .catch((error) => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {
                setIsEdit(false);
                setEditDenied(false);
                setLoading(false);
            });
    };

    return (
        <Box sx={{width: '100%'}}>
            <Loading open={loading} />
            {drag ? (
                <Box component="div"
                     sx={{height: "160px", display: "flex", alignItems: "center", justifyContent: "center"}}
                     onDragStart={dragStartHandler}
                     onDragLeave={dragLeaveHandler}
                     onDragOver={dragStartHandler}
                     onDrop={onDropHandler}
                >
                    <Typography variant={"h3"}>Drag and drop here</Typography>
                </Box>
            ) : (
                <Box
                    onDragStart={dragStartHandler}
                    onDragLeave={dragLeaveHandler}
                    onDragOver={dragStartHandler}
                >
                    <TextEditor value={postText} onChange={setPostText} type={"simple"} placeholder={"Write post text here..."} minHeight={"120px"} maxHeight={"120px"}/>
                    {postFiles.length > 0 && (
                        <FileList files={postFiles} isCreate={true} setFiles={setPostFiles} />
                    )}
                    <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
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
                        {isEdit ? (
                            <>
                                <Button variant="outlined" color={"error"} onClick={() => {
                                    setIsEdit(false);
                                    setEditDenied(false);
                                }} sx={{marginRight: "5px"}}>
                                    Cancel
                                </Button>
                                <Button variant="outlined" onClick={editPost}>
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button variant="outlined" onClick={createPost}>
                                Create Post
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default observer(NewPostFeed);
