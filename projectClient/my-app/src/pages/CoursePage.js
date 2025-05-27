import React, {useContext, useEffect} from 'react';
import {Box, Tab} from "@mui/material";
import NavBar from "../components/NavBar";
import {TabList, TabPanel, TabContext} from "@mui/lab";
import {getCourseById} from "../http/courseAPI";
import {useNavigate, useParams} from "react-router-dom";
import {MAIN_ROUTE} from "../utils/consts";
import Loading from "../components/Loading";
import CourseFeed from "../components/CourseFeed";
import AssignmentsList from "../components/AssignmentsList";
import MembersList from "../components/MembersList";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const CoursePage = () => {
    const {id, tab}=useParams();
    const navigate=useNavigate();
    const [tabValue, setTabValue] = React.useState(undefined);
    const [loading, setLoading] = React.useState(true);
    const {CourseContent, SnackbarStore} = useContext(Context);

    useEffect(() => {
        getCourseById(id).then(r=>{
            CourseContent.course = r.data;
            if(!["feed", "assignments", "members"].includes(tab)){
                navigate(`/course/${id}/feed`, { replace: true });
            } else {
                setTabValue(tab);
            }
        })
            .catch((err)=>{
                if(err.status === 400){
                    navigate(MAIN_ROUTE, {replace: true});
                }
                else{
                    SnackbarStore.show(err.response.data.message, "error");
                }
            })
            .finally(()=>{
                setLoading(false);
            })
    },[id, CourseContent, navigate, SnackbarStore, tab]);

    const handleChange=(event, value)=>{
        navigate(`/course/${id}/${value}`, { replace: true });
    }

    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <Box>
            <NavBar/>
            <TabContext value={tabValue}  >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display:"flex", justifyContent:"center", marginTop: "10px"}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Feed" value={"feed"} />
                        <Tab label="Assignments" value={"assignments"} />
                        <Tab label="Members" value={"members"} />
                    </TabList>
                </Box>
                <TabPanel value={"feed"}><CourseFeed/></TabPanel>
                <TabPanel value={"assignments"} sx={{ p: "5px" }}><AssignmentsList/></TabPanel>
                <TabPanel value={"members"}><MembersList/></TabPanel>
            </TabContext>
        </Box>
    );
};

export default observer(CoursePage);