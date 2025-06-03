import React from 'react';
import { Avatar, Box, Typography, Paper, Button } from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {CHECK_USER_TASK_PAGE} from "../utils/consts";

const SubmittedUserTaskCard = ({ userTask}) => {
    const navigate = useNavigate();
    const {id, taskId} = useParams();

    const handleClick = () => {
        navigate(CHECK_USER_TASK_PAGE.replace(":id", id).replace(":taskId", taskId).replace(":userTaskId", userTask.id));
    };

    return (
        <Paper
            elevation={2}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 2,
                borderRadius: 3
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    alt={userTask.User.name}
                    src={"https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"}
                    sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box>
                    <Typography variant="subtitle1"><strong>{userTask.User.name}</strong></Typography>
                    <Typography variant="body2">{userTask.User.email}</Typography>
                    {userTask.mark !== null ? (
                        <Typography variant="body2" color="success.main"><strong>Mark:</strong> {userTask.mark}</Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary"><em>Not graded yet</em></Typography>
                    )}
                </Box>
            </Box>
            <Button variant="contained" onClick={handleClick}>
                View Answer
            </Button>
        </Paper>
    );
};

export default SubmittedUserTaskCard;
