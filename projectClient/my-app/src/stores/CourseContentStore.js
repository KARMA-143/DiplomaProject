import {makeAutoObservable} from "mobx";

export class CourseContentStore {
    constructor() {
        this._course=undefined;
        this._members=[];
        this._posts=[];
        this._tasks=[];
        makeAutoObservable(this);
    }

    get course() {
        return this._course;
    }

    set course(value) {
        this._course = value;
    }

    get members() {
        return this._members;
    }

    set members(value) {
        this._members = value;
    }

    get posts() {
        return this._posts;
    }

    set posts(value) {
        this._posts = value;
    }

    get tasks() {
        return this._tasks;
    }

    set tasks(value) {
        this._tasks = value;
    }

    setCourseContent(courseContent) {
        this._course=courseContent.course;
        this._posts=courseContent.posts;
        this._tasks=courseContent.tasks;
        this._members=courseContent.members;
    }
}