import React, { useState } from 'react';
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import { joinCourseWithCode } from "../http/courseAPI";
import { COURSE_PAGE_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const JoinCourseDialog = ({ open, setOpen }) => {
    const [code, setCode] = useState("");
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setCode("");
        setOpen(false);
        setError(false);
        setErrorText("");
    };

    const sendRequest = () => {
        if (code.length !== 12) {
            setError(true);
            setErrorText("Code must be exactly 12 characters long");
            return;
        }

        setLoading(true);
        joinCourseWithCode(code)
            .then(r => {
                navigate(COURSE_PAGE_ROUTE.replace(":id", r.id).replace(":tab", "feed"));
                handleClose();
            })
            .catch((error) => {
                if (error.status !== 401) {
                    setError(true);
                    setErrorText(error.response?.data?.message || "Unknown error");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onCodeChange = (e) => {
        setError(false);
        setErrorText("");
        setCode(e.target.value);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Loading open={loading} />
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Join course with code</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    Type a 12-character course code to join
                </DialogContentText>
                <TextField
                    type="text"
                    required
                    placeholder="Enter course code"
                    id="code"
                    name="code"
                    label="Code (12 characters)"
                    value={code}
                    onChange={onCodeChange}
                    inputProps={{ maxLength: 12 }}
                    variant="outlined"
                    autoComplete="off"
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                    fullWidth
                    error={error}
                    helperText={errorText || "Code must be 12 characters"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={sendRequest}>Join</Button>
            </DialogActions>
        </Dialog>
    );
};

export default JoinCourseDialog;
