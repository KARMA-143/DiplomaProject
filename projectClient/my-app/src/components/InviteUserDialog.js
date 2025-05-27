import React, {useContext, useState, useEffect} from 'react';
import Loading from "./Loading";
import {
    Autocomplete, Avatar, Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel,
    MenuItem,
    Select, TextField, Typography
} from "@mui/material";
import {fetchUserWithEmail} from "../http/userAPI";
import {Context} from "../index";
import {sendCourseInvitation} from "../http/invitationAPI";
import {useParams} from "react-router-dom";

const InviteUserDialog = ({open, setOpen}) => {
    const {SnackbarStore, CourseContent} = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("member");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const {id} = useParams();

    const handleClose = ()=>{
        setRole("member");
        setInputValue("");
        setOptions([]);
        setSelectedUser(null);
        setError(false);
        setErrorText("");
        setOpen(false);
    }

    useEffect(()=>{
        setErrorText("");
        setError(false);
        const delayDebounce = setTimeout(() => {
            if (inputValue.length >= 2) {
                setLoading(true);
                fetchUserWithEmail(inputValue, id).then(r=>{
                    setOptions(r);
                })
                    .catch(err=>{
                        SnackbarStore.show(err.response.data.message, "error");
                    })
                    .finally(()=>{
                        setLoading(false);
                    })

            } else {
                setOptions([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    },[inputValue, SnackbarStore, id])

    const sendRequest=()=>{
        if(inputValue===""){
            setErrorText("Choose user!");
            setError(true);
        }
        const invitation={
            isMentor: role==="mentor",
            userId: selectedUser.id,
        }
        sendCourseInvitation(id, invitation).then(r=>{
            const uploadedInvitation = [...CourseContent.invitations, r];
            CourseContent.invitations = uploadedInvitation;
            SnackbarStore.show("invitation was sent successfully", "success");
            setOpen(false);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
    }

    return (
        <Dialog
            open={open}
            onClose={()=>setOpen(false)}>
            <Loading loading={loading}/>
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Invite user</DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", minWidth:"300px"}}>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    {`invite user via email`}
                </DialogContentText>
                <Autocomplete
                    sx={{marginTop: "10px", marginBottom:"10px", width: "100%"}}
                    options={options}
                    value={selectedUser}
                    onChange={(event, newValue) => setSelectedUser(newValue)}
                    getOptionLabel={(option) => option.email}
                    loading={loading}
                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={error}
                            helperText={errorText}
                            label="Email"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress size={16} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            <Avatar src={"https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"} sx={{ width: 24, height: 24, mr: 1 }} />
                            <Box>
                                <Typography variant="body2">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                            </Box>
                        </Box>
                    )}
                />
                <FormControl fullWidth>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        value={role}
                        label="Role"
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="mentor">Mentor</MenuItem>
                        <MenuItem value="member">Member</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={sendRequest}>Send</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteUserDialog;