import {$authHost} from "./index";

export const sendNewComment = async (courseId, entityId, entityType, comment) => {
    const {data} = await $authHost.post(`/comment/${courseId}/${entityType}/${entityId}`, {"text":comment},{headers: {"Content-Type":"application/json"}});
    return data
}

export const deletePostComment = async (courseId, commentId) => {
    const {status} = await $authHost.delete(`/comment/${courseId}/${commentId}`);
    return status;
}

export const updateComment = async (courseId, commentId, text) => {
    const {data} = await $authHost.put(`/comment/${courseId}/${commentId}`, {"text":text}, {headers: {"Content-Type":"application/json"}});
    return data;
}