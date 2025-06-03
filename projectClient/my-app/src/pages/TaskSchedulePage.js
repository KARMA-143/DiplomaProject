import React, {useContext, useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import NavBar from "../components/NavBar";
import TaskCalendar from "../components/TaskCalendar";
import {getUserAssignments} from "../http/assignmentAPI";
import {Context} from "../index";
import Loading from "../components/Loading";

const TaskSchedulePage = () => {
    const {UserAssignments, SnackbarStore} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getUserAssignments().then((res)=>{
            UserAssignments.assignments=res.map((assignment) => ({
                id: assignment.id,
                openDate: new Date(assignment.openDate),
                dueDate: new Date(assignment.dueDate),
                start: new Date(assignment.openDate),
                end: new Date(assignment.dueDate),
                title: assignment.title,
                course: assignment.course,
                type: assignment.type,
                role: assignment.role,
            }));
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    },[SnackbarStore, UserAssignments]);

    if(loading){
        return <Loading open={loading}/>;
    }

    return (
        <Box>
            <NavBar TitleComponent={<Typography variant={"h6"} content={"div"}>Schedule</Typography>}/>
            <TaskCalendar events={UserAssignments.assignments}/>
        </Box>
    );
};

export default TaskSchedulePage;