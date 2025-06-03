import React, {useEffect, useState} from 'react';
import {Box, Divider, TextField, Typography} from "@mui/material";

const PassOpenEndedQuestion = ({Question, index, SetAnswers, Answer}) => {
    const [question, setQuestion] =useState(Question ||{});
    const [answer, setAnswer] = useState(Answer || "");

    useEffect(()=>{
        SetAnswers(answer);
    },[answer]);

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
            <Box
                sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                dangerouslySetInnerHTML={{ __html: question.text }}
            />
            <Divider/>
            <TextField
                fullWidth
                value={answer}
                size="small"
                onChange={(e) => setAnswer(e.target.value.toLowerCase())}
                variant="outlined"
                label="Your Answer"
            />
        </Box>
    );
};

export default PassOpenEndedQuestion;