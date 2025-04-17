import axios from 'axios';
import {API_URL} from "../utils/consts";

const $host=axios.create({
    baseURL:API_URL,
    withCredentials:true
});

const $authHost=axios.create({
    baseURL:API_URL,
});

$authHost.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
});

$authHost.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401) {
        try{
            const {data}=await $host.get('/user/refresh', {withCredentials:true});
            localStorage.setItem("access_token", data.accessToken);
            return $authHost.request(originalRequest);
        } catch(error) {
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
})

export {$host, $authHost};