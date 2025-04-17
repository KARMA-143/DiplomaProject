import React from 'react';
import {Backdrop, CircularProgress} from "@mui/material";

const Loading = ({open}) => {

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Loading;