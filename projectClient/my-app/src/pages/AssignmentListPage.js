import React, { useContext, useEffect, useState } from 'react';
import {Box, Container, Typography} from '@mui/material';
import NavBar from '../components/NavBar';
import { getUserAssignmentsGroupedByCourse } from '../http/assignmentAPI';
import { Context } from '../index';
import Loading from '../components/Loading';
import AssignmentList from '../components/AssignmentList';

const AssignmentListPage = () => {
    const [loading, setLoading] = useState(true);
    const [groupedAssignments, setGroupedAssignments] = useState([]);
    const { SnackbarStore } = useContext(Context);

    useEffect(() => {
        getUserAssignmentsGroupedByCourse()
            .then(res => {
                setGroupedAssignments(res);
            })
            .catch(err => {
                SnackbarStore.show(err.response?.data?.message || "Ошибка загрузки", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [SnackbarStore]);

    if (loading) {
        return <Loading open={loading} />;
    }

    return (
        <Box>
            <NavBar TitleComponent={<Typography variant={"h6"} content={"div"}>Active assignments</Typography>}/>
            <Container sx={{ mt: 4 }}>
                {groupedAssignments.map(group => (
                    <AssignmentList key={group.course.id} group={group} withHeader />
                ))}
            </Container>
        </Box>
    );
};

export default AssignmentListPage;
