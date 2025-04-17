import AppRouter from "./components/AppRouter";
import {useContext, useEffect, useState} from "react";
import {checkToken} from "./http/userAPI";
import {ACTIVATION_ROUTE, APP_URL, MAIN_ROUTE, USER_ROUTE} from "./utils/consts";
import {Context} from "./index";
import {useNavigate} from "react-router-dom";
import Loading from "./components/Loading";
import CustomSnackbar from "./components/CustomSnackbar";

function App() {
    const {User}=useContext(Context);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkToken().then(r=>{
            User.setUser(r.data);
            localStorage.setItem('access_token', r.data.accessToken);
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
                        console.log(error.response.message);
                    }
                }
        })
            .finally(() => setLoading(false));
    },[User, navigate]);

    if(loading){
        return <Loading open={loading}/>
    }

  return (
      <>
          <AppRouter/>
          <CustomSnackbar/>
      </>
  );
}

export default App;
