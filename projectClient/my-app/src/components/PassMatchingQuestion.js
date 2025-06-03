import React, {useEffect, useState} from 'react';
import {Box, Divider, MenuItem, Select, Typography} from "@mui/material";

const SelectItem = ({ answers, selectedAnswer, setSelectedAnswer }) => {
    return (
        <Select
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            fullWidth
            size="small"
            displayEmpty
            sx={{ minWidth: 150, ml: 1 }}
        >
            {answers.length > 0 ? (
                answers.map((answer, index) => (
                    <MenuItem key={index} value={answer}>
                        {answer}
                    </MenuItem>
                ))
            ) : (
                <MenuItem disabled>
                    Add answers
                </MenuItem>
            )}
        </Select>
    );
};

const PassMatchingQuestion = ({Question, index, SetAnswers, Answer}) => {
    const [question, setQuestion] = useState(Question || {});
    const [answer, setAnswer] = useState(Answer || question.options.map(option=>{
        return {option:option, answer:undefined}
    }));

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
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                {question.options.map((option, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            boxShadow: 1,
                        }}
                    >
                        <Typography
                            variant="body1"
                        >
                            {option}
                        </Typography>
                        <SelectItem
                            answers={question.answers}
                            selectedAnswer={answer[index].answer}
                            setSelectedAnswer={(value) => {
                                const newOptions = [...answer];
                                newOptions[index].answer = value;
                                setAnswer(newOptions);
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PassMatchingQuestion;