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

const CoursePage = () => {
    const {id}=useParams();
    const navigate=useNavigate();
    const [tabValue, setTabValue] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const {CourseContent, SnackbarStore} = useContext(Context);

    useEffect(() => {
        getCourseById(id).then(r=>{
            CourseContent.setCourseContent(r.data);
        })
            .catch((err)=>{
                if(err.status === 400){
                    navigate(MAIN_ROUTE, {replace: true});
                }
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    },[id, CourseContent, navigate, SnackbarStore]);

    const handleChange=(event, value)=>{
        setTabValue(value);
    }
    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <>
            <NavBar/>
            <TabContext value={tabValue}  >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display:"flex", justifyContent:"center", marginTop: "10px"}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Feed" value={1} />
                        <Tab label="Assignments" value={2} />
                        <Tab label="Members" value={3}/>
                    </TabList>
                </Box>
                <TabPanel value={1}><CourseFeed setLoading={setLoading}/></TabPanel>
                <TabPanel value={2}><AssignmentsList/></TabPanel>
                <TabPanel value={3}><MembersList/></TabPanel>
            </TabContext>
        </>
    );
};

export default CoursePage;