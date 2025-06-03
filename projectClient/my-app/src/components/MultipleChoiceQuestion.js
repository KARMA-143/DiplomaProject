import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import {observer} from "mobx-react-lite";
import TextEditor from "./TextEditor";

const MultipleChoiceQuestion = ({question, isEdit, deleteQuestion, index}) => {
    const [questionText, setQuestionText] = useState(question.text || "");
    const [options, setOptions] = useState(question.options || ["",""]);
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || [0]);

    useEffect(()=>{
        console.log(question.correctAnswer);
        question.correctAnswer = correctAnswer.map(answer=>+answer);
        question.options = options;
        question.text=questionText;
    },[correctAnswer, options, questionText]);

    const addCorrectAnswer=(index)=>{
        if(!correctAnswer.includes(index)){
            setCorrectAnswer([...correctAnswer, index].sort((a,b)=>a-b));
        }
        else{
            const foundIndex=correctAnswer.indexOf(index);
            setCorrectAnswer([...correctAnswer.slice(0,foundIndex), ...correctAnswer.slice(foundIndex+1)]);
        }
    }

    const deleteOption=(index)=>{
        const foundIndex=correctAnswer.indexOf(index);
        if(foundIndex!==-1){
            setCorrectAnswer([...correctAnswer.slice(0,foundIndex), ...correctAnswer.slice(foundIndex+1)]);
        }
        setCorrectAnswer(correctAnswer.map(answer=>{
            return answer>index?answer-1:answer;
        }))
        setOptions([...options.slice(0,index), ...options.slice(index + 1)]);
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
                        <FormGroup>
                            {options.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={correctAnswer.includes(index)}
                                            onClick={() => addCorrectAnswer(index)}
                                        />
                                    }
                                    sx={{ alignItems: "flex-start", mb: 1 }}
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                width: "100%",
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
                        </FormGroup>
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
                        <FormGroup>
                            {
                                options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox checked={correctAnswer.includes(index)} name={option} />
                                        }
                                        label={option}
                                    />
                                ))
                            }
                        </FormGroup>
                    </>
            }
        </Box>
    );
};

export default observer(MultipleChoiceQuestion);