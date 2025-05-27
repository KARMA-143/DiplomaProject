import React, {useEffect} from 'react';
import Loading from "../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import {joinCourseWithCode} from "../http/courseAPI";
import {COURSE_PAGE_ROUTE, USER_ROUTE} from "../utils/consts";

const JoinCoursePage = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        joinCourseWithCode(code).then(r=>{
            localStorage.removeItem("code");
            navigate(COURSE_PAGE_ROUTE.replace(":id",r.id).replace(":tab", "feed"), {replace:true});
        })
            .catch((error)=>{
                if(error.status === 401){
                    localStorage.setItem("code",code);
                    navigate(USER_ROUTE, {replace:true});
                }
            })
    })
    return (
        <Loading/>
    );
};

export default JoinCoursePage;