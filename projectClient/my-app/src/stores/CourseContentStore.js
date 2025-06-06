import {makeAutoObservable} from "mobx";

export class CourseContentStore {
    constructor() {
        this._course=undefined;
        this._members=[];
        this._posts=[];
        this._tasks=[];
        this._invitations=[];
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

    get invitations() {
        return this._invitations;
    }

    set invitations(value) {
        this._invitations = value;
    }
}