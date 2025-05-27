import {useContext, useEffect, useState} from 'react';
import {checkRole} from "../http/courseAPI";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "./Loading";
import {Context} from "../index";

const CourseUserRoute = ({route}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {Task, Test} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkRole(id).then(res=>{

            if(route?.type?.name==="TestPage"){
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
    }, [id, navigate, Task]);
    if(loading){
        return <Loading open={loading}/>;
    }
    return route;
};

export default CourseUserRoute;