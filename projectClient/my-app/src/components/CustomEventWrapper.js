import React from 'react';
import HtmlTooltip from './HtmlTooltip';
import { Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import dayjs from "dayjs";

const CustomEventWrapper = ({ event, children }) => {
    const isSameDay = dayjs(event.openDate).isSame(event.dueDate, 'day');

    const formatTimeRange = () => {
        if (isSameDay) {
            return `${dayjs(event.openDate).format('HH:mm')} – ${dayjs(event.dueDate).format('HH:mm')}`;
        } else {
            return `${dayjs(event.openDate).format('DD.MM HH:mm')} – ${dayjs(event.dueDate).format('DD.MM HH:mm')}`;
        }
    };

    const getIcon = () => {
        switch (event.type) {
            case 'test':
                return <QuizIcon sx={{ mr: 0.5, fontSize: 18 }} />;
            case 'task':
            default:
                return <AssignmentIcon sx={{ mr: 0.5, fontSize: 18 }} />;
        }
    };

    return (
        <HtmlTooltip
            followCursor
            title={
                <Box
                    sx={{
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            color: event.type === 'test' ? '#d32f2f' : '#1976d2',
                        }}
                    >
                        {event.type}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getIcon()}
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                            {event.title}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <SchoolIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">{event.course.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <Typography variant="body2"><strong>Your role:</strong> {event.role}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{formatTimeRange()}</Typography>
                    </Box>
                </Box>
            }
        >
            <div>{children}</div>
        </HtmlTooltip>
    );
};

export default CustomEventWrapper;
