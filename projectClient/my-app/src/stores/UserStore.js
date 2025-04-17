import {makeAutoObservable} from "mobx";

export class UserStore{
    constructor(){
        this._id=undefined;
        this._name=undefined;
        this._email=undefined;
        this._isActivated=undefined;
        makeAutoObservable(this);
    }
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }
    get isActivated() {
        return this._isActivated;
    }

    set isActivated(value) {
        this._isActivated = value;
    }
    resetUser(){
        this._id=undefined;
        this._name=undefined;
        this._email=undefined;
        this._isActivated=undefined;
    }
    setUser(user){
        this._id=user.id;
        this._name=user.name;
        this._email=user.email;
        this._isActivated=user.isActivated;
    }
}