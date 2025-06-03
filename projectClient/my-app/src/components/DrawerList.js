import React, {useContext} from 'react';
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Badge} from "@mui/material";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {INVITATION_ROUTE, MAIN_ROUTE, TASK_LIST_ROUTE, TASK_SCHEDULE_PAGE_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";

const DrawerList = ({setOpen}) => {
    const {User} = useContext(Context);
    const navigate = useNavigate();

    return (
        <Box sx={{ width: 250 }} role="presentation" onClick={setOpen}>
            <List>
                <ListItem disablePadding onClick={()=>{navigate(MAIN_ROUTE)}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <CardMembershipIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Courses"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={()=>{navigate(TASK_LIST_ROUTE)}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <AssignmentIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Assignments"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={()=>{navigate(TASK_SCHEDULE_PAGE_ROUTE)}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <EventNoteIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Task schedule"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={()=>{navigate(INVITATION_ROUTE)}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Badge badgeContent={User.invitationCount} color="error">
                                <MailOutlineIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary="Invitations"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default observer(DrawerList);
