import React from 'react';
import {Box} from "@mui/material";
import PassSingleChoiceQuestion from "./PassSingleChoiceQuestion";
import PassMultipleChoiceQuestion from "./PassMultipleChoiceQuestion";
import PassMatchingQuestion from "./PassMatchingQuestion";
import PassOpenEndedQuestion from "./PassOpenEndedQuestion";

const PassQuestionList = ({questions, questionRefs, answers, setAnswers}) => {
    const questionComponents = {
        singleChoice: PassSingleChoiceQuestion,
        multipleChoice: PassMultipleChoiceQuestion,
        matching: PassMatchingQuestion,
        openEnded: PassOpenEndedQuestion,
    };

    return (
        <Box sx={{
            width: '100%',
        }}>
            {
                questions.map((question, index) => {
                    const Component = questionComponents[question.type];
                    if (!Component) return null;
                    return (
                        <Box
                            key={index}
                            sx={{
                                mb: index === questions.length - 1 ? '5px' : '0',
                                borderRadius: '10px',
                                padding: '8px',
                                transition: '0.2s',
                            }}
                            ref={questionRefs?.[index]}
                        >
                            <Component
                                Question={question}
                                index={index}
                                Answer={answers[index]}
                                SetAnswers={(newAnswer)=>{
                                    const newArr = [...answers];
                                    newArr[index]=newAnswer;
                                    setAnswers(newArr);
                                    }
                                }
                            />
                        </Box>
                    );
                })
            }
        </Box>
    );
};

export default PassQuestionList;