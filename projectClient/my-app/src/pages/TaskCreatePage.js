import React, {useRef, useState, useMemo, useContext, useEffect} from 'react';
import {
    Box, Button, TextField, Typography, Paper,
    Stack, Divider, IconButton, Breadcrumbs, Link
} from "@mui/material";
import NavBar from "../components/NavBar";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextEditor from "../components/TextEditor";
import FileList from "../components/FileList";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {createNewTask} from "../http/assignmentAPI";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import {Context} from "../index";
import {COURSE_PAGE_ROUTE, TASK_PAGE_ROUTE} from "../utils/consts";
import {getCourseById} from "../http/courseAPI";

dayjs.extend(duration);

const TaskCreatePage = () => {
    const [openDate, setOpenDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [title, setTitle] = useState("");
    const [taskText, setTaskText] = useState("");
    const [images, setImages] = useState([]);
    const [taskFiles, setTaskFiles] = useState([]);
    const [drag, setDrag] = useState(false);
    const fileInput = useRef(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const {SnackbarStore} = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState("");

    useEffect(() => {
        getCourseById(id).then(r=>{
             setCourseName(r.data.name);
        })
            .catch((err)=>{
                navigate(-1);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [id, navigate]);

    const [errors, setErrors] = useState({
        title: false,
        openDate: false,
        dueDate: false,
        taskText: false
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

    const createTask = () => {
        if (!validateFields()) return;

        setLoading(true);
        const data = new FormData();
        taskFiles.forEach((file) => data.append('files', file));
        images.forEach((imgObj) => {
            data.append('images', imgObj.file);
            data.append('imagesUrls', imgObj.url);
        });
        data.append("text", taskText);
        data.append("title", title);
        data.append("openDate", openDate);
        data.append("dueDate", dueDate);

        createNewTask(id, data).then(res => {
            SnackbarStore.show("Task was created", "success");
            navigate(TASK_PAGE_ROUTE.replace(":id", id).replace(":taskId", res.id),{replace:true});
        }).catch(err => {
            SnackbarStore.show(err.response?.data?.message || "Error", "error");
        }).finally(() => {
            setLoading(false);
        });
    };

    const openFileInput = () => fileInput.current.click();

    const setFiles = (event) => {
        setTaskFiles([...taskFiles, ...event.target.files]);
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
        setTaskFiles([...taskFiles, ...e.dataTransfer.files]);
        setDrag(false);
    };

    const dateError = useMemo(() => {
        if (openDate && dueDate) {
            return dayjs(openDate).isAfter(dayjs(dueDate));
        }
        return false;
    }, [openDate, dueDate]);

    const dateDiffString = useMemo(() => {
        if (openDate && dueDate && !dateError) {
            const diffMs = dayjs(dueDate).diff(dayjs(openDate));
            const dur = dayjs.duration(diffMs);
            const days = dur.days();
            const hours = dur.hours();
            return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        return '';
    }, [openDate, dueDate, dateError]);

    if (loading) {
        return <Loading open={loading} />;
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
                        {courseName}
                    </Link>
                    <Typography variant={"h6"} content={"div"}>Create task</Typography>
                </Breadcrumbs>
            }/>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, overflow: "hidden", p: 2 }}>
                <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p: 2, borderRadius: 4, maxHeight: "85vh", overflowY: "auto" }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Create New Task
                    </Typography>

                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            value={title}
                            size="small"
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            label="Task Title"
                            error={errors.title}
                            helperText={errors.title ? "Title is required" : ""}
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
                                            error: errors.openDate,
                                            size: "small",
                                            helperText: errors.openDate ? "Open time is required and must be before close time" : ""
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
                                            error: errors.dueDate,
                                            size: "small",
                                            helperText: errors.dueDate ? "Close time is required and must be after open time" : ""
                                        }
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>

                        {dateDiffString && !errors.openDate && !errors.dueDate && (
                            <Typography variant="body2" color="text.secondary" textAlign="right">
                                Duration: {dateDiffString}
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
                                onClick={createTask}
                                disabled={loading}
                            >
                                Create Task
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};

export default TaskCreatePage;
