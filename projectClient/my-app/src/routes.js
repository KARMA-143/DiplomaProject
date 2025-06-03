import {
    ACTIVATION_ROUTE, CHAT_PAGE_ROUTE, CHECK_USER_TASK_PAGE, COMPLETE_TEST_PAGE,
    COURSE_PAGE_ROUTE,
    INVITATION_ROUTE,
    JOIN_COURSE_PAGE_ROUTE,
    MAIN_ROUTE, PASS_TEST_PAGE,
    TASK_CREATE_ROUTE,
    TASK_LIST_ROUTE,
    TASK_PAGE_ROUTE,
    TASK_SCHEDULE_PAGE_ROUTE,
    TEST_CREATE_ROUTE,
    TEST_PAGE_ROUTE,
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
import TaskSchedulePage from "./pages/TaskSchedulePage";
import AssignmentListPage from "./pages/AssignmentListPage";
import CheckUserTaskPage from "./pages/CheckUserTaskPage";
import PassTestPage from "./pages/PassTestPage";
import CompleteTestResultPage from "./pages/CompleteTestResultPage";
import ChatPage from "./pages/ChatPage";

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
    },
    {
        path: TASK_SCHEDULE_PAGE_ROUTE,
        Component: TaskSchedulePage
    },
    {
        path: TASK_LIST_ROUTE,
        Component: AssignmentListPage
    },
    {
        path:CHAT_PAGE_ROUTE,
        Component:ChatPage
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
    },
    {
        path: CHECK_USER_TASK_PAGE,
        Component: CheckUserTaskPage
    },
    {
        path: COMPLETE_TEST_PAGE,
        Component: CompleteTestResultPage
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
    },
    {
        path: PASS_TEST_PAGE,
        Component: PassTestPage
    }
]