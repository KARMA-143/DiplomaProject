import {useContext, useEffect, useState} from 'react';
import {checkRole} from "../http/courseAPI";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "./Loading";
import {Context} from "../index";
import {TEST_PAGE_ROUTE} from "../utils/consts";

const CourseUserRoute = ({route, path}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {Task, Test} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkRole(id).then(res=>{
            if(path===TEST_PAGE_ROUTE){
                Test.role=res.role;
            }
            else{
                Task.role=res.role;
            }
        })
            .catch(err=>{
                navigate(-1);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [id, navigate, Task, Test, path]);
    if(loading){
        return <Loading open={loading}/>;
    }
    return route;
};

export default CourseUserRoute;