import {makeAutoObservable} from "mobx";

export class InvitationStore {
    constructor() {
        this._invitations = []
        makeAutoObservable(this);
    }
    get invitations() {
        return this._invitations;
    }
    set invitations(value) {
        this._invitations = value;
    }
}