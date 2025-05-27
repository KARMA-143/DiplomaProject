import React, {useContext, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField
} from "@mui/material";
import ChooseCoverDialog from "./ChooseCoverDialog";
import {Context} from "../index";
import {COURSE_PAGE_ROUTE, SERVER_URL} from "../utils/consts";
import {createCourse} from "../http/courseAPI";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";

const CreateCourseDialog = ({open, setOpen}) => {
    const [openChooseCourseCover, setOpenChooseCourseCover] = useState(false);
    const {Covers, SnackbarStore}=useContext(Context);
    const [cover,setCover] = useState(Covers.covers[0]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleClose=()=>{
        setName("");
        setCover(Covers.covers[0]);
        setOpen(false);
    }

    const sendRequest=()=>{
        setLoading(true);
        createCourse({name, cover}).then(r=>{
            navigate(COURSE_PAGE_ROUTE.replace(":id",r.id).replace(":tab", "feed"));
            handleClose();
        })
            .catch((error)=>{
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <Loading open={loading}/>
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Create new course</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    Fill the fields
                </DialogContentText>
                <TextField
                    type="text"
                    required
                    placeholder="Enter course name"
                    id={"name"}
                    name={"name"}
                    label={"name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    autoComplete="off"
                    style={{marginTop:'10px', marginBottom:'10px'}}
                    fullWidth={true}
                />
                <Paper>
                    <Box
                        src={`${SERVER_URL}/static/${cover}`}
                        component="img"
                        sx={{
                            height:180,
                            width:320,
                    }}
                    />
                </Paper>
                <Button
                    style={{marginTop:'10px', marginBottom:'10px'}}
                    fullWidth={true}
                    variant="contained"
                    onClick={() => {setOpenChooseCourseCover(true)}}
                >
                    Choose cover
                </Button>
                <ChooseCoverDialog open={openChooseCourseCover} setOpen={setOpenChooseCourseCover} cover={cover} setCover={setCover} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={sendRequest}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCourseDialog;