import React, {useContext, useState} from 'react';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Drawer,
    IconButton,
    MenuItem,
    Toolbar,
    Typography,
    Menu
} from "@mui/material";
import DrawerList from "./DrawerList";
import AddIcon from '@mui/icons-material/Add';
import {APP_URL, MAIN_ROUTE, USER_ROUTE} from "../utils/consts";
import {logout} from "../http/userAPI";
import {useNavigate} from "react-router-dom";
import CreateCourseDialog from "./CreateCourseDialog";
import {Context} from "../index";
import JoinCourseDialog from "./JoinCourseDialog";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import Loading from "./Loading";

const NavBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen=Boolean(anchorEl);
    const {User, SnackbarStore}=useContext(Context);
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    const [openCreateCourseModal, setOpenCreateCourseModal] = useState(false);
    const [openJoinCourseDialog, setOpenJoinCourseDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const logOut = () => {
        setLoading(true);
        logout().then(r=>{
            localStorage.clear();
            User.resetUser();
            navigate(USER_ROUTE);
        }).catch(error => {
            SnackbarStore.show(error.response.data.message, "error");
        })
            .finally(()=>{
                setLoading(false);
            });
    }

    const openCourseModal=()=>{
        setAnchorEl(null);
        setOpenCreateCourseModal(true);
    }

    const openJoinCourseModal=()=>{
        setAnchorEl(null);
        setOpenJoinCourseDialog(true);
    }

    return (
        <>
            <Loading open={loading}/>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setOpen(true)}
                        >
                            <ListRoundedIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Workspace
                        </Typography>
                        {
                            document.location.href===APP_URL+MAIN_ROUTE &&
                            <>
                                <IconButton aria-label="create/join course" size="large" onClick={handleClick} aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}>
                                    <AddIcon fontSize="inherit"/>
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={openCourseModal} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                        <CreateNewFolderIcon sx={{marginRight: "5px"}}/>
                                        Create own course
                                    </MenuItem>
                                    <MenuItem onClick={openJoinCourseModal} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                        <GroupAddIcon sx={{marginRight: "5px"}}/>
                                        Join course with code
                                    </MenuItem>
                                </Menu>
                                <CreateCourseDialog open={openCreateCourseModal} setOpen={setOpenCreateCourseModal} />
                                <JoinCourseDialog open={openJoinCourseDialog} setOpen={setOpenJoinCourseDialog}/>
                            </>
                        }
                        <Button color="inherit" onClick={logOut}>Log out</Button>
                        <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" />
                    </Toolbar>
                </AppBar>
            </Box>
            <Drawer open={open} onClose={()=>setOpen(false)}>
                <DrawerList onClose={()=>setOpen(false)} setOpen={()=>setOpen(false)}/>
            </Drawer>
        </>

    );
};

export default NavBar;