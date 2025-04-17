import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import WorkspacePage from "./WorkspacePage";
import GuestPage from "./GuestPage";
import {useNavigate} from "react-router-dom";
import {ACTIVATION_ROUTE} from "../utils/consts";
import Loading from "../components/Loading";

const MainPage = () => {
    const {User}=useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(User.isActivated===false){
            navigate(ACTIVATION_ROUTE);
        }
        setLoading(false);
    },[User.isActivated, navigate]);

    if(loading){
        return <Loading open={loading}/>
    }

    return (
        <>
            {User.id!==undefined ? <WorkspacePage /> : <GuestPage/>}
        </>
    );
};

export default observer(MainPage);