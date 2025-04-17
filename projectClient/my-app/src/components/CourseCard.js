import React from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import "../styles/CourseCard.css"
import {useNavigate} from "react-router-dom";
import {COURSE_PAGE_ROUTE} from "../utils/consts";

const CourseCard = ({course}) => {
    const navigate = useNavigate();

    const onCardClick=()=>{
        navigate(COURSE_PAGE_ROUTE.replace(":id", course.id));
    }

    return (
        <Card sx={{ width: 345, height: 235 }} onClick={onCardClick}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={course.cover}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className={"typography-text"}>
                        {course.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} className={"typography-text"}>
                        {course.owner}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseCard;