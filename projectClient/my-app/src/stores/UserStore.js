import {makeAutoObservable} from "mobx";

export class UserStore{
        constructor(){
        this._id=undefined;
        this._name=undefined;
        this._email=undefined;
        this._isActivated=undefined;
        this._invitationCount=0;
        this._isInstalled=false;
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
        this._invitationCount=0;
        this._isInstalled=false;
    }
    setUser(user){
        this._id=user.id;
        this._name=user.name;
        this._email=user.email;
        this._isActivated=user.isActivated;
        this._isInstalled=true;
    }
    get invitationCount() {
        return this._invitationCount;
    }
    set invitationCount(value) {
        this._invitationCount = value;
    }
    get isInstalled() {
        return this._isInstalled;
    }
    set isInstalled(value) {
        this._isInstalled = value;
    }
}