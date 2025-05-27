import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import {Box, Typography} from "@mui/material";
import Loading from "../components/Loading";
import {getUsersInvitations} from "../http/invitationAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import InvitationWithCourseCard from "../components/InvitationWithCourseCard";

const InvitationPage = () => {
    const [loading, setLoading] = useState(true);
    const {SnackbarStore, Invitations} = useContext(Context);

    useEffect(() => {
        getUsersInvitations().then(res => {
            Invitations.invitations = res;
        })
            .catch(error => {
                SnackbarStore.show(error.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            })
    }, [Invitations, SnackbarStore]);

    if (loading) {
        return <Loading open={loading}/>;
    }

    return (
        <Box>
            <NavBar/>
            <Box sx={{marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                {
                    Invitations.invitations.length > 0 ? (
                        Invitations.invitations.map((invitation, index) => (
                            <Box
                                sx={{marginBottom: Invitations.invitations.length - 1 !== index ? "5px" : "0"}}
                                key={invitation.id || index}
                            >
                                <InvitationWithCourseCard invitation={invitation}/>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1">You have no invitations right now</Typography>
                    )
                }
            </Box>
        </Box>
    );
};

export default observer(InvitationPage);
