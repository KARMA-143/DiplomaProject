import React from 'react';
import {Routes as routes, authRoutes, mentorRoutes, courseUserRoutes} from "../routes";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MentorRoute from "./MentorRoute";
import CourseUserRoute from "./CourseUserRoute";

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
            {
                mentorRoutes.map(({path, Component}) => {
                    return <Route key={path} path={path} element={<MentorRoute route={<Component/>}/>} exact/>;
                })
            }
            {
                courseUserRoutes.map(({path, Component}) => {
                    return <Route key={path} path={path} element={<CourseUserRoute route={<Component/>}/>} exact/>
                })
            }
        </Routes>
    );
};

export default AppRouter;