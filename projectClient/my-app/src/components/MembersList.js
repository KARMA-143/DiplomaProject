import React, {useContext, useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Typography,
    Paper,
    DialogTitle,
    DialogContent, DialogActions, Button, Dialog
} from "@mui/material";
import {Context} from "../index";
import {useParams} from "react-router-dom";
import Loading from "./Loading";
import {fetchCourseUsers} from "../http/courseAPI";
import MemberCard from "./MemberCard";
import EmailIcon from "@mui/icons-material/Email";
import {observer} from "mobx-react-lite";
import "../styles/MemberCard.css"
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HtmlTooltip from "./HtmlTooltip";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import InviteUserDialog from "./InviteUserDialog";
import {QRCodeSVG} from "qrcode.react";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {getCourseInvitations} from "../http/invitationAPI";
import InvitationCard from "./InvitationCard";
import {APP_URL} from "../utils/consts";

const MembersList = () => {
    const {CourseContent, SnackbarStore, User} = useContext(Context);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [openInviteUserDialog, setOpenInviteUserDialog] = useState(false);
    const [QROpen, setQROpen] = useState(false);

    useEffect(() => {
        fetchCourseUsers(id).then(r=>{
            CourseContent.members=r;
        })
            .catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
        if(CourseContent.course.role!=="member"){
            getCourseInvitations(id).then(res=>{
                CourseContent.invitations=res;
            }).catch(err=>{
                SnackbarStore.show(err.response.data.message, "error");
            })
                .finally(()=>{
                    setLoading(false);
                })
        }else{
            CourseContent.invitation=[];
            setLoading(false);
        }

    },[id, CourseContent, SnackbarStore]);

    const onCopy = async (text)=>{
        try {
            await navigator.clipboard.writeText(text);
            SnackbarStore.show("Copied successfully!", "success");
        } catch (err) {
            SnackbarStore.show("Some error occurred!", "error");
        }
    }

    if(loading){
        return <Loading/>
    }

    return (
        <Box sx={{display: "flex",flexDirection:"column", alignItems: "center"}}>
            {
                CourseContent.course.role!=="member" &&
                <Paper elevation={2} sx={{ p: 2, width: '100%', maxWidth: '700px', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">Course code:</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{CourseContent.course.code}</Typography>
                            <Tooltip title="Copy code to clipboard">
                                <IconButton onClick={()=>onCopy(CourseContent.course.code)} size="small">
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HtmlTooltip
                                title={
                                    <React.Fragment>
                                        <Typography variant={"body1"}>
                                            {`${APP_URL}/course/join/${CourseContent.course.code}`}
                                        </Typography>
                                    </React.Fragment>
                                }
                            >
                                <Box sx={{display:"flex", alignItems:"center"}}>
                                    <Typography variant="subtitle2">Link:</Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                        sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {`${APP_URL}/course/join/${CourseContent.course.code}`}
                                    </Typography>
                                </Box>
                            </HtmlTooltip>

                            <Tooltip title="Copy link to clipboard">
                                <IconButton onClick={() => onCopy(`http://localhost:3000/course/join/${CourseContent.course.code}`)} size="small">
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"open QR-code to join course"}>
                                <IconButton onClick={()=>setQROpen(true)} size="small">
                                    <QrCode2Icon fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box>
                            <IconButton onClick={()=>setOpenInviteUserDialog(true)}>
                                <PersonAddAltIcon size={"large"}/>
                            </IconButton>
                            <InviteUserDialog open={openInviteUserDialog} setOpen={setOpenInviteUserDialog}/>
                        </Box>
                    </Box>
                </Paper>
            }
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: "700px"}}>
                <Typography>
                    Mentors
                </Typography>
                <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                <Box sx={{width:"100%", display: "flex", justifyContent: "space-between"}} className={"member-card"}>
                    <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center", width:"100%"}}>
                        <Avatar alt="Remy Sharp" src="https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg" sx={{width: 50, height: 50}}/>
                        <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center"}}>
                            <Box sx={{display: "flex", justifyContent: "flex-start", alignItems:"center"}}>
                                <Typography>{CourseContent.course.creator.name}</Typography>
                                <Typography sx={{marginLeft: "5px"}} color={"textSecondary"}>owner</Typography>
                                {
                                    User.id===CourseContent.course.creator.id &&
                                    <Typography sx={{marginLeft: "5px"}} color={"textSecondary"}>(you)</Typography>
                                }
                            </Box>
                            <Typography color={"textSecondary"} variant={"body2"}>{CourseContent.course.creator.email}</Typography>
                        </Box>
                    </Box>
                    {
                        User.id!==CourseContent.course.creator.id &&
                        <IconButton aria-label="actions" size="large"
                                    aria-haspopup="true">
                            <EmailIcon/>
                        </IconButton>
                    }
                </Box>
                {
                    CourseContent.members.filter(member => member.user.role==="mentor").map(member => {
                        return <MemberCard member={member} key={member.id}/>
                    })
                }
                <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                <Typography>
                    Members
                </Typography>
                {
                    CourseContent.members.filter(member => member.user.role==="member").length > 0?
                        CourseContent.members.filter(member => member.user.role==="member").map(member => {
                            return <MemberCard member={member} key={member.id}/>
                        })
                        :
                        <Typography variant="body1">This course has no members right now</Typography>

                }
                <Divider sx={{ my: 1, width: "100%", borderColor: "grey" }} />
                <Dialog
                    open={QROpen}
                    onClose={()=>setQROpen(false)}>
                    <DialogTitle>Join course with QR-code</DialogTitle>
                    <DialogContent sx={{display: "flex", justifyContent: "center"}}>
                        <QRCodeSVG value={`${APP_URL}/course/join/${CourseContent.course.code}`} size={256}/>
                    </DialogContent>
                    <DialogActions sx={{display: "flex", justifyContent: "center"}}>
                        <Button onClick={()=>setQROpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
                {
                    CourseContent.course.role!=="member" && CourseContent.invitations.length>0 &&
                    <>
                        <Typography>
                            Invitations
                        </Typography>
                        {
                            CourseContent.invitations.map((invitation)=>{
                                return <InvitationCard invitation={invitation} key={invitation.id}/>
                            })
                    }
                    </>

                }
            </Box>
        </Box>
    );
};

export default observer(MembersList);