import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Box, Typography, Paper, Stack, Divider, IconButton, Menu, MenuItem, TextField, Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/ConfirmDialog";
import NavBar from "../components/NavBar";
import QuestionList from "../components/QuestionList";
import {deleteCourseTest, editCourseTest, getTest} from "../http/assignmentAPI";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {COURSE_PAGE_ROUTE} from "../utils/consts";

dayjs.extend(duration);

const TestPage = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);
    const [createQuestionAnchorEl, setCreateQuestionAnchorEl] = React.useState(null);
    const createQuestionMenuOpen = Boolean(createQuestionAnchorEl);
    const {id, testId} = useParams();
    const [loading, setLoading] = useState(true);
    const {Test, SnackbarStore} = useContext(Context);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const navigate=useNavigate();
    const [openDate, setOpenDate] = useState(Test);
    const [dueDate, setDueDate] = useState(null);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        getTest(id, testId).then(res=>{
            Test.setTest(res);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
                navigate(-1);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, []);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateQuestionMenuClick = (event) => {
        setCreateQuestionAnchorEl(event.currentTarget);
    };
    const handleCreateQuestionMenuClose = () => {
        setCreateQuestionAnchorEl(null);
    };

    const addNewQuestion=(type)=>{
        setQuestions([...questions, {type:type}]);
        handleMenuClose();
    }

    const editTest = ()=>{
        handleMenuClose();
        setLoading(true);
        setOpenDate(dayjs(Test.openDate));
        setDueDate(dayjs(Test.dueDate));
        setTitle(Test.title);
        setQuestions(Test.questions);
        setIsEdit(true);
        setLoading(false);
    }

    const dateError = useMemo(() => {
        if (openDate && dueDate) {
            return dayjs(openDate).isAfter(dayjs(dueDate));
        }
        return false;
    }, [openDate, dueDate]);

    const dateDiffString = useMemo(() => {
        if (Test.openDate && Test.dueDate) {
            const diffMs = dayjs(Test.dueDate).diff(dayjs(Test.openDate));
            const dur = dayjs.duration(diffMs);
            const days = dur.days();
            const hours = dur.hours();
            return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        return '';
    }, [Test.openDate, Test.dueDate]);

    const timingInfo = useMemo(() => {
        const now = dayjs();
        if (Test.openDate && now.isBefore(Test.openDate)) {
            const untilOpen = dayjs.duration(dayjs(Test.openDate).diff(now));
            return `Opens in: ${untilOpen.days()} day(s) ${untilOpen.hours()} hour(s)`;
        }
        if (Test.dueDate && now.isBefore(Test.dueDate)) {
            const untilDue = dayjs.duration(dayjs(Test.dueDate).diff(now));
            return `Time remaining: ${untilDue.days()} day(s) ${untilDue.hours()} hour(s)`;
        }
        return null;
    }, [Test.openDate, Test.dueDate]);

    const sendEditRequest=()=>{
        setLoading(true);
        const data={
            questions: questions,
            openDate,
            dueDate,
            title
        }
        editCourseTest(id, testId, data)
            .then(res => {
                SnackbarStore.show("Task was updated successfully!", "success");
                Test.setTest(res);
                setIsEdit(false);
            })
            .catch((error) => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const deleteTest=()=>{
        setLoading(true);
        deleteCourseTest(id, testId).then(res=>{
            navigate(COURSE_PAGE_ROUTE.replace(":id", id));
        })
            .catch(err=>{
                SnackbarStore(err.response.data.message, "error");
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
            <NavBar />
            {
                isEdit?
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p: 4, borderRadius: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Create New Test
                            </Typography>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    value={title}
                                    size="small"
                                    onChange={(e) => setTitle(e.target.value)}
                                    variant="outlined"
                                    label="Test Title"
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
                                                    error: dateError,
                                                    helperText: dateError ? "Open time must be before close time" : ""
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
                                                    error: dateError,
                                                    size: "small",
                                                    helperText: dateError ? "Close time must be after open time" : ""
                                                }
                                            }}
                                        />
                                    </Stack>
                                </LocalizationProvider>

                                {dateDiffString && (
                                    <Typography variant="body2" color="text.secondary" textAlign="right">
                                        Duration: {dateDiffString}
                                    </Typography>
                                )}

                                <Box>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Test Questions
                                    </Typography>
                                </Box>
                                <Divider />

                                <Box sx={{
                                    width:"100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems:"flex-start",
                                }}>
                                    <Box sx={{
                                        width:"100%",
                                        maxHeight: '80vh',
                                        overflowY: "auto",
                                        display:"flex",
                                        justifyContent: "flex-start",
                                    }}>
                                        {
                                            questions.length>0 &&
                                            <QuestionList questions={questions} isEdit={true} setQuestions={setQuestions}/>
                                        }
                                    </Box>
                                    <Box>
                                        <Tooltip title={"Add question"}>
                                            <IconButton
                                                onClick={handleCreateQuestionMenuClick}
                                            >
                                                <AddIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={createQuestionAnchorEl}
                                            open={createQuestionMenuOpen}
                                            onClose={handleCreateQuestionMenuClose}
                                        >
                                            <MenuItem onClick={()=>{addNewQuestion("singleChoice")}}>
                                                <RadioButtonCheckedIcon sx={{marginLeft: "5px", '&:hover': {color: "blue"}}}/>
                                                Single choice
                                            </MenuItem>
                                            <MenuItem onClick={()=>{addNewQuestion("multipleChoice")}}>
                                                <CheckBoxIcon sx={{marginLeft: "5px", '&:hover': {color: "blue"}}}/>
                                                Multiple choice
                                            </MenuItem>
                                            <MenuItem onClick={()=>{addNewQuestion("openEnded")}}>
                                                <ShortTextIcon sx={{marginLeft: "5px", '&:hover': {color: "blue"}}}/>
                                                Open ended
                                            </MenuItem>
                                            <MenuItem onClick={()=>{addNewQuestion("matching")}}>
                                                <SwapHorizIcon sx={{marginLeft: "5px", '&:hover': {color: "blue"}}}/>
                                                Matching
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </Box>

                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        variant="contained"
                                        color={"error"}
                                        onClick={()=>setIsEdit(false)}
                                        sx={{
                                            marginRight:"5px"
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={dateError}
                                        onClick={sendEditRequest}
                                    >
                                        Save Test
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>
                    :
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p: 4, borderRadius: 4 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" fontWeight="bold">
                                        {Test.title}
                                    </Typography>
                                    {Test.role!=="member" && (
                                        <>
                                            <IconButton onClick={handleMenuClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={menuOpen}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={()=>{editTest()}}>
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
                                    Open: {dayjs(Test.openDate).format('DD-MM-YYYY HH:mm')} | Due: {dayjs(Test.dueDate).format('DD-MM-YYYY HH:mm')} | Duration: {dateDiffString}
                                    {timingInfo && ` | ${timingInfo}`}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant={"h4"}>
                                    Test questions
                                </Typography>
                                <Divider/>
                                <Box sx={{
                                    width:"100%",
                                    marginTop:"10px",
                                    maxHeight: '80vh',
                                    overflowY: "auto",
                                    display:"flex",
                                    justifyContent: "flex-start",
                                }}>
                                    {
                                        Test.questions.length>0 &&
                                        <QuestionList questions={Test.questions} isEdit={false}/>
                                    }
                                </Box>
                                {
                                    Test.role!=="member"?
                                        <></>
                                        :
                                        <></>
                                }

                            </Paper>
                        </Box>
                        <ConfirmDialog open={confirmDialogOpen} onClose={()=>setConfirmDialogOpen(false)} title={"Delete Test"} message={"Are you sure want to delete Test?"} onConfirm={()=>{deleteTest()}}/>
                    </Box>
            }
        </Box>
    );
};

export default observer(TestPage);
