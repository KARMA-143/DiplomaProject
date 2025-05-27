import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, IconButton, MenuItem, Select, TextField, Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import TextEditor from "./TextEditor";

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


const MatchingQuestion = ({question, deleteQuestion, isEdit}) => {
    const [questionText, setQuestionText] = useState(question.text || "");
    const [answers, setAnswers] = useState(question.answers || []);
    const [options, setOptions]=useState(question.correctAnswer || [{option:"", answer:""},{option:"", answer:""}]);
    const [newAnswer, setNewAnswer] = useState("");

    const addOption=()=>{
        if(newAnswer==="")return;
        setAnswers([...answers, newAnswer]);
        setNewAnswer("");
    }

    useEffect(()=>{
        question.correctAnswer = options;
        question.options=options.map(option=>option.option);
        question.answers=answers;
        question.text=questionText;
    },[answers, options, questionText]);

    const deleteOption=(index)=>{
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    }

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
                                <IconButton size="small" sx={{ ml: 1, color: "error.main" }} onClick={deleteQuestion}>
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {options.map((option, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    gap: 1,
                                }}
                            >
                                <TextField
                                    value={option.option}
                                    size="small"
                                    onChange={(e) => {
                                        const newOptions = [...options];
                                        newOptions[index].option = e.target.value;
                                        setOptions(newOptions);
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Write option..."
                                />
                                <SelectItem
                                    answers={answers}
                                    selectedAnswer={option.answer}
                                    setSelectedAnswer={(value) => {
                                        const newOptions = [...options];
                                        newOptions[index].answer = value;
                                        setOptions(newOptions);
                                    }}
                                />
                                {options.length > 2 && (
                                    <Tooltip title="Delete option">
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteOption(index)}
                                            sx={{ color: "error.main" }}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        ))}

                        <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                            <TextField
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="Add answer"
                                size="small"
                                fullWidth
                            />
                            <IconButton color="primary" onClick={addOption}>
                                <AddIcon />
                            </IconButton>
                        </Box>

                        <Button
                            onClick={() => setOptions([...options, { option: "", answer: "" }])}
                            sx={{ mt: 2 }}
                            startIcon={<AddIcon />}
                            variant="outlined"
                        >
                            Add option
                        </Button>
                    </>
                    :
                    <>
                        <Box
                            sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                            dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                            {question.correctAnswer.map((answer, index) => (
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
                                        {answer.option}
                                    </Typography>
                                    <Typography variant="body1">
                                        — {answer.answer}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </>
            }
        </Box>
    );
};

export default MatchingQuestion;