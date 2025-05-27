import {$authHost, $host} from "./index";

export const register=async(user)=>{
    const {data,status}=await $host.post('/user/register',user,{headers:{"Content-Type":"application/json"}});
    return {data,status};
}

export const login=async(user)=>{
    const {data,status}=await $host.post('/user/login',user,{headers:{"Content-Type":"application/json"}});
    return {data,status};
}

export const checkToken=async()=>{
    const {data, status}=await $host.get('/user/refresh');
    return {data, status};
}

export const logout=async()=>{
    const {data}=await $host.get('/user/logout');
    return data;
}

export const sendNewActivationLink=async()=>{
    const {data}=await $authHost.get('/user/resend');
    return data;
}

export const fetchUserWithEmail=async(pattern, id)=>{
    const {data}=await $authHost.get(`/user/${id}/${pattern}`);
    return data;
}