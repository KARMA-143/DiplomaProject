import React, {useContext} from 'react';
import {Context} from "../index";
import {ACTIVATION_ROUTE, USER_ROUTE} from "../utils/consts";
import {Navigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const ProtectedRoute = observer(({route}) => {
    const {User} = useContext(Context);
    if (User.id === undefined) {
        return <Navigate to={USER_ROUTE} />;
    }
    if (!User.isActivated) {
        return <Navigate to={ACTIVATION_ROUTE} />;
    }
    return route;
});

export default ProtectedRoute;
