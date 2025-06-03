import React, { useContext, useEffect, useState } from 'react';
import {Avatar, Box, Breadcrumbs, Link, Paper, Typography} from "@mui/material";
import UserTask from "../components/UserTask";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import { getUserTaskById } from "../http/assignmentAPI";
import { useParams } from "react-router-dom";
import { Context } from "../index";
import {COURSE_PAGE_ROUTE, TASK_PAGE_ROUTE} from "../utils/consts";

const CheckUserTaskPage = () => {
    const [loading, setLoading] = useState(true);
    const [userTask, setUserTask] = useState({});
    const { id, taskId, userTaskId } = useParams();
    const { SnackbarStore } = useContext(Context);

    useEffect(() => {
        getUserTaskById(id, userTaskId).then(res => {
            setUserTask({...res, role:"mentor"});
        })
            .catch(err => {
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loading open={loading} />;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <NavBar TitleComponent={
                <Breadcrumbs aria-label="breadcrumb" sx={{color:"white"}}>
                    <Link
                        underline="hover"
                        variant={"h6"}
                        sx={{color:"white"}}
                        href={COURSE_PAGE_ROUTE.replace(":id", id).replace(":tab","assignments")}
                    >
                        {userTask.courseName}
                    </Link>
                    <Link
                        underline="hover"
                        variant={"h6"}
                        sx={{color:"white"}}
                        href={TASK_PAGE_ROUTE.replace(":id", id).replace(":taskId",taskId)}
                    >
                        {userTask.taskTitle}
                    </Link>
                    <Typography variant={"h6"} content={"div"}>{userTask.user.name}'s answer</Typography>
                </Breadcrumbs>
            }/>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
                overflow: "hidden",
                p: 2
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: "90%",
                        borderRadius: 4,
                        overflowY: "auto",
                        p: 4,
                        height: "100%"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Avatar
                            alt={userTask.user.name}
                            src={"https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"}
                            sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Box>
                            <Typography variant="h6">{userTask.user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{userTask.user.email}</Typography>
                        </Box>
                    </Box>
                    <UserTask userTask={userTask} setUserTask={setUserTask} />
                </Paper>
            </Box>
        </Box>
    );
};

export default CheckUserTaskPage;