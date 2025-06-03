import {$authHost} from "./index";

export const getChatMessages = async (userId)=>{
    const {data} = await $authHost.get(`chat/${userId}`);
    return data;
}
export const sendNewMessage=async (userId, newMessage)=>{
    const {data} = await $authHost.post(`chat/${userId}/message`, newMessage);
    return data;
}

export const deleteMessage= async (userId, id)=>{
    const {data} = await $authHost.delete(`chat/${userId}/message/${id}`);
    return data;
}

export const updateMessage=async (userId, id, newMessage)=>{
    const {data} = await $authHost.put(`chat/${userId}/message/${id}`, {content:newMessage});
    return data;
}