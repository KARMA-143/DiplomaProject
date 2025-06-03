import React from 'react';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import {format, parse, startOfWeek, getDay} from 'date-fns';
import {ru} from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../styles/TaskCalendar.css"
import CustomEventWrapper from "./CustomEventWrapper";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {TASK_PAGE_ROUTE, TEST_PAGE_ROUTE} from "../utils/consts";

const locales = {
    ru: ru,
};

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ru }),
    getDay,
    locales
});

const eventPropGetter = (event) => {
    let backgroundColor = '#1976d2';

    if (event.type === 'test') {
        backgroundColor = '#d32f2f';
    }

    return {
        style: {
            backgroundColor,
            color: 'white',
            borderRadius: '4px',
            padding: '2px 4px',
            textAlign: 'center',
        },
    };
};

const formatDate = (date) => format(date, 'EEEE d MMMM');

const formatRange = ({ start, end }) => {
    return `${formatDate(start)} — ${formatDate(end)}`;
};

const CustomToolbar = ({ label, onNavigate }) => {
    return (
        <div className="rbc-toolbar">
            <span className="rbc-toolbar-label">{label}</span>
            <div className="rbc-btn-group">
                <Button onClick={() => onNavigate('PREV')}>Back</Button>
                <Button onClick={() => onNavigate('TODAY')}>Today</Button>
                <Button onClick={() => onNavigate('NEXT')}>Next</Button>
            </div>
        </div>
    );
};

const TaskCalendar = ({ events }) => {
    const navigate = useNavigate();

    const onEventClick=(event)=>{
        if(event.type === 'test'){
            navigate(TEST_PAGE_ROUTE.replace(":id", event.course.id).replace(":testId", event.id));
        }
        else{
            navigate(TASK_PAGE_ROUTE.replace(":id", event.course.id).replace(":taskId", event.id));
        }
    }

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "90vh" }}
            views={["month"]}
            eventPropGetter={eventPropGetter}
            onSelectEvent={onEventClick}
            formats={{
                dayHeaderFormat: (date) => formatDate(date),
                dayRangeHeaderFormat: formatRange,
                timeGutterFormat: (date) => format(date, 'HH:mm'),
            }}
            components={{
                eventWrapper: CustomEventWrapper,
                toolbar: CustomToolbar,
            }}
        />
    );
};

export default TaskCalendar;