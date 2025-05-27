import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Divider,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import {observer} from "mobx-react-lite";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import TextEditor from "./TextEditor";

const SingleChoiceQuestion = ({question, isEdit, deleteQuestion}) => {
    const [questionText, setQuestionText] = useState(question.text || "");
    const [options, setOptions] = useState(question.options || ["",""]);
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || 0);

    useEffect(()=>{
        question.correctAnswer = +correctAnswer;
        question.options = options;
        question.text=questionText;
    },[correctAnswer, options, questionText]);

    const handleChange=(event)=>{
        setCorrectAnswer(event.target.value);
    }

    const deleteOption=(index)=>{
        setOptions([...options.slice(0,index), ...options.slice(index + 1)]);
        if(index<correctAnswer){
            setCorrectAnswer(correctAnswer-1);
        }
        if(+index === +correctAnswer){
            setCorrectAnswer(0);
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
                        <RadioGroup value={correctAnswer} onChange={handleChange}>
                            {options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={index}
                                    control={<Radio />}
                                    sx={{ alignItems: "flex-start", mb: 1 }}
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                width: "100%"
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                value={option}
                                                size="small"
                                                onChange={(e) => {
                                                    const newOptions = [...options];
                                                    newOptions[index] = e.target.value;
                                                    setOptions(newOptions);
                                                }}
                                                variant="outlined"
                                                placeholder="Write option..."
                                            />
                                            {options.length > 2 && (
                                                <Tooltip title="Delete option">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => deleteOption(index)}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    }
                                />
                            ))}
                        </RadioGroup>
                        <Box sx={{ textAlign: "left", mt: 2 }}>
                            <Button
                                onClick={() => setOptions([...options, ""])}
                                variant="outlined"
                                startIcon={<AddIcon />}
                            >
                                Add Option
                            </Button>
                        </Box>
                    </>
                    :
                    <>
                        <Box
                            sx={{ marginLeft: "10px", padding: "5px", wordWrap: "break-word", wordBreak: "break-all" }}
                            dangerouslySetInnerHTML={{ __html: question.text }}
                        />
                        <Divider/>
                        <RadioGroup
                            value={correctAnswer}
                        >
                            {
                                options.map((answer, index) => (
                                    <FormControlLabel value={index} control={<Radio />} label={answer} key={index}/>
                                ))
                            }
                        </RadioGroup>
                    </>
            }
        </Box>
    );
};

export default observer(SingleChoiceQuestion);