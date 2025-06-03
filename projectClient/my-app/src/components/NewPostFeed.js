import React, {useContext, useRef, useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    Paper,
    Stack,
    Tooltip
} from "@mui/material";
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
            .finally(() => { setLoading(false) });
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
        <Paper sx={{p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "#fafafa"}}>
            <Loading open={loading} />

            <TextEditor
                value={postText}
                onChange={setPostText}
                type={"simple"}
                placeholder={"Write your post..."}
                minHeight={"120px"}
                maxHeight={"120px"}
            />

            <Box
                sx={{
                    border: drag ? "2px dashed #1976d2" : "2px dashed #ccc",
                    borderRadius: 2,
                    p: 2,
                    mt: 2,
                    transition: "border-color 0.3s ease",
                    bgcolor: drag ? "#e3f2fd" : "transparent",
                    textAlign: "center",
                    cursor: "pointer"
                }}
                onDragStart={dragStartHandler}
                onDragLeave={dragLeaveHandler}
                onDragOver={dragStartHandler}
                onDrop={onDropHandler}
            >
                <Typography variant="body1" sx={{color: drag ? "#1976d2" : "text.secondary"}}>
                    {drag ? "Drop your files here" : "Drag and drop files here or use the attach icon"}
                </Typography>
            </Box>

            {postFiles.length > 0 && (
                <Box mt={2}>
                    <FileList files={postFiles} isCreate={true} setFiles={setPostFiles} />
                </Box>
            )}

            <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2} alignItems="center">
                <Tooltip title="Attach file">
                    <IconButton onClick={openFileInput} color="primary">
                        <AttachFileIcon />
                        <input
                            type="file"
                            hidden
                            ref={fileInput}
                            onChange={setFiles}
                            multiple
                        />
                    </IconButton>
                </Tooltip>

                {isEdit ? (
                    <>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                setIsEdit(false);
                                setEditDenied(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={editPost}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        onClick={createPost}
                    >
                        Create Post
                    </Button>
                )}
            </Stack>
        </Paper>
    );
};

export default observer(NewPostFeed);
