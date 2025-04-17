import React, {useState} from 'react';
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import {joinCourseWithCode} from "../http/courseAPI";
import {COURSE_PAGE_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";

const JoinCourseDialog = ({open, setOpen}) => {
    const[code,setCode]=useState("");
    const [errorText, setErrorText] = useState("");
    const [error, setError]=useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setCode("");
        setOpen(false);
        setError(false);
        setErrorText("");
    }

    const sendRequest=()=>{
        setLoading(true);
        joinCourseWithCode(code).then(r=>{
            navigate(COURSE_PAGE_ROUTE.replace(":id",r.id));
            handleClose();
        })
            .catch((error)=>{
                if(error.status !== 401){
                    setError(true);
                    setErrorText(error.response.data.message);
                }
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const onCodeChange=(e)=>{
        setError(false);
        setErrorText("");
        setCode(e.target.value);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}>
            <Loading open={loading}/>
            <DialogTitle>Join course with code</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Type course code
                </DialogContentText>
                <TextField
                    type="text"
                    required
                    placeholder="Enter course code"
                    id={"code"}
                    name={"code"}
                    label={"code"}
                    value={code}
                    onChange={(e) => onCodeChange(e)}
                    variant="outlined"
                    autoComplete="off"
                    style={{marginTop:'10px', marginBottom:'10px'}}
                    fullWidth={true}
                    error={error}
                    helperText={errorText}
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