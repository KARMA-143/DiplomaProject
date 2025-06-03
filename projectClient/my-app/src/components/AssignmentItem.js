import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {TASK_PAGE_ROUTE, TEST_PAGE_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const AssignmentItem = ({ assignment, courseId }) => {
    const open = dayjs(assignment.openDate);
    const due = dayjs(assignment.dueDate);
    const now = dayjs();
    const navigate=useNavigate();

    const openDateStr = open.format('DD.MM HH:mm');
    const dueDateStr = due.format('DD.MM HH:mm');

    const getIcon = () => {
        switch (assignment.type) {
            case 'test':
                return <QuizIcon sx={{ fontSize: 36, color: 'primary.main' }} />;
            case 'task':
            default:
                return <AssignmentIcon sx={{ fontSize: 36, color: 'primary.main' }} />;
        }
    };

    const totalDuration = dayjs.duration(due.diff(open)).humanize();

    const renderStatus = () => {
        if (due.isBefore(now)) {
            return (
                <Typography variant="body2" color="error.main" sx={{ mt: 0.2 }}>
                    Closed
                </Typography>
            );
        }

        if (open.isAfter(now)) {
            const timeUntilOpen = dayjs.duration(open.diff(now)).humanize();
            return (
                <Typography variant="body2" color="warning.main" sx={{ mt: 0.2 }}>
                    Opens in {timeUntilOpen}
                </Typography>
            );
        }

        if (due.isAfter(now)) {
            const timeUntilClose = dayjs.duration(due.diff(now)).humanize();
            return (
                <Typography variant="body2" color="success.main" sx={{ mt: 0.2 }}>
                    Closes in {timeUntilClose}
                </Typography>
            );
        }

        return null;
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                '&:hover': {
                    backgroundColor: "#ececec",
                    cursor: 'pointer',
                },
            }}
            onClick={()=>{
                console.log(assignment);
                assignment.type==="task"?
                    navigate(TASK_PAGE_ROUTE.replace(":id", courseId).replace(":taskId", assignment.id))
                    :
                    navigate(TEST_PAGE_ROUTE.replace(":id", courseId).replace(":testId", assignment.id))
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getIcon()}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    {assignment.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {openDateStr} – {dueDateStr}
                    </Typography>
                </Box>

                {renderStatus()}

                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Duration: {totalDuration}
                </Typography>
            </Box>
        </Paper>
    );
};

export default AssignmentItem;
