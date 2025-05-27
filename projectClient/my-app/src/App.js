import AppRouter from "./components/AppRouter";
import {useContext, useEffect, useState} from "react";
import {checkToken} from "./http/userAPI";
import {ACTIVATION_ROUTE, APP_URL, MAIN_ROUTE, USER_ROUTE} from "./utils/consts";
import {Context} from "./index";
import {useNavigate} from "react-router-dom";
import Loading from "./components/Loading";
import CustomSnackbar from "./components/CustomSnackbar";
import {CssBaseline} from "@mui/material";
import {getUserInvitationCount} from "./http/invitationAPI";

function App() {
    const {User, SnackbarStore}=useContext(Context);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        checkToken().then(r=>{
            User.setUser(r.data);
            localStorage.setItem('access_token', r.data.accessToken);
            getUserInvitationCount().then(res=>{
                User.invitationCount=res;
            })
                .catch(err=>{
                    SnackbarStore.show(err.response.data.message, "error");
                })
            if(document.location.href===APP_URL+USER_ROUTE){
                return navigate(USER_ROUTE);
            }
            if(r.isActivated===false){
                return navigate(ACTIVATION_ROUTE);
            }
        })
            .catch((error)=>{
                if(error.response){
                    if(error.response.status===401){
                        return document.location.href===APP_URL+MAIN_ROUTE? navigate(MAIN_ROUTE): navigate(USER_ROUTE);
                    }
                    else{
                        SnackbarStore.show(error.response.data.message, "error");
                    }
                }
        })
            .finally(() => {setLoading(false);});
    },[]);
    /* eslint-disable react-hooks/exhaustive-deps */

    if(loading){
        return <Loading open={loading}/>
    }

  return (
      <>
          <CssBaseline />
          <AppRouter/>
          <CustomSnackbar/>
      </>
  );
}

export default App;
