import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {COMPLETE_TEST_PAGE} from "../utils/consts";
import {Avatar, Box, Button, Paper, Typography} from "@mui/material";

const CompleteTestCard = ({test}) => {
    const navigate = useNavigate();
    const {id, testId} = useParams();

    useEffect(() => {
        console.log(test);
    })

    const handleClick = () => {
        navigate(COMPLETE_TEST_PAGE.replace(":id", id).replace(":testId", testId).replace(":completeTestId", test.id));
    };

    return (
        <Paper
            elevation={2}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                mb: 2,
                borderRadius: 3
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    alt={test?.user?.name}
                    src={"https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"}
                    sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box>
                    <Typography variant="subtitle1"><strong>{test?.user?.name}</strong></Typography>
                    <Typography variant="body2">{test?.user?.email}</Typography>
                    <Typography variant="body2" color="success.main"><strong>Mark:</strong> {test?.mark}</Typography>
                    <Typography variant="body2" color="success.main"><strong>Correct Answers:</strong> {test?.correctAnswer}</Typography>
                </Box>
            </Box>
            <Button variant="contained" onClick={handleClick}>
                View Result
            </Button>
        </Paper>
    );
};

export default CompleteTestCard;