import React, {useContext, useState} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Link,
    TextField,
    Typography
} from "@mui/material";
import "../styles/UserPage.css"
import {login, register} from "../http/userAPI";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {JOIN_COURSE_PAGE_ROUTE, MAIN_ROUTE} from "../utils/consts";
import Loading from "../components/Loading";

const LoginPage = () => {
    const {User}=useContext(Context);
    const navigate=useNavigate();

    const [isSignIn, setIsSignIn] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorText, setEmailErrorText] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorText, setPasswordErrorText] = React.useState('');
    const [repeatPasswordError, setRepeatPasswordError] = React.useState(false);
    const [repeatPasswordErrorText, setRepeatPasswordErrorText] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorText, setNameErrorText] = React.useState('');
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = React.useState("");

    const sendRequest=()=>{
        if(isSignIn){
            login({email, password}).then(r=>{
                setUser(r);
            })
                .catch((error)=>{
                    console.log(error);
                    if(error.status === 400){
                        setResponseError(error.response.data.message);
                    }
                })
                .finally(()=>{
                setLoading(false);
            })
        }
        else{
            register({email,name,password}).then(r=>{
                setUser(r);
            })
                .catch((error)=>{
                    if(error.status === 400){
                        setResponseError(error.response.data.message);
                    }
                })
                .finally(()=>{
                setLoading(false);
            })
        }
    }

    const setUser=(receivedData)=>{
        setLoading(true);
        User.setUser(receivedData);
        localStorage.setItem('access_token', receivedData.data.accessToken);
        const code=localStorage.getItem("code");
        if(code!==null){
            console.log(code);
            return navigate(JOIN_COURSE_PAGE_ROUTE.replace(":code", code), {replace:true});
        }
        navigate(MAIN_ROUTE, {replace:true});
    }

    const changeIsSignIn=()=>{
        setIsSignIn(!isSignIn);
        emailIsChanged('');
        repeatPasswordIsChanged('');
        passwordIsChanged('');
        nameIsChanged('');
        setResponseError("");
    };

    const emailIsChanged=(value)=>{
        setEmail(value);
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && value) {
            setEmailError(true);
            setEmailErrorText("Invalid email format");
        }
        else{
            setEmailError(false);
            setEmailErrorText("");
        }
    };

    const repeatPasswordIsChanged=(value, currentPassword=password)=>{
        setRepeatPassword(value);
        if(currentPassword!==value && value){
            setRepeatPasswordError(true);
            setRepeatPasswordErrorText("Passwords don't match");
        }
        else{
            setRepeatPasswordError(false);
            setRepeatPasswordErrorText("");
        }
    };

    const passwordIsChanged=(value)=>{
        setPassword(value);
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value) && value) {
            setPasswordError(true);
            setPasswordErrorText("Password must be at least 8 characters long, contain uppercase, lowercase, and a number");
        }
        else{
            setPasswordError(false);
            setPasswordErrorText("");
        }
        repeatPasswordIsChanged(repeatPassword, value);
    };

    const nameIsChanged=(value)=>{
        setName(value);
        if (!/^[a-zA-Z]{3,20}$/.test(value) && value) {
            setNameError(true);
            setNameErrorText("Username must be 3-20 characters (letters only)");
        }
        else{
            setNameError(false);
            setNameErrorText("");
        }
    };

    return (
        <Container className={"container"}>
            <Loading open={loading}/>
            <Card className={"card"}>
                <CardContent style={{display:'flex', flexDirection: 'column', gap:'10px'}}>
                    <Typography variant="h3" gutterBottom style={{textAlign: "center"}}>
                        {isSignIn?"Sign in":"Sign up"}
                    </Typography>
                    {responseError?
                        <Typography variant="h6" gutterBottom style={{textAlign: "center", color:"red"}}>{responseError}</Typography>
                        :
                        <></>
                    }
                    <TextField
                        error={emailError}
                        helperText={emailErrorText}
                        id={"emailInput"}
                        variant="outlined"
                        value={email}
                        onChange={(e) => emailIsChanged(e.target.value)}
                        label={"email"}
                        type={"email"}/>
                    {isSignIn?
                        <></>
                        :
                    <TextField
                        error={nameError}
                        helperText={nameErrorText}
                        id={"nameInput"}
                        variant="outlined"
                        value={name}
                        onChange={(e) => nameIsChanged(e.target.value)}
                        label={"name"} type={"text"}/>}

                    <TextField
                        error={passwordError}
                        helperText={passwordErrorText}
                        id={"passwordInput"}
                        variant="outlined"
                        value={password}
                        onChange={(e) => passwordIsChanged(e.target.value)}
                        label={"password"} type={"password"}/>
                    {isSignIn ?
                        <></>
                        :
                        <TextField
                            error={repeatPasswordError}
                            helperText={repeatPasswordErrorText}
                            id={"repeatPasswordInput"}
                            variant="outlined"
                            value={repeatPassword}
                            onChange={(e) => repeatPasswordIsChanged(e.target.value)}
                            label={"repeat password"}
                            type={"password"} />
                    }
                </CardContent>
                <CardActions style={{display:'flex', flexDirection: 'column', gap:'5px'}}>
                    <Button variant="outlined" onClick={sendRequest}>{isSignIn?'sign in':'sign up'}</Button>
                    <Link onClick={changeIsSignIn}>{isSignIn?"doesn't have an account? Sign up!":"Already have an account? Sign in!"}</Link>
                </CardActions>
            </Card>
        </Container>
    );
};

export default LoginPage;