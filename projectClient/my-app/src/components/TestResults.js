import React, { useEffect, useRef } from 'react';
import SingleChoiceResult from './SingleChoiceResult';
import MultipleChoiceResult from './MultipleChoiceResult';
import OpenEndedResult from './OpenEndedResult';
import MatchingResult from './MatchingResult';

import {
    Box,
    Typography,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    Stack,
} from '@mui/material';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const TestResults = ({ testWithUserAnswers, testInfo }) => {
    const questionRefs = useRef([]);

    useEffect(() => {
        questionRefs.current = questionRefs.current.slice(0, testWithUserAnswers.length);
    }, [testWithUserAnswers]);

    const questionComponents = {
        singleChoice: SingleChoiceResult,
        multipleChoice: MultipleChoiceResult,
        openEnded: OpenEndedResult,
        matching: MatchingResult,
    };

    const getColorByPoints = (points) => {
        if (points === 1) return '#d0f0c0';
        if (points === 0.5) return '#fff9c4';
        return '#ffcdd2';
    };

    const getBorderColorByPoints = (points) => {
        if (points === 1) return '#4caf50';
        if (points === 0.5) return '#ffeb3b';
        return '#f44336';
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 3, p: 2, height: '75vh' }}>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Box sx={{ flex: 1, pr: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Test Results
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                            <strong>Mark:</strong> {testInfo?.mark ?? '—'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Correct answers:</strong> {testInfo?.correctAnswers}/{testWithUserAnswers?.length}
                        </Typography>
                    </Paper>

                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        {testWithUserAnswers.map((question, index) => {
                            const Component = questionComponents[question.type];
                            return Component ? (
                                <Box
                                    key={index}
                                    ref={(el) => (questionRefs.current[index] = el)}
                                    sx={{ mb: 3 }}
                                >
                                    <Component question={question} index={index} />
                                </Box>
                            ) : null;
                        })}
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: 70,
                        flexShrink: 0,
                        height: '100%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderLeft: '1px solid #eee',
                        pl: 1,
                    }}
                >
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        {testWithUserAnswers.map((q, index) => {
                            const icon = {
                                singleChoice: <RadioButtonCheckedIcon fontSize="small" />,
                                multipleChoice: <CheckBoxIcon fontSize="small" />,
                                openEnded: <ShortTextIcon fontSize="small" />,
                                matching: <SwapHorizIcon fontSize="small" />,
                            }[q.type] || null;

                            const bgColor = getColorByPoints(q.points);
                            const borderColor = getBorderColorByPoints(q.points);

                            return (
                                <Tooltip title={`Question ${index + 1}`} key={index} placement="left">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            border: `2px solid ${borderColor}`,
                                            backgroundColor: bgColor,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '0.75rem',
                                            p: 0.5,
                                        }}
                                        onClick={() => {
                                            questionRefs.current[index]?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'center',
                                            });
                                        }}
                                    >
                                        <span>{index + 1}</span>
                                        {icon}
                                    </IconButton>
                                </Tooltip>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};

export default TestResults;
