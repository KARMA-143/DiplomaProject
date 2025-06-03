import React from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTE } from "../utils/consts";

const GuestPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', py: 8 }}>
            <Container maxWidth="md">
                <Box textAlign="center" mb={8}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Manage Learning with Ease
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Create courses, assign tasks, and collaborate with your team — all in one place.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: 3,
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <SchoolIcon fontSize="large" color="primary" />
                            <Typography variant="h6" mt={2}>Courses</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Create and manage courses tailored to your team’s needs.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: 3,
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <AssignmentIcon fontSize="large" color="primary" />
                            <Typography variant="h6" mt={2}>Assignments</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Easily assign and track progress on learning tasks.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: 3,
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <PeopleIcon fontSize="large" color="primary" />
                            <Typography variant="h6" mt={2}>Participants</Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Invite members, assign roles, and monitor engagement.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box textAlign="center" mt={8}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: 5,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 2
                        }}
                        onClick={() => navigate(USER_ROUTE)}
                    >
                        Get Started for Free
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default GuestPage;
