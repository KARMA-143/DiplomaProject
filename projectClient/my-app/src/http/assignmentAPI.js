import {$authHost} from "./index";

export const getCourseAssignments = async(id)=>{
    const {data} = await $authHost.get(`/assignment/${id}`);
    return data;
}

export const createNewTask = async(id, task)=>{
    const {data} = await $authHost.post(`/assignment/${id}/task`, task);
    return data;
}

export const getTask = async(courseId, id)=>{
    const {data} = await $authHost.get(`/assignment/${courseId}/task/${id}`);
    return data;
}

export const deleteCourseTask = async(id, taskId)=>{
    const {data} = await $authHost.delete(`/assignment/${id}/task/${taskId}`);
    return data;
}

export const editCourseTask = async(id, taskId, task)=>{
    const {data} = await $authHost.put(`/assignment/${id}/task/${taskId}`, task);
    return data;
}

export const createNewTest = async(id, test)=>{
    const {data} = await $authHost.post(`/assignment/${id}/test`, test);
    return data;
}

export const getTest = async(id, testId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/test/${testId}`);
    return data;
}

export const deleteCourseTest = async(id, testId)=>{
    const {data} = await $authHost.delete(`/assignment/${id}/test/${testId}`);
    return data;
}

export const editCourseTest = async(id, testId, test)=>{
    const {data} = await $authHost.put(`/assignment/${id}/test/${testId}`, test);
    return data;
}