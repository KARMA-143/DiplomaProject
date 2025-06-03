import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Button, Divider, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../index';
import Loading from '../components/Loading';
import {getUserAttempt, saveTestProgress, sendTestAnswer} from '../http/assignmentAPI';
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PassQuestionList from "../components/PassQuestionList";
import { TEST_PAGE_ROUTE } from "../utils/consts";
import dayjs from 'dayjs';

const PassTestPage = () => {
    const { id, testId } = useParams();
    const { SnackbarStore } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [testTitle, setTestTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [autoSubmitted, setAutoSubmitted] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const questionRefs = useMemo(() => questions.map(() => React.createRef()), [questions]);

    useEffect(() => {
        getUserAttempt(id, testId)
            .then(res => {
                setTestTitle(res.title);
                setQuestions(res.questions);
                setAnswers(res.answers);

                const start = dayjs(res.startTime);
                const limitMinutes = res.timeLimit;
                const end = start.add(limitMinutes, 'minute');
                const secondsLeft = end.diff(dayjs(), 'second');

                setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
                setDataLoaded(true);
            })
            .catch(err => {
                navigate(-1);
                SnackbarStore.show(err.response?.data?.message, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [SnackbarStore, id, testId, navigate]);

    useEffect(() => {
        if (!dataLoaded) return;

        if (timeLeft <= 0 && !autoSubmitted) {
            setAutoSubmitted(true);
            sendAnswer(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, autoSubmitted, dataLoaded]);

    useEffect(() => {
        if (!dataLoaded) return;

        const autoSaveInterval = setInterval(() => {
            if (answers.length > 0) {
                saveProgress();
            }
        }, 30 * 1000);

        const saveProgress = () => {
            saveTestProgress(id, testId, answers).then((res)=>{})
                .catch(err=>{});
        };


        return () => clearInterval(autoSaveInterval);
    }, [answers, dataLoaded, id, testId]);


    const formatTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const sendAnswer = (auto = false) => {
        setLoading(true);
        sendTestAnswer(id, testId, answers)
            .then(() => {
                navigate(TEST_PAGE_ROUTE.replace(":id", id).replace(":testId", testId));
            })
            .catch(err => {
                SnackbarStore.show(err.response?.data?.message || "Failed to submit test", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <Loading open={loading} />;
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ width: '90%', height: '95vh', display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'white', borderRadius: 4 }}>
                    <Typography variant="h5" fontWeight="bold">{testTitle}</Typography>
                    <Typography variant="body2" color={timeLeft <= 30 ? "error" : "text.secondary"}>
                        Time left: {formatTime(timeLeft)}
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                        <PassQuestionList questionRefs={questionRefs} questions={questions} answers={answers} setAnswers={setAnswers} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", px: 1, pt: 2 }}>
                        {questions.map((q, index) => {
                            const icon = {
                                singleChoice: <RadioButtonCheckedIcon fontSize="small" />,
                                multipleChoice: <CheckBoxIcon fontSize="small" />,
                                openEnded: <ShortTextIcon fontSize="small" />,
                                matching: <SwapHorizIcon fontSize="small" />,
                            }[q.type] || null;

                            return (
                                <IconButton
                                    size="small"
                                    key={index}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        border: "1px solid #ccc",
                                        backgroundColor: (answers[index] && answers[index]?.length !== 0) ? "lightblue" : "transparent",
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
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 2, borderTop: '1px solid #ddd', position: 'sticky', bottom: 0, zIndex: 2, backgroundColor: 'white', borderRadius: 4 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => sendAnswer(false)} disabled={autoSubmitted}>
                        Finish Test
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PassTestPage;
