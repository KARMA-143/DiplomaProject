import {makeAutoObservable} from "mobx";

export class TaskStore {
        constructor() {
        this._title = undefined;
        this._text = undefined;
        this._openDate = undefined;
        this._dueDate = undefined;
        this._files = undefined;
        this._role=undefined;
        this._courseName=undefined;
        this._isOpen=undefined;
        makeAutoObservable(this);
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
    }
    get openDate() {
        return this._openDate;
    }
    set openDate(value) {
        this._openDate = value;
    }
    get dueDate() {
        return this._dueDate;
    }
    set dueDate(value) {
        this._dueDate = value;
    }
    get files() {
        return this._files;
    }
    set files(value) {
        this._files = value;
    }
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
    get courseName() {
        return this._courseName;
    }

    set courseName(value) {
        this._courseName = value;
    }
    get isOpen() {
        return this._isOpen;
    }

    set isOpen(value) {
        this._isOpen = value;
    }
    setTask(task) {
        this._title = task.title;
        this._text = task.text;
        this._openDate = task.openDate;
        this._dueDate = task.dueDate;
        this._files = task.files;
        this._courseName = task.courseName;
        this._isOpen=task.isOpen;
    }
}