import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import AssignmentItem from './AssignmentItem';
import {useNavigate, useParams} from "react-router-dom";
import {COURSE_PAGE_ROUTE} from "../utils/consts";

const AssignmentList = ({ group, withHeader = false }) => {
    const navigate = useNavigate();
    const {id} = useParams();
    return (
        <Box sx={{ mb: 4 }}>
            {withHeader && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1,
                            py: 0.5,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                transition: "color 0.3s",
                                "&:hover": {
                                    color: "primary.main",
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() =>
                                navigate(
                                    COURSE_PAGE_ROUTE.replace(":id", group.course.id).replace(":tab", "feed")
                                )
                            }
                        >
                            {group.course.name}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">
                            ({group.course.role})
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />
                </>
            )}

            {withHeader
                ? group.assignments.map((assignment) => (
                    <Box key={assignment.id} sx={{ mb: 2 }}>
                        <AssignmentItem assignment={assignment} courseId={group.course.id} />
                    </Box>
                ))
                : group.map((assignment) => (
                    <Box key={assignment.id} sx={{ mb: 2 }}>
                        <AssignmentItem assignment={assignment} courseId={id} />
                    </Box>
                ))}
        </Box>
    );
};

export default AssignmentList;
