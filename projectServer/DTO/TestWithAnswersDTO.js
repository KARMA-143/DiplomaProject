class TestWithAnswersDTO {
    constructor(test, completeTest) {
        this.testInfo={
            mark:completeTest.mark,
            correctAnswers:completeTest.points.reduce((sum,point)=>sum+point, 0)
        }
        this.testWithUserAnswers=test.questions.map((question, index)=>{
            return {
                ...question,
                userAnswer:completeTest.answers[index],
                points:completeTest.points[index]
            }
        })
    }
}

module.exports = TestWithAnswersDTO;