import {makeAutoObservable} from "mobx";

export class TestStore {
    constructor() {
        this._title = undefined;
        this._openDate = undefined;
        this._dueDate = undefined;
        this._questions = undefined;
        this._role=undefined;
        makeAutoObservable(this);
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get questions() {
        return this._questions;
    }
    set questions(value) {
        this._questions = value;
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
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
    setTest(test) {
        this._title = test.title;
        this._openDate = test.openDate;
        this._dueDate = test.dueDate;
        this._questions = test.questions;
    }
}