import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Button, Divider, FormControl,
    IconButton, InputLabel,
    Menu,
    MenuItem,
    Paper, Select,
    Stack,
    Typography
} from "@mui/material";
import TextEditor from "./TextEditor";
import FileList from "./FileList";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import Loading from "./Loading";
import {createUserTask, deleteUserTask, setMark, updateUserTask} from "../http/assignmentAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";
import UserTaskComment from "./UserTaskComment";
import SendIcon from "@mui/icons-material/Send";
import {sendNewComment, updateComment} from "../http/commentAPI";
import * as uuid from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "./ConfirmDialog";

const UserTask = ({userTask, setUserTask}) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [isEdit, setIsEdit] = React.useState(userTask===null);
    const [drag, setDrag] = useState(false);
    const [userTaskTextError, setUserTaskTextError] = useState(false);
    const fileInput = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const menuOpen = Boolean(anchorEl);
    const {id, taskId, userTaskId} = useParams();
    const {SnackbarStore, User} = useContext(Context);
    const [taskExists, setTaskExists] = useState(undefined);
    const [expanded, setExpanded] = React.useState(false);
    const [editDenied, setEditDenied] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentIsEdit, setCommentIsEdit] = useState(false);
    const [tempCommentText, setTempCommentText] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedMark, setSelectedMark] = useState(userTask?.mark || '');

    useEffect(() => {
        setText(userTask?.text || "");
        setFiles(userTask?.files || []);
        setIsEdit(userTask === null);
        setTaskExists(userTask !== null);
        setLoading(false);
    }, [userTask]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
        setFiles([...files, ...e.dataTransfer.files]);
        setDrag(false);
    };

    const openFileInput = () => fileInput.current.click();

    const SetFiles = (event) => {
        setFiles([...files, ...event.target.files]);
    };

    const validateData=()=>{
        let hasError=false;
        setUserTaskTextError(false);

        if(!text && !files){
            hasError=true;
            setUserTaskTextError(true);
        }
        return hasError;
    }

    const setEdit=()=>{
        handleMenuClose();
        setText(userTask?.text || "");
        setFiles(userTask?.files || []);
        setIsEdit(true);
    }

    const createTask=()=>{
        if(validateData()){
            return;
        }
        setLoading(true);
        const data = new FormData();
        files.forEach((file) => data.append('files', file));
        images.forEach((imgObj) => {
            data.append('images', imgObj.file);
            data.append('imagesUrls', imgObj.url);
        });
        data.append("text", text);

        createUserTask(id, taskId, data).then(res=>{
            setUserTask(res);
            setIsEdit(false);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const editTask=()=>{
        if(validateData()){
            return;
        }
        setLoading(true);
        const data = new FormData();
        const newFiles = files.filter(file => file.id === undefined);
        const existingFiles = files.filter(file => file.id !== undefined).map(file => file.id);
        newFiles.forEach((file) => data.append('files', file));
        images.forEach((imgObj) => {
            data.append('images', imgObj.file);
            data.append(`imagesUrls`, imgObj.url);
        });
        data.append("serverImages", existingImages);
        data.append("filesId", JSON.stringify(existingFiles));
        data.append("text", text);

        updateUserTask(id, taskId, data).then(res=>{
            setUserTask(res);
            setIsEdit(false);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
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
            const index = userTask.comments.indexOf(selectedComment);
            userTask.comments[index]={
                id: selectedComment.id,
                text: text,
                author: User,
                status: "updating..."
            };

            updateComment(id, selectedComment.id, text).then(res=>{
                const index = userTask.comments.findIndex(comment=>comment.id === selectedComment.id);
                userTask.comments[index]=res;
                const tempObj= {...userTask};
                setUserTask(tempObj);
                SnackbarStore.show("comment was updated successfully!", "success");
                cancelEditComment();
            }).catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })

        }else{
            setCommentText('');
            const tempId = uuid.v4();
            userTask.comments.push({
                id: tempId,
                text: text,
                author:User,
                status:"sending..."
            })
            sendNewComment(id, userTask.id, "UserTask", text).then(r =>{
                const index = userTask.comments.findIndex(comment=>comment.id === tempId);
                userTask.comments[index]=r;
                const tempObj= {...userTask};
                setUserTask(tempObj);
            })
                .catch((error)=>{
                    const index = userTask.comments.findIndex(comment=>comment.id === tempId);
                    userTask.comments[index].status="error";
                    SnackbarStore.show(error.response.data.message, "error");
                })
                .finally(()=>{
                    console.log(userTask);
                })
        }
        setExpanded(true);
    }

    const handleMarkSubmit=()=>{
        setLoading(true);
        setMark(id, userTaskId, selectedMark).then(res=>{
            userTask.mark=selectedMark;
            const newObj=userTask;
            setUserTask(newObj);
            SnackbarStore.show("Mark was set successfully!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
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

    const deleteTask=()=>{
        setLoading(true);

        deleteUserTask(id, taskId).then(res=>{
            setUserTask(null);
            SnackbarStore.show("Your answer was deleted successfully!", "success");
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <Box>
            {
                isEdit?
                    <Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Your answer
                            </Typography>
                            <TextEditor
                                value={text}
                                onChange={setText}
                                type="extended"
                                images={images}
                                setImages={setImages}
                                placeholder="Write task text here..."
                                minHeight="50vh"
                                maxHeight="50vh"
                                serverImages={existingImages}
                                setServerImages={setExistingImages}
                            />
                            {userTaskTextError && (
                                <Typography variant="caption" color="error">
                                    Text is required!
                                </Typography>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Attach Files
                            </Typography>

                            <Paper
                                variant="outlined"
                                onDragOver={dragStartHandler}
                                onDragLeave={dragLeaveHandler}
                                onDrop={onDropHandler}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: drag ? '#e3f2fd' : '#fafafa',
                                    borderColor: drag ? '#42a5f5' : '#ddd',
                                    borderStyle: 'dashed',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                            >
                                {files.length > 0 ? (
                                    <FileList files={files} isCreate={true} setFiles={setFiles} />
                                ) : (
                                    <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                                        <Typography variant="body2">
                                            Drag files here or use the button below
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                    <IconButton title="Add File" onClick={openFileInput}>
                                        <AttachFileIcon />
                                        <input
                                            type="file"
                                            hidden
                                            ref={fileInput}
                                            onChange={SetFiles}
                                            multiple
                                        />
                                    </IconButton>
                                </Box>
                            </Paper>
                            <Box sx={{
                                width:"100%",
                                display:"flex",
                                justifyContent:"flex-end",
                                mt:1,
                                alignItems:"center"
                            }}>
                                {
                                    taskExists?
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color={"error"}
                                                onClick={()=>{setIsEdit(false)}}
                                                disabled={loading}
                                                sx={{
                                                    mr:1,
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={editTask}
                                                disabled={loading}
                                            >
                                                Save Answer
                                            </Button>
                                        </Box>
                                        :
                                        <Button
                                            variant="contained"
                                            onClick={createTask}
                                            disabled={loading}
                                        >
                                            Send Answer
                                        </Button>
                                }

                            </Box>
                        </Box>
                    </Box>
                    :
                    <Box
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            {
                                userTask?.role!=="mentor" &&
                                <Typography variant="h6">Your Answer</Typography>
                            }
                            {
                                (userTask?.userId===User.id && userTask?.isEditable) &&
                                <IconButton onClick={handleMenuClick}>
                                    <MoreVertIcon />
                                </IconButton>
                            }

                            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={setEdit}>
                                    <EditIcon sx={{ marginRight: 1 }} />
                                    Edit
                                </MenuItem>
                                {
                                    userTask?.mark===null &&
                                    <MenuItem onClick={()=>{handleMenuClose();setOpenConfirmDialog(true)}} sx={{color:"red"}}>
                                        <DeleteIcon sx={{ marginRight: 1 }} />
                                        Delete
                                    </MenuItem>
                                }
                            </Menu>
                            <ConfirmDialog open={openConfirmDialog} onConfirm={deleteTask} title={"Delete answer"} message={"Are you sure want to delete you answer?"} onClose={()=>setOpenConfirmDialog(false)}/>
                        </Stack>

                        {userTask?.text && (
                            <Box
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    p: 2,
                                    backgroundColor: '#fff',
                                    mb: 2,
                                }}
                                dangerouslySetInnerHTML={{ __html: userTask.text }}
                            />
                        )}

                        {userTask?.files?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Attached Files
                                </Typography>
                                <FileList files={userTask.files} isCreate={false} />
                            </Box>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Mark
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: '1px dashed #999',
                                    backgroundColor: '#f1f1f1',
                                    p: 2,
                                    borderRadius: 2,
                                    fontStyle: userTask?.mark === null ? 'italic' : 'normal',
                                    color: userTask?.mark === null ? 'gray' : 'black',
                                }}
                            >
                                {
                                    userTask?.role==="mentor"?
                                        <>
                                            <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
                                                <InputLabel id="mark-label">Mark</InputLabel>
                                                <Select
                                                    labelId="mark-label"
                                                    id="mark-select"
                                                    value={selectedMark}
                                                    label="Mark"
                                                    onChange={(e) => setSelectedMark(e.target.value)}
                                                >
                                                    {[...Array(10)].map((_, i) => (
                                                        <MenuItem key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Button
                                                variant="contained"
                                                onClick={handleMarkSubmit}
                                                disabled={!selectedMark}
                                            >
                                                Submit Mark
                                            </Button>
                                        </>
                                        :
                                        <>
                                            {userTask?.mark !== null ? (
                                            <Typography variant="body1">
                                                <strong>Mark:</strong> {userTask?.mark}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1">
                                                The mentor has not reviewed this work yet.
                                            </Typography>
                                        )}
                                        </>
                                }

                            </Paper>
                        </Box>
                    </Box>
            }
            <Divider sx={{ my: 2 }} />

            {userTask?.comments.length > 0 && (
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
                        {`${userTask?.comments.length} comment(s)`}
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            userTask?.comments.map((comment, index) => (
                                <Box sx={{ marginBottom: index !== userTask?.comments.length - 1 ? 1 : 0 }} key={index}>
                                    <UserTaskComment userTask={userTask} comment={comment} selectedComment={selectedComment} editComment={editComment} editDenied={editDenied} setUserTask={setUserTask}/>
                                </Box>
                            ))
                        }
                    </AccordionDetails>
                </Accordion>
            )}
            {taskExists && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        backgroundColor: '#fdfdfd',
                    }}
                >
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
                </Paper>
            )}
        </Box>
    );
};

export default UserTask;