import {makeAutoObservable} from "mobx";

export class SnackbarStore{
    constructor() {
        this.open=false;
        this.text='';
        this.severity='info';
        makeAutoObservable(this);
    }
    show(text, severity) {
        this.text = text;
        this.severity = severity;
        this.open=true;
    }
    close(){
        this.open=false;
    }
}