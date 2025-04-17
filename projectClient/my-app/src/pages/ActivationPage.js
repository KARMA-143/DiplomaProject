import React, {useContext, useEffect, useState} from 'react';
import {Container, Typography, Button, Paper, CircularProgress} from '@mui/material';
import "../styles/ActivationPage.css";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {sendNewActivationLink} from "../http/userAPI";

const ActivationPage = () => {
    const {User, SnackbarStore}=useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(User.isActivated!==false){
            navigate(-1);
        }
    },);

    const handleResend = async () => {
        setLoading(true);
        await sendNewActivationLink().then(r=>{
            SnackbarStore.show("Activation link was resent successfully!", "success");
        })
            .catch((error)=>{
                SnackbarStore.show("Activation link wasn't resent!", "error");
            })
            .finally(()=>{
            setLoading(false);
        });
    };

    return (
        <Container maxWidth="sm" className="activation-container">
            <Paper elevation={3} className="activation-paper">
                <Typography variant="h5" className="activation-title" gutterBottom>
                    Your account is not activated
                </Typography>
                <Typography variant="body1" className="activation-text" paragraph>
                    An activation email has been sent to your email address. Please check your inbox.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResend}
                    disabled={loading}
                    className="resend-button"
                >
                    {loading ? <CircularProgress size={24} /> : "Resend activation email"}
                </Button>
            </Paper>
        </Container>
    );
};

export default observer(ActivationPage);
