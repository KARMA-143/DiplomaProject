import React, {useEffect, useState} from 'react';
import {
    Box,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";


const PassSingleChoiceQuestion = ({Question, index, SetAnswers, Answer}) => {
    const [question, setQuestion] =useState(Question ||{});
    const [answer, setAnswer] = useState( Answer || null);

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
            mb: 3
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
            <RadioGroup
                value={answer}
                onChange={(event)=>setAnswer(event.target.value)}
            >
                {
                    question?.options.map((option, index) => (
                        <FormControlLabel value={index} control={<Radio />} label={option} key={index}/>
                    ))
                }
            </RadioGroup>
        </Box>
    );
};

export default PassSingleChoiceQuestion;