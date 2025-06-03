import React, { useContext, useEffect, useState } from 'react';
import NavBar from "../components/NavBar";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Container
} from "@mui/material";
import Loading from "../components/Loading";
import { getUsersInvitations } from "../http/invitationAPI";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import InvitationWithCourseCard from "../components/InvitationWithCourseCard";
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const InvitationPage = () => {
    const [loading, setLoading] = useState(true);
    const { SnackbarStore, Invitations } = useContext(Context);

    useEffect(() => {
        getUsersInvitations()
            .then(res => {
                Invitations.invitations = res;
            })
            .catch(error => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [Invitations, SnackbarStore]);

    if (loading) {
        return <Loading open={loading} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <NavBar TitleComponent={<Typography variant={"h6"} content={"div"}>Invitations</Typography>}/>
            <Container maxWidth="md" sx={{ pt: 6, pb: 8 }}>
                <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
                    Your Invitations
                </Typography>

                {
                    Invitations.invitations.length > 0 ? (
                        <Grid container spacing={3} justifyContent="center">
                            {Invitations.invitations.map((invitation, index) => (
                                <Grid item xs={12} key={invitation.id || index}>
                                    <InvitationWithCourseCard invitation={invitation} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box display="flex" justifyContent="center" mt={10}>
                            <Paper
                                elevation={3}
                                sx={{
                                    px: 4,
                                    py: 6,
                                    textAlign: "center",
                                    maxWidth: 420,
                                    borderRadius: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2
                                }}
                            >
                                <MailOutlineIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                                <Typography variant="h6" color="text.secondary">
                                    You have no invitations right now
                                </Typography>
                            </Paper>
                        </Box>
                    )
                }
            </Container>
        </Box>
    );
};

export default observer(InvitationPage);