import {makeAutoObservable} from "mobx";

export class UserAssignments {
        constructor() {
        this._assignments = [];
        makeAutoObservable(this);
    }
    get assignments() {
        return this._assignments;
    }

    set assignments(value) {
        this._assignments = value;
    }
}