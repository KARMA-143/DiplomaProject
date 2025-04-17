import React from 'react';
import {Routes as routes, authRoutes} from "../routes";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
    return (
        <Routes>
            {routes.map(({path, Component}) => {
                return <Route key={path} path={path} element={<Component/>} exact/>;
            })}
            {
              authRoutes.map(({path, Component}) => {
                  return <Route key={path} path={path} element={<ProtectedRoute route={<Component/>}/>} exact/>;
              })
            }
        </Routes>
    );
};

export default AppRouter;