import React, {useContext} from 'react';
import {Alert, Snackbar} from "@mui/material";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const CustomSnackbar = () => {
    const {SnackbarStore} = useContext(Context);

    const closeSnackBar=(event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        SnackbarStore.close();
    };

    return (
        <Snackbar open={SnackbarStore.open} autoHideDuration={6000} onClose={closeSnackBar} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
            <Alert severity={SnackbarStore.severity} onClose={closeSnackBar} variant={"filled"}>{SnackbarStore.text || "Some error occurred"}</Alert>
        </Snackbar>
    );
};

export default observer(CustomSnackbar);