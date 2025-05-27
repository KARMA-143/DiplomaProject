import React from 'react';
import {
    Box,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Typography
} from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import "../styles/CreateAssignmentDialog.css"
import {useNavigate, useParams} from "react-router-dom";
import {TASK_CREATE_ROUTE, TEST_CREATE_ROUTE} from "../utils/consts";

const CreateAssignmentDialog = ({ open, setOpen }) => {
    const {id} = useParams();
    const navigate = useNavigate();

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle sx={{display:"flex", justifyContent:"center"}}>Create new assignment</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{display:"flex", justifyContent:"center"}}>
                    Choose assignment type
                </DialogContentText>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }} className={"assignment-box"} onClick={()=>{navigate(TASK_CREATE_ROUTE.replace(":id", id))}}>
                        <AssignmentIcon fontSize="large" />
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>Text task</Typography>
                        <Typography variant="body2" align="center">
                            Provide a written task and attach files if needed.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45%' }} className={"assignment-box"} onClick={()=>{navigate(TEST_CREATE_ROUTE.replace(":id", id))}}>
                        <ChecklistRtlIcon fontSize="large" />
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>Test</Typography>
                        <Typography variant="body2" align="center">
                            Automatically graded test with multiple question types.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAssignmentDialog;
