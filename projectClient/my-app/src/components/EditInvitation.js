import React, {useContext, useState} from 'react';
import Loading from "./Loading";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select
} from "@mui/material";
import {updateCourseInvitation} from "../http/invitationAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";

const EditInvitation = ({open , setOpen, invitation}) => {
    const [role, setRole] = useState(invitation.isMentor?"mentor":"member");
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const {CourseContent, SnackbarStore} = useContext(Context);

    const handleClose = ()=>{
        setRole(invitation.isMentor?"mentor":"member");
        setOpen(false);
    }

    const sendRequest=()=>{
        setLoading(true);
        updateCourseInvitation(id, invitation.id, {isMentor: role}).then(r=>{
            const index = CourseContent.invitations.findIndex(Invitation => Invitation.id === invitation.id);
            const updatedArray = [
                ...CourseContent.invitations.slice(0, index),
                r,
                ...CourseContent.invitations.slice(index + 1),
            ];
            CourseContent.invitations = updatedArray;
            SnackbarStore.show("Successfully updated the user role!", "success");
            setOpen(false);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>setLoading(false));
    }

    return (
        <Dialog
            open={open}
            onClose={()=>setOpen(false)}>
            <Loading loading={loading}/>
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Edit invitation</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    {`Change invited user ${invitation.user.name} role`}
                </DialogContentText>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Role"
                    onChange={(e)=>setRole(e.target.value)}
                    sx={{width:'100%'}}
                >
                    <MenuItem value={"mentor"}>Mentor</MenuItem>
                    <MenuItem value={"member"}>Member</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={sendRequest}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditInvitation;