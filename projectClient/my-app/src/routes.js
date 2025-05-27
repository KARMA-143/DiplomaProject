import {
    ACTIVATION_ROUTE,
    COURSE_PAGE_ROUTE,
    INVITATION_ROUTE,
    JOIN_COURSE_PAGE_ROUTE,
    MAIN_ROUTE, TASK_CREATE_ROUTE, TASK_PAGE_ROUTE, TEST_CREATE_ROUTE, TEST_PAGE_ROUTE,
    USER_ROUTE
} from "./utils/consts";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import ActivationPage from "./pages/ActivationPage";
import CoursePage from "./pages/CoursePage";
import JoinCoursePage from "./pages/JoinCoursePage";
import InvitationPage from "./pages/InvitationPage";
import TaskCreatePage from "./pages/TaskCreatePage";
import TestCreatePage from "./pages/TestCreatePage";
import TaskPage from "./pages/TaskPage";
import TestPage from "./pages/TestPage";

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
    },
    {
        path: INVITATION_ROUTE,
        Component: InvitationPage
    }
];

export const mentorRoutes=[
        {
            path: TASK_CREATE_ROUTE,
            Component: TaskCreatePage
        },
        {
            path: TEST_CREATE_ROUTE,
            Component: TestCreatePage
        }
];

export const courseUserRoutes=[
    {
        path: TASK_PAGE_ROUTE,
        Component: TaskPage
    },
    {
        path: TEST_PAGE_ROUTE,
        Component: TestPage
    }
]