import {makeAutoObservable} from "mobx";

export class CourseStore{
    constructor(){
        this._courses = [];
        this._pages=undefined;
        makeAutoObservable(this);
    }
    get courses() {
        return this._courses;
    };
    set courses(value) {
        this._courses = value;
    };
    get pages() {
        return this._pages;
    }
    set pages(value) {
        this._pages = value;
    }
    setData(data){
        this._courses = data.courses;
        this._pages = Math.ceil(data.count/15);
    }
}