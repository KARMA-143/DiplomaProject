import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Context} from "../index";
import Loading from "../components/Loading";
import {Avatar, Box, Breadcrumbs, Link, Paper, Typography} from "@mui/material";
import NavBar from "../components/NavBar";
import {COURSE_PAGE_ROUTE, TEST_PAGE_ROUTE} from "../utils/consts";
import TestResults from "../components/TestResults";
import {getCompleteTestById} from "../http/assignmentAPI";

const CompleteTestResultPage = () => {
    const [loading, setLoading] = useState(true);
    const [completeTest, setCompleteTest] = useState({});
    const { id, testId, completeTestId } = useParams();
    const { SnackbarStore } = useContext(Context);

    useEffect(() => {
        getCompleteTestById(id, completeTestId).then(res => {
            setCompleteTest(res);
            console.log(res);
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
                        {completeTest.courseName}
                    </Link>
                    <Link
                        underline="hover"
                        variant={"h6"}
                        sx={{color:"white"}}
                        href={TEST_PAGE_ROUTE.replace(":id", id).replace(":testId",testId)}
                    >
                        {completeTest.testTitle}
                    </Link>
                    <Typography variant={"h6"} content={"div"}>{completeTest?.user.name}'s answer</Typography>
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
                            alt={completeTest.user.name}
                            src={"https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"}
                            sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Box>
                            <Typography variant="h6">{completeTest.user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{completeTest.user.email}</Typography>
                        </Box>
                    </Box>
                    <TestResults testWithUserAnswers={completeTest.testWithUserAnswers} testInfo={completeTest.testInfo}/>
                </Paper>
            </Box>
        </Box>
    );
};

export default CompleteTestResultPage;