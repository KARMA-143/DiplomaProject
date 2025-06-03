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
import {useNavigate, useParams} from "react-router-dom";
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
import {APP_URL, CHAT_PAGE_ROUTE} from "../utils/consts";
import {navigate} from "react-big-calendar/lib/utils/constants";

const MembersList = () => {
    const {CourseContent, SnackbarStore, User} = useContext(Context);
    const {id} = useParams();
    const navigate = useNavigate();
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "auto",
                height: "80vh",
                px: 2,
                py: 3,
                gap: 2,
            }}
        >
            {CourseContent.course.role !== "member" && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        width: "100%",
                        maxWidth: "700px",
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle2">Course code:</Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {CourseContent.course.code}
                            </Typography>
                            <Tooltip title="Copy code to clipboard">
                                <IconButton onClick={() => onCopy(CourseContent.course.code)} size="small">
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <HtmlTooltip
                                title={
                                    <Typography variant="body2">
                                        {`${APP_URL}/course/join/${CourseContent.course.code}`}
                                    </Typography>
                                }
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Typography variant="subtitle2">Link:</Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                        sx={{
                                            maxWidth: 180,
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {`${APP_URL}/course/join/${CourseContent.course.code}`}
                                    </Typography>
                                </Box>
                            </HtmlTooltip>
                            <Tooltip title="Copy link to clipboard">
                                <IconButton
                                    onClick={() =>
                                        onCopy(`${APP_URL}/course/join/${CourseContent.course.code}`)
                                    }
                                    size="small"
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open QR-code to join course">
                                <IconButton onClick={() => setQROpen(true)} size="small">
                                    <QrCode2Icon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box>
                            <Tooltip title="Invite user">
                                <IconButton onClick={() => setOpenInviteUserDialog(true)}>
                                    <PersonAddAltIcon />
                                </IconButton>
                            </Tooltip>
                            <InviteUserDialog open={openInviteUserDialog} setOpen={setOpenInviteUserDialog} />
                        </Box>
                    </Box>
                </Paper>
            )}

            <Box sx={{ width: "100%", maxWidth: "700px" }}>
                <Typography variant="h6" fontWeight={600}>
                    Mentors
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1.5,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            src={
                                CourseContent.course.creator.avatarUrl ||
                                "https://t3.ftcdn.net/jpg/03/94/89/90/360_F_394899054_4TMgw6eiMYUfozaZU3Kgr5e0LdH4ZrsU.jpg"
                            }
                            sx={{ width: 50, height: 50 }}
                        />
                        <Box>
                            <Typography fontWeight={600}>
                                {CourseContent.course.creator.name}
                                <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                                    owner
                                </Typography>
                                {User.id === CourseContent.course.creator.id && (
                                    <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                                        (you)
                                    </Typography>
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {CourseContent.course.creator.email}
                            </Typography>
                        </Box>
                    </Box>

                    {User.id !== CourseContent.course.creator.id && (
                        <IconButton aria-label="email" size="large" onClick={()=>navigate(CHAT_PAGE_ROUTE.replace(":id", id).replace(":userId", CourseContent.course.creator.id))}>
                            <EmailIcon />
                        </IconButton>
                    )}
                </Box>

                {CourseContent.members
                    .filter((member) => member.user.role === "mentor")
                    .map((member) => (
                        <MemberCard member={member} key={member.id} />
                    ))}

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                    Members
                </Typography>
                <Divider sx={{ my: 1 }} />

                {CourseContent.members.filter((member) => member.user.role === "member").length > 0 ? (
                    CourseContent.members
                        .filter((member) => member.user.role === "member")
                        .map((member) => <MemberCard member={member} key={member.id} />)
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        This course has no members right now
                    </Typography>
                )}

                <Divider sx={{ my: 2 }} />
                <Dialog open={QROpen} onClose={() => setQROpen(false)}>
                    <DialogTitle>Join course with QR-code</DialogTitle>
                    <DialogContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                        <QRCodeSVG value={`${APP_URL}/course/join/${CourseContent.course.code}`} size={256} />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button variant="outlined" onClick={() => setQROpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {CourseContent.course.role !== "member" && CourseContent.invitations.length > 0 && (
                    <>
                        <Typography variant="h6" fontWeight={600} mt={3}>
                            Invitations
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        {CourseContent.invitations.map((invitation) => (
                            <InvitationCard invitation={invitation} key={invitation.id} />
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default observer(MembersList);