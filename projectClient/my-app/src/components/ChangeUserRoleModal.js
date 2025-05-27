import React, {useContext} from 'react';
import Loading from "./Loading";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, MenuItem,
    Select,
} from "@mui/material";
import {updateCourseUser} from "../http/courseAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const ChangeUserRoleModal = ({member, open, setOpen}) => {
    const [role, setRole] = React.useState(member.user.role);
    const [loading, setLoading] = React.useState(false);
    const {id} = useParams();
    const {SnackbarStore, CourseContent} = useContext(Context);

    const sendRequest=()=>{
        setLoading(true);
        if(role===member.user.role){
            setLoading(false);
            setOpen(false);
        }
        updateCourseUser(id, member.id, role).then(r=>{
            if(role==="owner"){
                document.location.reload();
            }
            else{
                member.user.role=role;
                const index = CourseContent.members.findIndex(Member=>member.id===Member.id);
                const uploadedMembers = [
                    ...CourseContent.members.slice(0, index),
                    member,
                    ...CourseContent.members.slice(index + 1),
                ];
                CourseContent.members=uploadedMembers;
            }
            SnackbarStore.show("Successfully updated the user role!", "success");
            setOpen(false);
        })
            .catch((err)=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{setLoading(false)});
    }

    return (
        <Dialog
            open={open}
            onClose={()=>setOpen(false)}>
            <Loading loading={loading}/>
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Change user role</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    {`Change ${member.user.name} role`}
                </DialogContentText>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Role"
                    onChange={(e)=>setRole(e.target.value)}
                    sx={{width:'100%'}}
                >
                    <MenuItem value={"owner"}>Owner</MenuItem>
                    <MenuItem value={"mentor"}>Mentor</MenuItem>
                    <MenuItem value={"member"}>Member</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{setOpen(false)}}>Cancel</Button>
                <Button onClick={sendRequest}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default observer(ChangeUserRoleModal);