import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import {USER_ROUTE} from "../utils/consts";

const GuestPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Manage Learning with Ease
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Create courses, assign tasks, and communicate with participants — all in one place.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <SchoolIcon fontSize="large" color="primary" />
                        <Typography variant="h6" mt={2}>Courses</Typography>
                        <Typography variant="body2">Create, manage, and customize your learning programs.</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <AssignmentIcon fontSize="large" color="primary" />
                        <Typography variant="h6" mt={2}>Assignments</Typography>
                        <Typography variant="body2">Assign tasks, track progress, and deadlines.</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <PeopleIcon fontSize="large" color="primary" />
                        <Typography variant="h6" mt={2}>Participants</Typography>
                        <Typography variant="body2">Invite students and instructors, monitor activity.</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box textAlign="center" mt={6}>
                <Button variant="contained" size="large" onClick={() => navigate(USER_ROUTE)}>
                    Get Started for Free
                </Button>
            </Box>
        </Container>
    );
};

export default GuestPage;
