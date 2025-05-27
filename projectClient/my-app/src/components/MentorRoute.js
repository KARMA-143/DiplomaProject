import {useEffect, useState} from 'react';
import {checkRole} from "../http/courseAPI";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "./Loading";

const MentorRoute = ({route}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkRole(id).then(res=>{
            if(res.role==="member"){
                navigate(-1);
            }
        })
            .catch(err=>{
                navigate(-1);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [id, navigate]);
    if(loading){
        return <Loading open={loading}/>;
    }
    return route;
};

export default MentorRoute;