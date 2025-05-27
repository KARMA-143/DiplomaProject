import React, {useContext, useEffect, useState} from 'react';
import {Box, IconButton} from "@mui/material";
import Loading from "./Loading";
import {getCourseAssignments} from "../http/assignmentAPI";
import {useParams} from "react-router-dom";
import {Context} from "../index";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import CreateAssignmentDialog from "./CreateAssignmentDialog";

const AssignmentsList = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const {SnackbarStore} = useContext(Context);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    useEffect(() => {
        getCourseAssignments(id).then(res=>{
            console.log(res);
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [SnackbarStore, id]);

    if(loading){
        return <Loading open={loading}/>;
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Tooltip title={"Add new assignment"} onClick={()=>setOpenCreateDialog(true)}>
                <IconButton size={"large"}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
            {

            }
            <CreateAssignmentDialog open={openCreateDialog} setOpen={setOpenCreateDialog}/>
        </Box>
    );
};

export default AssignmentsList;