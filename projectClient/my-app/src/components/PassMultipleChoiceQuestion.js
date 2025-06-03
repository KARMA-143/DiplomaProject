import React, {useEffect, useState} from 'react';
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Typography
} from "@mui/material";


const PassMultipleChoiceQuestion = ({Question, index, SetAnswers, Answer}) => {
    const [question, setQuestion] = useState(Question || {});
    const [answer, setAnswer] = useState( Answer || []);

    useEffect(()=>{
        SetAnswers(answer);
    },[answer]);

    const handleChange=(index)=>{
        if(!answer.includes(index)){
            setAnswer([...answer, index].sort((a,b)=>a-b));
        }
        else{
            const foundIndex=answer.indexOf(index);
            setAnswer([...answer.slice(0,foundIndex), ...answer.slice(foundIndex+1)]);
        }
    }

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
            <FormGroup>
                {
                    question?.options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={answer.includes(index)}
                                    onClick={() => handleChange(index)}
                                />
                            }
                            label={option}
                        />
                    ))
                }
            </FormGroup>
        </Box>
    );
};

export default PassMultipleChoiceQuestion;