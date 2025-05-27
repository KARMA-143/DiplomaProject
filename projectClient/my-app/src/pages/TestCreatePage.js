import React, {useContext, useMemo, useState} from 'react';
import {Box, Button, Divider, IconButton, Menu, MenuItem, Paper, Stack, TextField, Typography} from "@mui/material";
import NavBar from "../components/NavBar";
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Loading from "../components/Loading";
import QuestionList from "../components/QuestionList";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {useNavigate, useParams} from "react-router-dom";
import {createNewTest} from "../http/assignmentAPI";
import {TEST_PAGE_ROUTE} from "../utils/consts";
import {Context} from "../index";

const TestCreatePage = () => {
    const [openDate, setOpenDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const {SnackbarStore} = useContext(Context);
    const [questions, setQuestions] = useState([]);
    const navigate= useNavigate();
    const {id} = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
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

    if(loading){
        return <Loading open={loading}/>
    }

    const addNewQuestion=(type)=>{
        setQuestions([...questions, {type:type}]);
        handleMenuClose();
    }

    const createTask = ()=>{
        setLoading(true);
        const data={
            questions: questions,
            openDate,
            dueDate,
            title
        }
        createNewTest(id, data).then(res=>{
            SnackbarStore.show("Test was created", "success");
            navigate(TEST_PAGE_ROUTE.replace(":id", id).replace(":testId", res.id));
        }).catch(err=>{
            SnackbarStore.show(err.response.data.message, "error");
        })
            .finally(()=>{
                setLoading(false);
            })
    }

    return (
        <Box>
            <NavBar />
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
                                        onClick={handleMenuClick}
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleMenuClose}
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
                                disabled={dateError}
                                onClick={createTask}
                            >
                                Create Test
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    );
};

export default TestCreatePage;