import React, {useEffect, useState} from 'react';
import {
    Box,
    Divider,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import TextEditor from "./TextEditor";

const OpenEndedQuestion = ({question, isEdit, deleteQuestion, index}) => {
    const [questionText, setQuestionText] = useState(question.text || "");
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || "");

    useEffect(()=>{
        question.correctAnswer = correctAnswer.toLowerCase();
        question.text=questionText;
    },[correctAnswer, questionText]);

    return (
        <Box  sx={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: 2,
            backgroundColor: "#fafafa",
            boxShadow: 2,
            mb: 3,
        }}>
            <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 'bold' }}
            >
                Question {index + 1}
            </Typography>
            {
                isEdit?
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TextEditor
                                value={questionText}
                                onChange={setQuestionText}
                                type={"simple"}
                                placeholder={"Write question here..."}
                                minHeight={"120px"}
                                maxHeight={"120px"}/>
                            <Tooltip title="Delete question">
                                <IconButton
                                    size="small"
                                    sx={{ ml: 1, color: "error.main" }}
                                    onClick={deleteQuestion}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            value={correctAnswer}
                            size="small"
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            variant="outlined"
                            label="Correct Answer"
                        />
                    </>
                    :
                    <>
                        <Box
                            sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                            dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                        <Divider/>
                        <Typography variant="body1" sx={{marginLeft: "10px", padding: "5px"}}>
                            Answer: {question.correctAnswer}
                        </Typography>
                    </>
            }
        </Box>
    );
};

export default OpenEndedQuestion;