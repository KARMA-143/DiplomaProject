import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    Box, Typography, Paper, Stack, Divider, IconButton, Menu, MenuItem, TextField, Button, Link, Breadcrumbs
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import FileList from "../components/FileList";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import {deleteCourseTask, editCourseTask, getCompleteTasks, getTask, getUserTask} from "../http/assignmentAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/ConfirmDialog";
import {COURSE_PAGE_ROUTE} from "../utils/consts";
import NavBar from "../components/NavBar";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TextEditor from "../components/TextEditor";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UserTask from "../components/UserTask";
import LockIcon from '@mui/icons-material/Lock';
import SubmittedUserTaskCard from "../components/SubmittedUserTaskCard";

dayjs.extend(duration);

const TaskPage = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const {id, taskId} = useParams();
    const [loading, setLoading] = useState(true);
    const {Task, SnackbarStore} = useContext(Context);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [openDate, setOpenDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [title, setTitle] = useState("");
    const [taskText, setTaskText] = useState("");
    const [images, setImages] = useState([]);
    const [taskFiles, setTaskFiles] = useState([]);
    const [drag, setDrag] = useState(false);
    const fileInput = useRef(null);
    const [existingImages, setExistingImages] = useState([]);
    const [usersTasks, setUsersTasks]=useState([]);
    const [currentUserTask, setCurrentUserTask] = useState(null);

    useEffect(() => {
        getTask(id, taskId).then(res=>{
            Task.setTask(res);
            if(Task.role==="member"){
                getUserTask(id, taskId).then(res=>{
                    setCurrentUserTask(res);
                })
                    .catch(err=>{
                        SnackbarStore.show(err.response.data.message, "error");
                    })
            }
            else{
                getCompleteTasks(id, taskId).then(res=>{
                    setUsersTasks(res);
                })
                    .catch(err=>{
                        SnackbarStore.show(err.response.data.message, "error");
                    })
            }
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
                navigate(-1);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [id, taskId, SnackbarStore, Task, navigate]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const deleteTask = ()=>{
        setLoading(true);
        deleteCourseTask(id, taskId).then(res=>{
            navigate(COURSE_PAGE_ROUTE.replace(":id", id));
        })
            .catch(err=>{
                SnackbarStore(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const dateDiffString = useMemo(() => {
        if (Task.openDate && Task.dueDate) {
            const diffMs = dayjs(Task.dueDate).diff(dayjs(Task.openDate));
            const dur = dayjs.duration(diffMs);
            const days = Math.floor(dur.asDays());
            const hours = Math.floor(dur.asHours() % 24);
            return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        return '';
    }, [Task.openDate, Task.dueDate]);

    const timingInfo = useMemo(() => {
        const now = dayjs();
        if (Task.openDate && now.isBefore(Task.openDate)) {
            const untilOpen = dayjs.duration(dayjs(Task.openDate).diff(now));
            return `Opens in: ${untilOpen.days()} day(s) ${untilOpen.hours()} hour(s)`;
        }
        if (Task.dueDate && now.isBefore(Task.dueDate)) {
            const untilDue = dayjs.duration(dayjs(Task.dueDate).diff(now));
            return `Time remaining: ${untilDue.days()} day(s) ${untilDue.hours()} hour(s)`;
        }
        return null;
    }, [Task.openDate, Task.dueDate]);

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
        setTaskFiles([...taskFiles, ...e.dataTransfer.files]);
        setDrag(false);
    };

    const isOpenDateInvalid = useMemo(() => {
        return !openDate;
    }, [openDate]);

    const isDateOrderInvalid = useMemo(() => {
        return openDate && dueDate && dayjs(openDate).isAfter(dayjs(dueDate));
    }, [openDate, dueDate]);

    const isFormInvalid = useMemo(() => {
        return (
            !title.trim() ||
            !taskText.trim() ||
            taskFiles.length === 0 ||
            isDateOrderInvalid
        );
    }, [title, taskText, taskFiles, isDateOrderInvalid]);

    const editDateDiffString = useMemo(() => {
        if (openDate && dueDate && !isDateOrderInvalid) {
            const diffMs = dayjs(dueDate).diff(dayjs(openDate));
            const dur = dayjs.duration(diffMs);
            const days = Math.floor(dur.asDays());
            const hours = Math.floor(dur.asHours() % 24);
            return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        return '';
    }, [openDate, dueDate, isDateOrderInvalid]);

    const openFileInput = () => fileInput.current.click();

    const setFiles = (event) => {
        setTaskFiles([...taskFiles, ...event.target.files]);
    };

    const editTask = ()=>{
        handleMenuClose();
        setLoading(true);
        setOpenDate(dayjs(Task.openDate));
        setDueDate(dayjs(Task.dueDate));
        setTitle(Task.title);
        setTaskText(Task.text);
        setTaskFiles(Task.files);
        setIsEdit(true);
        setLoading(false);
    }

    const [errors, setErrors] = useState({
        title: false,
        openDate: false,
        dueDate: false,
        taskText: false,
        userTaskText: false,
        userFilesText: false,
    });

    const validateFields = () => {
        const newErrors = {
            title: title.trim() === "",
            openDate: !openDate,
            dueDate: !dueDate,
            taskText: taskText.trim() === "",
        };

        if (openDate && dueDate) {
            const isInvalid = dayjs(openDate).isAfter(dayjs(dueDate));
            newErrors.openDate = newErrors.openDate || isInvalid;
            newErrors.dueDate = newErrors.dueDate || isInvalid;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const sendRequest=()=>{
        validateFields();

        setLoading(true);
        const data = new FormData();
        const newFiles = taskFiles.filter(file => file.id === undefined);
        const existingFiles = taskFiles.filter(file => file.id !== undefined).map(file => file.id);
        newFiles.forEach((file) => data.append('files', file));
        images.forEach((imgObj) => {
            data.append('images', imgObj.file);
            data.append(`imagesUrls`, imgObj.url);
        });
        data.append("serverImages", existingImages);
        data.append("filesId", JSON.stringify(existingFiles));
        data.append("text", taskText);
        data.append("title", title);
        data.append("openDate", openDate);
        data.append("dueDate", dueDate);
        editCourseTask(id, taskId, data)
            .then(res => {
                SnackbarStore.show("Task was updated successfully!", "success");
                Task.setTask(res);
                setIsEdit(false);
            })
            .catch((error) => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <Box>
            <NavBar TitleComponent={
                <Breadcrumbs aria-label="breadcrumb" sx={{color:"white"}}>
                    <Link
                    underline="hover"
                    variant={"h6"}
                    sx={{color:"white"}}
                    href={COURSE_PAGE_ROUTE.replace(":id", id).replace(":tab","assignments")}
                    >
                    {Task.courseName}
                    </Link>
                    <Typography variant={"h6"} content={"div"}>{Task.title}</Typography>
                </Breadcrumbs>
                }/>
            {
                isEdit ?
                    <Box sx={{p: 2}}>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p:2, borderRadius: 4, overflowY:'auto', maxHeight:"85vh" }}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Edit Task
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        value={title}
                                        size="small"
                                        error={errors.taskText}
                                        helperText={ errors.taskText && "Fill text field"}
                                        onChange={(e) => setTitle(e.target.value)}
                                        variant="outlined"
                                        label="Task Title"
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <DateTimePicker
                                                label="Open Time"
                                                ampm={false}
                                                format="DD-MM-YYYY dddd HH:mm"
                                                value={openDate}
                                                onChange={setOpenDate}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        error: isOpenDateInvalid || isDateOrderInvalid || errors.openDate,
                                                        helperText: isOpenDateInvalid || errors.openDate
                                                            ? "Open time must be not empty"
                                                            : isDateOrderInvalid
                                                                ? "Open time must be before close time"
                                                                : ""
                                                    }
                                                }}
                                            />
                                            <DateTimePicker
                                                label="Close Time"
                                                ampm={false}
                                                format="DD-MM-YYYY dddd HH:mm"
                                                value={dueDate}
                                                onChange={setDueDate}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        error: isDateOrderInvalid || errors.dueDate,
                                                        helperText: isDateOrderInvalid || errors.dueDate? "Close time must be after open time" : ""
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </LocalizationProvider>

                                    {editDateDiffString && (
                                        <Typography variant="body2" color="text.secondary" textAlign="right">
                                            Duration: {editDateDiffString}
                                        </Typography>
                                    )}

                                    <Box>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Task Description
                                        </Typography>
                                        <TextEditor
                                            value={taskText}
                                            onChange={setTaskText}
                                            type="extended"
                                            images={images}
                                            setImages={setImages}
                                            placeholder="Write task text here..."
                                            minHeight="60vh"
                                            maxHeight="60vh"
                                            serverImages={existingImages}
                                            setServerImages={setExistingImages}
                                        />
                                        {errors.taskText && (
                                            <Typography variant="caption" color="error">
                                                Task description is required
                                            </Typography>
                                        )}
                                    </Box>
                                    <Divider />
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
                                            {taskFiles.length > 0 ? (
                                                <FileList files={taskFiles} isCreate={true} setFiles={setTaskFiles} />
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
                                                        onChange={setFiles}
                                                        multiple
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            variant="contained"
                                            color={"error"}
                                            onClick={()=>setIsEdit(false)}
                                            sx={{ marginRight:"5px" }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            disabled={isFormInvalid}
                                            onClick={sendRequest}
                                        >
                                            Save task
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </Box>
                    :
                    <Box sx={{p: 2}}>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", maxHeight:"85vh", p: 4, borderRadius: 4, overflowY:"auto" }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" fontWeight="bold">
                                        {Task.title}
                                    </Typography>
                                    {Task.role!=="member" && (
                                        <>
                                            <IconButton onClick={handleMenuClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={menuOpen}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={editTask}>
                                                    <EditIcon sx={{marginRight: "5px"}}/>
                                                    Edit
                                                </MenuItem>
                                                <MenuItem onClick={()=>{setConfirmDialogOpen(true);handleMenuClose();}} sx={{color:"red"}}>
                                                    <DeleteIcon sx={{marginRight:"5px"}}/>
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </Stack>

                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Open: {dayjs(Task.openDate).format('DD-MM-YYYY HH:mm')} | Due: {dayjs(Task.dueDate).format('DD-MM-YYYY HH:mm')} | Duration: {dateDiffString}
                                    {timingInfo && ` | ${timingInfo}`}
                                </Typography>
                                {
                                    ((Task.role === "member" && Task.isOpen) || Task.role !== "member") ? (
                                        <>
                                            <Divider sx={{ my: 2 }} />

                                            {Task.text && (
                                                <Box
                                                    sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                                                    dangerouslySetInnerHTML={{ __html: Task.text }}
                                                />
                                            )}

                                            {Task.files?.length > 0 && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Attached Files
                                                    </Typography>
                                                    <FileList files={Task.files} isCreate={false} />
                                                </Box>
                                            )}

                                            <Box sx={{ m: 2 }}>
                                                <Divider />
                                                {Task.role === "member" ? (
                                                    <UserTask userTask={currentUserTask} setUserTask={setCurrentUserTask} />
                                                ) : null}
                                            </Box>
                                        </>
                                    ) : (
                                        <Box
                                            sx={{
                                                mt: 3,
                                                mb: 2,
                                                px: 2,
                                                py: 3,
                                                backgroundColor: '#f5f5f5',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom color="text.secondary">
                                                <LockIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                                This task is not open yet
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                The task will be available from: <strong>{dayjs(Task.openDate).format('DD-MM-YYYY HH:mm')}</strong>
                                            </Typography>
                                        </Box>
                                    )
                                }
                                {
                                    Task.role!=="member" &&
                                    <>
                                        <Typography variant={"h5"}>Users answers</Typography>
                                    {
                                        usersTasks.length>0?
                                        usersTasks?.map((userTask, index)=>{
                                            return <SubmittedUserTaskCard userTask={userTask} key={index}/>
                                        })
                                        :
                                        <Typography variant={"h7"} color={"textSecondary"}>User answers will be placed here</Typography>
                                }
                                    </>
                                }
                            </Paper>
                        </Box>
                        <ConfirmDialog open={confirmDialogOpen} onClose={()=>setConfirmDialogOpen(false)} title={"Delete task"} message={"Are you sure want to delete task?"} onConfirm={deleteTask}/>
                    </Box>
            }
        </Box>
    );
};

export default observer(TaskPage);