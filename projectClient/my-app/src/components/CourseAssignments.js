import React, {useContext, useEffect, useState} from 'react';
import {Box, Container, IconButton, Typography} from "@mui/material";
import Loading from "./Loading";
import {getCourseAssignments} from "../http/assignmentAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import CreateAssignmentDialog from "./CreateAssignmentDialog";
import AssignmentList from "./AssignmentList";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const CourseAssignments = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const {SnackbarStore, CourseContent} = useContext(Context);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        getCourseAssignments(id).then(res=>{
            setAssignments(res);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [SnackbarStore, id]);

    if(loading){
        return <Loading open={loading}/>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto',
                height: '80vh',
                p: 2,
            }}
        >
            <Box>
                {CourseContent.course.role !== 'member' && (
                    <Tooltip title="Add new assignment" arrow>
                        <IconButton
                            size="large"
                            onClick={() => setOpenCreateDialog(true)}
                            sx={{
                                alignSelf: 'flex-end',
                                mb: 1,
                                bgcolor:"#e1e0e0",
                                '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                },
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {assignments.length > 0 ? (
                <Container maxWidth="md" sx={{ mt: 1, width: '100%' }}>
                    <AssignmentList group={assignments} />
                </Container>
            ) : (
                <Box
                    sx={{
                        mt: 8,
                        px: 2,
                        py: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <AssignmentTurnedInIcon sx={{ fontSize: 48, mb: 1 }} color="action" />
                    <Typography variant="h6">There are no assignments yet.</Typography>
                    <Typography variant="body2">You will see assignments here when they're created.</Typography>
                </Box>
            )}

            <CreateAssignmentDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
        </Box>

    );
};

export default CourseAssignments;