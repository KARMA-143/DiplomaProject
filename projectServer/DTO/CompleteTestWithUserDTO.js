class CompleteTestWithUserDTO {
    constructor(test) {
        this.id=test.id;
        this.mark = test.mark;
        this.user = test.User;
        this.correctAnswer = test.points.reduce((sum,point)=>sum+point, 0);
    }
}

module.exports = CompleteTestWithUserDTO;