export class CoverStore {
    constructor() {
        this._covers = [
            "0dde92c719100740370abb51a396cd98.jpg",
            "24e88fb2bca8f4f4d3a56a300b61fc6c.jpg",
            "702dc24927ca80ef8829326befff132e.jpg",
            "734a4fc0d357487cd8c917d2edc6c544.jpg",
            "926b82ee8bf2926242e4c5f59a7a3fb3.jpg",
            "03207deec182db4558dde9c9f2742e51.jpg",
            "22204d5d79326487271e1a3345a8a87f.jpg",
            "bf6f74896b53ff78f2df546167e38863.jpg",
            "e01f5737357b9fea77350d2dd2e0bc60.jpg",
        ];
    }
    get covers() {
        return this._covers;
    }
}