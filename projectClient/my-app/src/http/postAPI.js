import {$authHost} from "./index";

export const createCoursePost = async (courseId, formData)=>{
    const {data}=await $authHost.post(`/post/${courseId}`, formData);
    return data;
}

export const deleteCoursePost = async (courseID, postId)=>{
    const {data}=await $authHost.delete(`/post/${courseID}/${postId}`);
    return data;
}

export const editCoursePost = async (courseId, postId, newPost)=>{
    const {data}=await $authHost.put(`/post/${courseId}/${postId}`, newPost);
    return data;
}