import {$authHost} from "./index";

export const getUsersAllCourse=async (page)=>{
    const {data}=await $authHost.get('/course', {headers:{"page":page||1}});
    return data;
}

export const createCourse=async (course)=>{
    const {data}=await $authHost.post('/course', course, {headers:{"Content-Type":"application/json"}});
    return data;
}

export const joinCourseWithCode=async(code)=>{
    const {data}=await $authHost.post(`/course/join`,{"code": code},{headers:{"Content-Type":"application/json"}});
    return data;
}

export const getCourseById=async(id)=>{
    const {data, status}=await $authHost.get('/course/'+id);
    return {data, status};
}

export const downloadCourseFile=async(id, fileId)=>{
    const {data} = await $authHost.get('/course/'+id+'/download/'+fileId, {responseType:"blob"});
    return data;
}