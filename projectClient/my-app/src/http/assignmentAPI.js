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

export const getUserAssignments = async()=>{
    const {data} = await $authHost.get(`/assignment/active`);
    return data;
}

export const getUserAssignmentsGroupedByCourse = async()=>{
    const {data} = await $authHost.get(`/assignment/active/grouped`);
    return data;
}

export const getUserTask = async(id, taskId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/userTask/${taskId}`);
    return data;
}

export const createUserTask = async(id, taskId, task)=>{
    const {data} = await $authHost.post(`/assignment/${id}/userTask/${taskId}`, task);
    return data;
}

export const updateUserTask = async(id, taskId, task)=>{
    const {data} = await $authHost.put(`/assignment/${id}/userTask/${taskId}`, task);
    return data;
}

export const deleteUserTask = async(id, taskId)=>{
    const {data} = await $authHost.delete(`/assignment/${id}/userTask/${taskId}`);
    return data;
}

export const getUserTaskById = async(id, taskId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/userTask/id/${taskId}`);
    return data;
}

export const setMark=async(id, taskId, mark)=>{
    const {data} = await $authHost.put(`/assignment/${id}/userTask/id/${taskId}`, {mark});
    return data;
}

export const getCompleteTasks=async (id, taskId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/userTask/${taskId}/complete`);
    return data;
}

export const checkAttempt=async (id, testId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/testAttempt/${testId}`);
    return data;
}

export const getUserAttempt = async(id, testId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/test/${testId}/testAttempt`);
    return data;
}

export const sendTestAnswer=async (id, testId, answers)=>{
    const {data} = await $authHost.post(`/assignment/${id}/testAttempt/${testId}`, answers);
    return {data};
}

export const saveTestProgress = async (courseId, testId, answers) => {
    const { data } = await $authHost.put(`/assignment/${courseId}/testAttempt/${testId}/save-progress`, { answers });
    return data;
};

export const getCompleteTest = async (id, testId)=>{
    const {data} = await  $authHost.get(`/assignment/${id}/completeTest/${testId}`);
    return data;
}

export const getCompleteTestById=async (id, completeTestId)=>{
    const {data} = await $authHost.get(`/assignment/${id}/completeTest/id/${completeTestId}`);
    return data;
}