import React, {useState} from 'react';
import {Box, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import MatchingQuestion from "./MatchingQuestion";
import OpenEndedQuestion from "./OpenEndedQuestion";

const QuestionList = ({questions, isEdit, setQuestions, questionRefs}) => {
    const questionComponents = {
        singleChoice: SingleChoiceQuestion,
        multipleChoice: MultipleChoiceQuestion,
        matching: MatchingQuestion,
        openEnded: OpenEndedQuestion,
    };

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const dragStartHandler = (e, question, index) => {
        setCurrentQuestion(question);
        setCurrentIndex(index);
    };

    const dragEndHandler = () => {
        setDragOverIndex(null);
    };

    const dragOverHandler = (e, index) => {
        e.preventDefault();
        if (index !== currentIndex) {
            setDragOverIndex(index);
        }
    };

    const dropHandler = (e, index) => {
        e.preventDefault();
        const newQuestions = [...questions];
        newQuestions.splice(currentIndex, 1);
        newQuestions.splice(index, 0, currentQuestion);
        setQuestions(newQuestions);
        setDragOverIndex(null);
    };

    return (
        <Box sx={{
            width: '100%',
        }}>
            {
                questions.map((question, index) => {
                    const Component = questionComponents[question.type];
                    if (!Component) return null;

                    const isDragOver = dragOverIndex === index;

                    return (
                        <Box
                            key={index}
                            sx={{
                                mb: index === questions.length - 1 ? '5px' : '0',
                                backgroundColor: isDragOver ? '#e3f2fd' : 'white', // light blue when hovered
                                border: isDragOver ? '2px dashed #2196f3' : '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '8px',
                                transition: '0.2s',
                            }}
                            onDragStart={(e) => dragStartHandler(e, question, index)}
                            onDragLeave={dragEndHandler}
                            onDragEnd={dragEndHandler}
                            onDragOver={(e) => dragOverHandler(e, index)}
                            onDrop={(e) => dropHandler(e, index)}
                            draggable={isEdit}
                            ref={questionRefs?.[index]}
                        >
                            <Component
                                question={question}
                                isEdit={isEdit}
                                index={index}
                                deleteQuestion={() => {
                                    setQuestions([...questions.slice(0, index), ...questions.slice(index + 1)]);
                                }}
                            />
                        </Box>
                    );
                })
            }
        </Box>
    );
};

export default observer(QuestionList);