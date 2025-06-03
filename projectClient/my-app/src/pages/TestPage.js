import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Box, Typography, Paper, Stack, Divider, IconButton, Menu, MenuItem, TextField, Button, Breadcrumbs, Link,
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
import {checkAttempt, deleteCourseTest, editCourseTest, getCompleteTest, getTest} from "../http/assignmentAPI";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {COURSE_PAGE_ROUTE, PASS_TEST_PAGE} from "../utils/consts";
import TestResults from "../components/TestResults";
import CompleteTestCard from "../components/CompleteTestCard";
import LockIcon from "@mui/icons-material/Lock";

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
    const [titleError, setTitleError] = useState(false);
    const [dateTouched, setDateTouched] = useState(false);
    const [timeLimit, setTimeLimit]=useState(null);
    const [timeLimitError, setTimeLimitError]=useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(true);
    const [results, setResults] = useState([]);
    const [completeTests, setCompleteTests] = useState([]);

    const questionRefs = useMemo(() => questions.map(() => React.createRef()), [questions]);

    useEffect(() => {
        getTest(id, testId).then(res=>{
            Test.setTest(res);
            if(Test.role==="member"){
                checkAttempt(id, testId).then(res=>{
                    if(res?.status){
                        setIsCompleted(false);
                        if(res.status==="resume"){
                            setIsStarted(true);
                        }
                        else{
                            setIsStarted(false);
                        }
                    }
                    else{
                        setIsCompleted(true);
                        setResults(res);
                    }
                })
                    .catch(err=>{
                        SnackbarStore.show(err.response.data.message, "error");
                    })
            }
            else{
                getCompleteTest(id, testId).then(res=>{
                    setCompleteTests(res);
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
    }, [Test, id, SnackbarStore, navigate, testId]);

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
        setTimeLimit(Test.timeLimit)
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
            return dayjs.duration(diffMs).humanize();
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

    const [invalidIndices, setInvalidIndices] = useState([]);

    const sendEditRequest = () => {
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
        const data = {
            questions,
            openDate,
            dueDate,
            title,
            timeLimit
        };
        editCourseTest(id, testId, data)
            .then(res => {
                SnackbarStore.show("Test was updated successfully!", "success");
                Test.setTest(res);
                setIsEdit(false);
            })
            .catch((error) => {
                SnackbarStore.show(error.response?.data?.message || "Edit failed", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
            <NavBar TitleComponent={<Breadcrumbs aria-label="breadcrumb" sx={{color:"white"}}>
                <Link
                    underline="hover"
                    variant={"h6"}
                    sx={{color:"white"}}
                    href={COURSE_PAGE_ROUTE.replace(":id", id).replace(":tab","assignments")}
                >
                    {Test.courseName}
                </Link>
                <Typography variant={"h6"} content={"div"}>{Test.title}</Typography>
            </Breadcrumbs>}/>
            {
                isEdit?
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p: 2 }}>
                        <Paper elevation={3} sx={{ width: "90%", maxWidth: "90%", p: 2, borderRadius: 4, maxHeight: "85vh", overflow: "auto"}}>
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
                                            helperText={timeLimitError&& "time can't be undefined!"}
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
                                            <QuestionList questions={questions} isEdit={true} setQuestions={setQuestions} questionRefs={questionRefs}/>
                                        }
                                    </Box>
                                    <Box sx={{
                                        maxHeight: '80vh',
                                        overflowY: "auto",
                                    }}>
                                        <Tooltip title={"Add question"}>
                                            <IconButton
                                                onClick={handleCreateQuestionMenuClick}
                                            >
                                                <AddIcon/>
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
                                                        questionRefs[index]?.current?.scrollIntoView({
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
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p:2}}>
                            <Paper
                                elevation={3}
                                sx={{
                                    width: "90%",
                                    maxWidth: "90%",
                                    p: 2,
                                    borderRadius: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    maxHeight:"90vh",
                                    overflowY:"auto"
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" fontWeight="bold">{Test.title}</Typography>
                                    {Test.role !== "member" && (
                                        <>
                                            <IconButton onClick={handleMenuClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                                                <MenuItem onClick={editTest}>
                                                    <EditIcon sx={{ marginRight: "5px" }} />
                                                    Edit
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        setConfirmDialogOpen(true);
                                                        handleMenuClose();
                                                    }}
                                                    sx={{ color: "red" }}
                                                >
                                                    <DeleteIcon sx={{ marginRight: "5px" }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                </Stack>

                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Open: {dayjs(Test.openDate).format("DD-MM-YYYY HH:mm")} | Due: {dayjs(Test.dueDate).format("DD-MM-YYYY HH:mm")} | Duration: {dateDiffString}
                                    {Test.timeLimit && ` | Time Limit: ${Test.timeLimit} min`}
                                    {timingInfo && ` | ${timingInfo}`}
                                </Typography>

                                <Divider sx={{ my: 2 }} />
                                {
                                    Test.role!=="member" &&
                                    <>
                                        <Typography variant={"h4"}>Test questions</Typography>
                                        <Divider />
                                        <Box sx={{ display: "flex", maxHeight:"65vh", mt: 2, mb:2}}>
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    pr: 2,
                                                    maxHeight:"65vh",
                                                    overflowY: "auto",
                                                }}
                                            >
                                                {Test.questions.length > 0 && (
                                                    <QuestionList
                                                        questions={Test.questions}
                                                        isEdit={false}
                                                        questionRefs={questionRefs}
                                                    />
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    borderLeft: "1px solid #eee",
                                                    pl: 1,
                                                    overflowY: "auto",
                                                    maxHeight: "65vh",
                                                }}
                                            >
                                                <Stack spacing={1}>
                                                    {Test.questions.map((q, index) => {
                                                        const icon = {
                                                            singleChoice: <RadioButtonCheckedIcon fontSize="small" />,
                                                            multipleChoice: <CheckBoxIcon fontSize="small" />,
                                                            openEnded: <ShortTextIcon fontSize="small" />,
                                                            matching: <SwapHorizIcon fontSize="small" />,
                                                        }[q.type] || null;

                                                        return (
                                                            <Tooltip title={`Question ${index + 1}`} key={index} placement="left">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: 2,
                                                                        border: "1px solid #ccc",
                                                                        backgroundColor: "transparent",
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        fontSize: "0.75rem",
                                                                        padding: "4px",
                                                                    }}
                                                                    onClick={() => {
                                                                        questionRefs[index]?.current?.scrollIntoView({
                                                                            behavior: "smooth",
                                                                            block: "center",
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{index + 1}</span>
                                                                    {icon}
                                                                </IconButton>
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </>
                                }
                                {
                                    isCompleted?
                                        <>
                                            {
                                                results?.testWithUserAnswers?.length>0 && <TestResults testWithUserAnswers={results.testWithUserAnswers} testInfo={results.testInfo}/>
                                            }
                                        </>
                                        :
                                        (Test.isOpen || isStarted) ? <Box sx={{
                                            width:"100%",
                                            display:"flex",
                                            justifyContent:"center"
                                        }}>
                                            {
                                                isStarted?
                                                    <Button color={"primary"} variant={"outlined"} onClick={()=>navigate(PASS_TEST_PAGE.replace(":id", id).replace(":testId", testId))}>Resume</Button>
                                                    :
                                                    <Button color={"primary"} variant={"outlined"} onClick={()=>navigate(PASS_TEST_PAGE.replace(":id", id).replace(":testId", testId))}>Start</Button>
                                            }
                                        </Box>
                                            :
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
                                                    {dayjs().isBefore(dayjs(Test.openDate))
                                                        ? 'This test is not open yet'
                                                        : 'This test is already closed'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {dayjs().isBefore(dayjs(Test.openDate))
                                                        ? `The test will be available from: `
                                                        : `The test was available until: `}
                                                    <strong>
                                                        {dayjs().isBefore(dayjs(Test.openDate))
                                                            ? dayjs(Test.openDate).format('DD-MM-YYYY HH:mm')
                                                            : dayjs(Test.dueDate).format('DD-MM-YYYY HH:mm')}
                                                    </strong>
                                                </Typography>
                                            </Box>
                                }

                                {
                                    Test.role!=="member" &&
                                    <>
                                        <Divider/>
                                        <Typography variant={"h5"}>Users answers</Typography>
                                        {
                                            completeTests?.length>0 ?
                                            completeTests.map(test=>(
                                                <CompleteTestCard test={test}/>
                                            ))
                                                :
                                                <Typography variant={"h7"} color={"textSecondary"}>User answers will be placed here</Typography>
                                        }
                                    </>
                                }
                            </Paper>
                        </Box>

                        <ConfirmDialog
                            open={confirmDialogOpen}
                            onClose={() => setConfirmDialogOpen(false)}
                            title={"Delete Test"}
                            message={"Are you sure want to delete Test?"}
                            onConfirm={deleteTest}
                        />
                    </Box>
            }
        </Box>
    );
};

export default observer(TestPage);