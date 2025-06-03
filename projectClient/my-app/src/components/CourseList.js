import React, { useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Box, Typography, Pagination } from "@mui/material";
import CourseCard from "./CourseCard";
import Loading from "./Loading";
import { getUsersAllCourse } from "../http/courseAPI";
import InfoIcon from '@mui/icons-material/Info';

const CourseList = ({ searchQuery, roleFilter, page, setPage }) => {
    const { Courses, SnackbarStore } = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUsersAllCourse(page, searchQuery, roleFilter)
            .then((r) => Courses.setData(r))
            .catch((error) => {
                SnackbarStore.show(error.response?.data?.message || 'Failed to load courses', "error");
            })
            .finally(() => setLoading(false));
    }, [page, searchQuery, roleFilter]);

    if (loading) {
        return <Loading open={loading} />;
    }

    if (Courses.courses.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 8,
                    mx: 'auto',
                    maxWidth: 400,
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <InfoIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" color="text.secondary">
                    No courses found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or role filter.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box component={"div"} className={"course-container"}>
                {Courses.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </Box>
            {Courses.pages > 1 &&
                <div className={"course-pages"}>
                    <Pagination count={Courses.pages} color="primary" page={page} onChange={(e, val) => setPage(val)} />
                </div>
            }
        </>
    );
};

export default observer(CourseList);