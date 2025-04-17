import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import CourseCard from "../components/CourseCard";
import {Typography, Pagination, Box} from "@mui/material";
import "../styles/WorkspacePage.css";
import {getUsersAllCourse} from "../http/courseAPI";
import Loading from "../components/Loading";

const WorkspacePage = () => {
    const { Courses, SnackbarStore } = useContext(Context);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUsersAllCourse(page).then((r)=>{
            Courses.setData(r);
        })
            .catch((error)=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
            setLoading(false);
        })
    },[Courses, page, SnackbarStore]);

    const changePage=(event, value)=>{
        setPage(value);
    }

    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <>
            <NavBar />
            {
                Courses.courses.length === 0 ?
                    <Typography variant="h5">There are no courses</Typography> :
                    <Box component={"div"} className={"course-container"} >
                        {
                            Courses.courses.map((course) => {
                                return (
                                    <CourseCard key={course.id} course={course} />
                                );
                            })
                        }
                    </Box>
            }
            {Courses.pages>1 ?
                <div className={"course-pages"}>
                    <Pagination count={Courses.pages} color="primary" page={page} onChange={changePage}/>
                </div>
                :
                <></>
            }
        </>
    );
};

export default observer(WorkspacePage);
