import {ACTIVATION_ROUTE, COURSE_PAGE_ROUTE, JOIN_COURSE_PAGE_ROUTE, MAIN_ROUTE, USER_ROUTE} from "./utils/consts";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import ActivationPage from "./pages/ActivationPage";
import CoursePage from "./pages/CoursePage";
import JoinCoursePage from "./pages/JoinCoursePage";

export const Routes=[
    {
        path:MAIN_ROUTE,
        Component: MainPage
    },
    {
        path: USER_ROUTE,
        Component: LoginPage
    },
    {
        path: ACTIVATION_ROUTE,
        Component: ActivationPage
    },
    {
        path: JOIN_COURSE_PAGE_ROUTE,
        Component: JoinCoursePage
    }
];

export const authRoutes=[
    {
        path: COURSE_PAGE_ROUTE,
        Component: CoursePage
    }
];