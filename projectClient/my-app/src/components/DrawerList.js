import React from 'react';
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';

const DrawerList = ({setOpen}) => {
    return (
        <Box sx={{ width: 250 }} role="presentation" onClick={setOpen}>
            <List>
                <ListItem key={"Home"} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeFilledIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Home"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Courses"} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <CardMembershipIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Courses"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Tasks"} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <AssignmentIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Tasks"}/>
                    </ListItemButton>
                </ListItem>
                <ListItem key={"Task schedule"} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <EventNoteIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Task schedule"}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default DrawerList;