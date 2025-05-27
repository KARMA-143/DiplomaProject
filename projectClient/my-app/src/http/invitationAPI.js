import {$authHost} from "./index";

export const getCourseInvitations = async(id)=>{
    const {data} = await $authHost.get(`/invitation/${id}`);
    return data;
}

export const sendCourseInvitation = async(id, invitation)=>{
    const {data} = await $authHost.post(`/invitation/${id}`, invitation, {headers: {'Content-Type': 'application/json'}});
    return data;
}

export const deleteCourseInvitation = async (id, invitationId)=>{
    const {data}=await $authHost.delete(`/invitation/${id}/${invitationId}`);
    return data;
}

export const updateCourseInvitation = async (id, invitationId, invitation)=>{
    const {data} = await $authHost.put(`/invitation/${id}/${invitationId}`, invitation, {headers: {'Content-Type': 'application/json'}});
    return data;
}

export const getUserInvitationCount = async()=>{
    const {data}=await $authHost.get(`/invitation/count`);
    return data;
}

export const getUsersInvitations = async()=>{
    const {data}=await $authHost.get(`/invitation/user`);
    return data;
}

export const declineUserInvitation = async(id)=>{
    const {data}=await $authHost.delete(`/invitation/${id}`);
    return data;
}

export const acceptUserInvitation = async(id)=>{
    const {data}=await $authHost.put(`/invitation/${id}`);
    return data;
}