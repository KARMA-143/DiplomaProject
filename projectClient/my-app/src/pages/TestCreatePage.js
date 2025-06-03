import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    Box, Button, Divider, IconButton, Menu, MenuItem, Paper,
    Stack, TextField, Typography, Tooltip, Link, Breadcrumbs
} from "@mui/material";
import NavBar from "../components/NavBar";
import {DateTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Loading from "../components/Loading";
import QuestionList from "../components/QuestionList";
import AddIcon from "@mui/icons-material/Add";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {useNavigate, useParams} from "react-router-dom";
import {createNewTest} from "../http/assignmentAPI";
import {COURSE_PAGE_ROUTE, TEST_PAGE_ROUTE} from "../utils/consts";
import {Context} from "../index";
import {getCourseById} from "../http/courseAPI";

dayjs.extend(duration);

const TestCreatePage = () => {
    const [openDate, setOpenDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const questionRefs = useRef([]);
    const navigate = useNavigate();
    const {id} = useParams();
    const {SnackbarStore} = useContext(Context);
    const [titleError, setTitleError] = useState(false);
    const [dateTouched, setDateTouched] = useState(false);
    const [invalidIndices, setInvalidIndices] = useState([]);
    const [createQuestionAnchorEl, setCreateQuestionAnchorEl] = useState(null);
    const createQuestionMenuOpen = Boolean(createQuestionAnchorEl);
    const [courseName, setCourseName] = useState("");
    const [timeLimit, setTimeLimit] = useState(null);
    const [timeLimitError, setTimeLimitError]=useState(false);

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

    const handleCreateQuestionMenuClick = (event) => {
        setCreateQuestionAnchorEl(event.currentTarget);
    };

    const handleCreateQuestionMenuClose = () => {
        setCreateQuestionAnchorEl(null);
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
            return dayjs.duration(diffMs).humanize();
        }
        return '';
    }, [openDate, dueDate, dateError]);

    const addNewQuestion = (type) => {
        setQuestions(prev => {
            const updated = [...prev, {type}];
            questionRefs.current[updated.length - 1] = React.createRef();
            return updated;
        });
        handleCreateQuestionMenuClose();
    };

    const sendCreateRequest = () => {
        let hasError = false;

        if(!questions.length > 0) {
            SnackbarStore.show("Test required have 1 question!", "error");
            hasError = true;
        }

        if (!title.trim()) {
            setTitleError(true);
            hasError = true;
        } else {
            setTitleError(false);
        }

        if (!openDate || !dueDate) {
            setDateTouched(true);
            SnackbarStore.show("Please select both open and close dates", "error");
            hasError = true;
        } else if (dateError) {
            SnackbarStore.show("Date range is invalid", "error");
            hasError = true;
        }

        if(!timeLimit){
            setTimeLimitError(true);
            hasError=true;
        }

        const invalidQuestionIndices = [];

        const hasInvalidQuestion = questions.some((q, i) => {
            let invalid = false;

            if (!q.type || !q.text?.trim()) invalid = true;

            const hasEmptyOptions = Array.isArray(q.options) && q.options.some(opt => !opt?.trim());
            const hasEmptyAnswers = Array.isArray(q.answers) && q.answers.some(ans => !ans?.trim());

            if (q.type === "singleChoice") {
                if (!Array.isArray(q.options) || q.options.length < 2 || hasEmptyOptions) invalid = true;
                if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) invalid = true;
            }

            if (q.type === "multipleChoice") {
                if (!Array.isArray(q.options) || q.options.length < 2 || hasEmptyOptions) invalid = true;
                if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) invalid = true;
                if (q.correctAnswer.some(i => typeof i !== "number" || i < 0 || i >= q.options.length)) invalid = true;
            }

            if (q.type === "openEnded") {
                if (!q.correctAnswer?.trim()) invalid = true;
            }

            if (q.type === "matching") {
                if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) invalid = true;
                if (!Array.isArray(q.options) || q.options.length < 2 || hasEmptyOptions) invalid = true;
                if (!Array.isArray(q.answers) || q.answers.length < 2 || hasEmptyAnswers) invalid = true;
                if (q.correctAnswer.some(pair => !pair.option?.trim() || !pair.answer?.trim())) invalid = true;
            }

            if (invalid) invalidQuestionIndices.push(i);
            return invalid;
        });

        if (hasInvalidQuestion) {
            setInvalidIndices(invalidQuestionIndices);
            SnackbarStore.show("Some questions are invalid", "error");
            hasError = true;
        } else {
            setInvalidIndices([]);
        }

        if (hasError) return;

        setLoading(true);

        createNewTest(id, {
            title,
            openDate,
            dueDate,
            questions,
            timeLimit
        }).then((res) => {
            SnackbarStore.show("Test was created", "success");
            navigate(TEST_PAGE_ROUTE.replace(":id", id).replace(":testId", res.id),{replace:true});
        }).catch((err) => {
            SnackbarStore.show(err.response?.data?.message || "An error occurred", "error");
        }).finally(() => {
            setLoading(false);
        });
    };

    if (loading) return <Loading open={true} />;

    return (
        <Box sx={{height:"100vh"}}>
            <NavBar TitleComponent={<Breadcrumbs aria-label="breadcrumb" sx={{color:"white"}}>
                <Link
                    underline="hover"
                    variant={"h6"}
                    sx={{color:"white"}}
                    href={COURSE_PAGE_ROUTE.replace(":id", id).replace(":tab","assignments")}
                >
                    {courseName}
                </Link>
                <Typography variant={"h6"} content={"div"}>Create task</Typography>
            </Breadcrumbs>}/>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p: 2 }}>
                <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p: 2, borderRadius: 4, maxHeight:"85vh", overflowY:"auto" }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Create New Test
                    </Typography>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            value={title}
                            size="small"
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (e.target.value.trim()) setTitleError(false);
                            }}
                            error={titleError}
                            helperText={titleError ? "Test title is required" : ""}
                            variant="outlined"
                            label="Test Title"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                                <DateTimePicker
                                    label="Open Time"
                                    ampm={false}
                                    format="DD-MM-YYYY dddd HH:mm"
                                    value={openDate}
                                    onChange={(value) => {
                                        setOpenDate(value);
                                        setDateTouched(true);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            error: dateTouched && (!openDate || dateError),
                                            helperText: dateTouched && !openDate ? "Open date is required" : (dateError ? "Open time must be before close time" : "")
                                        }
                                    }}
                                />
                                <DateTimePicker
                                    label="Close Time"
                                    ampm={false}
                                    format="DD-MM-YYYY dddd HH:mm"
                                    value={dueDate}
                                    onChange={(value) => {
                                        setDueDate(value);
                                        setDateTouched(true);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            error: dateTouched && (!dueDate || dateError),
                                            helperText: dateTouched && !dueDate ? "Close date is required" : (dateError ? "Close time must be after open time" : "")
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Time Limit (minutes)"
                                    value={timeLimit}
                                    error={timeLimitError}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (!isNaN(val)) setTimeLimit(val);
                                        else setTimeLimit('');
                                    }}
                                    inputProps={{ min: 1 }}
                                    helperText={timeLimitError? "time can't be undefined!" : "Specify the duration allowed to complete the test"}
                                    variant="outlined"
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

                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                            <Box sx={{
                                width: "100%",
                                maxHeight: '60vh',
                                overflowY: "auto",
                                display: "flex",
                                justifyContent: "flex-start"
                            }}>
                                {questions.length > 0 && (
                                    <QuestionList
                                        questions={questions}
                                        setQuestions={setQuestions}
                                        isEdit={true}
                                        questionRefs={questionRefs.current}
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    maxHeight: '60vh',
                                    overflowY: "auto",
                                }}
                            >
                                <Tooltip title={"Add question"}>
                                    <IconButton onClick={handleCreateQuestionMenuClick}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                                {questions.map((q, index) => {
                                    const icon = {
                                        singleChoice: <RadioButtonCheckedIcon fontSize="small" />,
                                        multipleChoice: <CheckBoxIcon fontSize="small" />,
                                        openEnded: <ShortTextIcon fontSize="small" />,
                                        matching: <SwapHorizIcon fontSize="small" />,
                                    }[q.type] || null;

                                    const isInvalid = invalidIndices.includes(index);

                                    return (
                                        <IconButton
                                            size="small"
                                            key={index}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                border: isInvalid ? "2px solid red" : "1px solid #ccc",
                                                backgroundColor: isInvalid ? "#ffe6e6" : "transparent",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "0.75rem",
                                                padding: "4px",
                                                marginBottom: "8px",
                                            }}
                                            onClick={() => {
                                                questionRefs.current[index]?.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "center",
                                                });
                                            }}
                                        >
                                            <span>{index + 1}</span>
                                            {icon}
                                        </IconButton>
                                    );
                                })}
                                <Menu
                                    anchorEl={createQuestionAnchorEl}
                                    open={createQuestionMenuOpen}
                                    onClose={handleCreateQuestionMenuClose}
                                >
                                    <MenuItem onClick={() => addNewQuestion("singleChoice")}>
                                        <RadioButtonCheckedIcon sx={{ marginLeft: "5px" }} />
                                        Single choice
                                    </MenuItem>
                                    <MenuItem onClick={() => addNewQuestion("multipleChoice")}>
                                        <CheckBoxIcon sx={{ marginLeft: "5px" }} />
                                        Multiple choice
                                    </MenuItem>
                                    <MenuItem onClick={() => addNewQuestion("openEnded")}>
                                        <ShortTextIcon sx={{ marginLeft: "5px" }} />
                                        Open ended
                                    </MenuItem>
                                    <MenuItem onClick={() => addNewQuestion("matching")}>
                                        <SwapHorizIcon sx={{ marginLeft: "5px" }} />
                                        Matching
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                onClick={sendCreateRequest}
                                disabled={loading || dateError}
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