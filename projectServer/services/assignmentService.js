const {Task, Test, Course, User, UserTask, TestAttempt, CompleteTest} = require("../models/models");
const AssignmentDTO = require("../DTO/AssignmentDTO");
const sequelize = require("../db");
const fileService = require("../services/fileService");
const TaskDTO = require("../DTO/TaskDTO");
const TestDTO = require("../DTO/TestDTO");
const {Op} = require("sequelize");
const AssignmentWithCourseDTO = require("../DTO/AssignmentWithCourseDTO");
const UserTaskDTO = require("../DTO/UserTaskDTO");
const commentService = require("./commentService");
const APIError = require("../exceptions/APIError");
const UserTaskWithUserDTO = require("../DTO/UserTaskWithUserDTO");
const TestWithAnswersDTO = require("../DTO/TestWithAnswersDTO");
const CompleteTestWithUserDTO = require("../DTO/CompleteTestWithUserDTO");
const mailService = require("./mailService");

class AssignmentService {
    async getCourseAssignments(CourseId) {
        const tasks= await Task.findAll({where:{CourseId: CourseId}});
        const tests = await Test.findAll({where:{CourseId: CourseId}});
        const assignments = [
            ...tasks.map(tasks=>{
                tasks["type"]="task";
                return tasks;
            }),
            ...tests.map(test=>{
                test["type"]="test";
                return test;
            })
        ].sort((a, b) => new Date(b.openDate) - new Date(a.openDate));
        return assignments.map(assignment=>new AssignmentDTO(assignment));
    }

    async createTask(courseId, task, files, images){
        const t = await sequelize.transaction();
        let addedFiles = [];
        let addedImages = [];
        try{
            const taskTextWithImages = await fileService.addTaskImages(images, task.imagesUrls, task.text);
            addedImages = taskTextWithImages.addedImages;
            task.text = taskTextWithImages.taskText;
            const newTask = await Task.create({text: task.text, CourseId: courseId, dueDate: task.dueDate, openDate: task.openDate, title: task.title},{transaction: t});
            addedFiles = await fileService.addEntityFiles("Task", newTask.id, files, t);
            await t.commit();
            await fileService.moveFilesFromTempToStatic(addedFiles);
            await fileService.moveFilesFromTempToStatic(addedImages);
            await mailService.createTaskInform(newTask);
            return newTask.id;
        }
        catch(err){
            await fileService.deleteFromTemp(addedFiles);
            await fileService.deleteFromTemp(addedImages);
            await t.rollback();
            throw err;
        }
    }

    async getTask(id){
        const task = await Task.findOne({where:{id:id}, include:[{model:Course, attributes:["name"]}]});
        const taskWithFile = task.get({plain:true});
        taskWithFile["files"]=await fileService.getAllFiles("Task", id);
        return new TaskDTO(taskWithFile);
    }

    async deleteTask(id){
        const t = await sequelize.transaction();
        try{
            const task = await Task.findOne({where:{id:id}, transaction:t});
            const images = await  fileService.getTaskImages(task.text);
            const files = await fileService.deleteEntityFiles("Task", task.id, t);
            await Task.destroy({where:{id:id}, transaction:t});
            await t.commit();
            await fileService.deleteFilesFromStatic(images);
            await fileService.deleteFilesFromStatic(files);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async updateTask(id, courseId, task, files, images){
        const t = await sequelize.transaction();
        let addedImages = [];
        try{
            const taskTextWithImages = await fileService.addTaskImages(images, task.imagesUrls, task.text);
            addedImages = taskTextWithImages.addedImages;
            task.text = taskTextWithImages.taskText;
            await Task.update({text: task.text, dueDate: task.dueDate, openDate: task.openDate, title: task.title},{where:{id: id}, transaction: t});
            const filesToDelete = await fileService.deleteExistingFiles("Task", id, task.filesId, t);
            const imagesToDelete = await fileService.deleteFilteredImages(task.serverImages, task.text);
            files = await fileService.addEntityFiles("Task", id, files, t);
            await t.commit();
            await fileService.deleteFilesFromStatic(filesToDelete);
            await fileService.moveFilesFromTempToStatic(files);
            await fileService.moveFilesFromTempToStatic(addedImages);
            await fileService.deleteFilesFromStatic(imagesToDelete)
            return await this.getTask(id);
        }
        catch(err){
            await fileService.deleteFromTemp(files);
            await fileService.deleteFromTemp(addedImages);
            await t.rollback();
            throw err;
        }
    }

    async createTest(courseId, test){
        const t = await sequelize.transaction();
        try{
            const newTest = await Test.create({title:test.title, questions:test.questions, CourseId: courseId, dueDate: test.dueDate, openDate: test.openDate, timeLimit: test.timeLimit}, {transaction:t});
            await t.commit();
            await mailService.createTestInform(newTest);
            return newTest.id;
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async getTest(id){
        const test = await Test.findOne({where:{id:id}, include:[{model:Course, attributes:["name"]}]});
        return new TestDTO(test);
    }

    async deleteTest(id){
        const t = await sequelize.transaction();
        try{
            await Test.destroy({where:{id:id}, transaction:t});
            await t.commit();
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async updateTest(id, courseId, test){
        const t = await sequelize.transaction();
        try{
            await Test.update({title:test.title, questions:test.questions, dueDate: test.dueDate, openDate: test.openDate, timeLimit: test.timeLimit}, {where:{id:id}, transaction:t});
            await t.commit();
            return await this.getTest(id);
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async  getUserAssignments(id) {
        const now = new Date();
        const creatorTasks = await Task.findAll({
            where:{[Op.or]: [
                    { openDate: { [Op.gt]: now } },
                    { dueDate: { [Op.gt]: now } }
                ]},
            attributes: ["id", "title", "openDate", "dueDate"],
            include: [{
                model: Course,
                attributes: ["id", "name"],
                where: { creatorId: id },
                required: true,
            }],
        });

        const participantTasks = await Task.findAll({
            where:{[Op.or]: [
                    { openDate: { [Op.gt]: now } },
                    { dueDate: { [Op.gt]: now } }
                ]},
            attributes: ["id", "title", "openDate", "dueDate"],
            include: [{
                model: Course,
                attributes: ["id", "name"],
                include: [{
                    model: User,
                    where: { id },
                    through: { attributes: ["isMentor"] },
                    required: true,
                }],
                required: true,
            }],
        });

        const creatorTests = await Test.findAll({
            where:{[Op.or]: [
                    { openDate: { [Op.gt]: now } },
                    { dueDate: { [Op.gt]: now } }
                ]},
            attributes: ["id", "title", "openDate", "dueDate"],
            include: [{
                model: Course,
                attributes: ["id", "name"],
                where: { creatorId: id },
                required: true,
            }],
        });

        const participantTests = await Test.findAll({
            where:{[Op.or]: [
                    { openDate: { [Op.gt]: now } },
                    { dueDate: { [Op.gt]: now } }
                ]},
            attributes: ["id", "title", "openDate", "dueDate"],
            include: [{
                model: Course,
                attributes: ["id", "name"],
                include: [{
                    model: User,
                    where: { id },
                    through: { attributes: ["isMentor"] },
                    required: true,
                }],
                required: true,
            }],
        });

        const allTasks = [...creatorTasks.map(task=>new AssignmentWithCourseDTO(task, true, "task")), ...participantTasks.map(task=>new AssignmentWithCourseDTO(task, task.Course.Users[0].CourseUsers.isMentor, "task"))];
        const allTests = [...creatorTests.map(test=>new AssignmentWithCourseDTO(test, true, "test")), ...participantTests.map(test=>new AssignmentWithCourseDTO(test, test.Course.Users[0].CourseUsers.isMentor, "test"))];

        return [...allTasks, ...allTests].sort((a, b) => new Date(a.openDate) - new Date(b.openDate));
    }

    async getUserAssignmentsGroupedByCourse(id){
        const assignments = await this.getUserAssignments(id);
        const assignmentsGroupedByCourse = [];
        assignments.forEach(assignment => {
            const index = assignmentsGroupedByCourse.findIndex(groupedAssignment => groupedAssignment.course.id === assignment.course.id);
            if(index===-1){
                assignmentsGroupedByCourse.push({course:{...assignment.course, role: assignment.role}, assignments:[new AssignmentDTO(assignment)]});
            }
            else{
                assignmentsGroupedByCourse[index].assignments.push(new AssignmentDTO(assignment));
            }
        });
        return assignmentsGroupedByCourse;
    }

    async getUserTask(userId, id){
        const userTask = await UserTask.findOne({where:{UserId:userId, TaskId:id}, include:[{model:Task, attributes:["dueDate"]}]});
        if(!userTask){
            return null;
        }
        const userTaskWithFile = userTask.get({plain:true});
        userTaskWithFile["files"]=await fileService.getAllFiles("UserTask", userTaskWithFile.id);
        userTaskWithFile["comments"] = await commentService.getAllEntityComments("UserTask", userTaskWithFile.id);
        return new UserTaskDTO(userTaskWithFile);
    }

    async getUserTaskById(id){
        const userTask = await UserTask.findOne({where:{id:id}, include:[{model:User, attributes:["id", "name", "email"]}, {model:Task, attributes:["title"], include:[{model:Course, attributes:["name"]}]}]});
        if(!userTask){
            throw APIError.BadRequestError("User task does not exist!");
        }
        const userTaskWithFile = userTask.get({plain:true});
        userTaskWithFile["files"]=await fileService.getAllFiles("UserTask", userTaskWithFile.id);
        userTaskWithFile["comments"] = await commentService.getAllEntityComments("UserTask", userTaskWithFile.id);
        return new UserTaskWithUserDTO(userTaskWithFile);
    }

    async createUserTask(id, task, userId, files, images){
        const t = await sequelize.transaction();
        let addedFiles = [];
        let addedImages = [];
        try{
            const candidateTask = await UserTask.findOne({where:{UserId:userId, TaskId:id}});
            if(candidateTask){
                throw APIError.BadRequestError("User task already exists!");
            }
            const taskTextWithImages = await fileService.addTaskImages(images, task.imagesUrls, task.text);
            addedImages = taskTextWithImages.addedImages;
            task.text = taskTextWithImages.taskText;
            const newTask = await UserTask.create({text: task.text, TaskId: id, UserId:userId},{transaction: t});
            addedFiles = await fileService.addEntityFiles("UserTask", newTask.id, files, t);
            await t.commit();
            await fileService.moveFilesFromTempToStatic(addedFiles);
            await fileService.moveFilesFromTempToStatic(addedImages);
            return this.getUserTask(userId, id);
        }
        catch(err){
            await fileService.deleteFromTemp(addedFiles);
            await fileService.deleteFromTemp(addedImages);
            await t.rollback();
            throw err;
        }
    }

    async updateUserTask(id, courseId, task, files, images, userId){
        const t = await sequelize.transaction();
        let addedImages = [];
        try{
            const candidateTask = await UserTask.findOne({where:{UserId:userId, TaskId:id}});
            if(candidateTask.mark!==null){
                return APIError.BadRequestError("User task already checked!");
            }
            const taskTextWithImages = await fileService.addTaskImages(images, task.imagesUrls, task.text);
            addedImages = taskTextWithImages.addedImages;
            task.text = taskTextWithImages.taskText;
            await UserTask.update({text: task.text},{where:{UserId:userId, TaskId:id}, transaction: t});
            const filesToDelete = await fileService.deleteExistingFiles("UserTask", candidateTask.id, task.filesId, t);
            const imagesToDelete = await fileService.deleteFilteredImages(task.serverImages, task.text);
            files = await fileService.addEntityFiles("UserTask", candidateTask.id, files, t);
            await t.commit();
            await fileService.deleteFilesFromStatic(filesToDelete);
            await fileService.moveFilesFromTempToStatic(files);
            await fileService.moveFilesFromTempToStatic(addedImages);
            await fileService.deleteFilesFromStatic(imagesToDelete)
            return await this.getUserTask(userId, id);
        }
        catch(err){
            await fileService.deleteFromTemp(files);
            await fileService.deleteFromTemp(addedImages);
            await t.rollback();
            throw err;
        }
    }

    async deleteUserTask(id, userId){
        const t = await sequelize.transaction();
        try{
            const task = await UserTask.findOne({where:{TaskId:id, UserId:userId}, transaction:t});
            if(task.mark!==null){
                return APIError.BadRequestError("User task already checked!");
            }
            const images = await  fileService.getTaskImages(task.text);
            const files = await fileService.deleteEntityFiles("UserTask", task.id, t);
            await UserTask.destroy({where:{TaskId:id, UserId:userId}, transaction:t});
            await t.commit();
            await fileService.deleteFilesFromStatic(images);
            await fileService.deleteFilesFromStatic(files);
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async setMark(id, mark){
        const t = await sequelize.transaction();
        try{
            await UserTask.update({mark:mark}, {where:{id:id}, transaction:t});
            await t.commit();
            await mailService.createMarkInform(await this.getUserTaskById(id));
        }
        catch(err){
            console.log(err);
            await t.rollback();
            throw err;
        }
    }

    async getCompleteTasks(id){
        return await UserTask.findAll({
            where: {TaskId: id},
            attributes: ["id", "mark"],
            include: [{model: User, attributes: ["id", "email", "name"]}]
        });
    }

    async checkUserAttempt(id, userId){
        const attempt = await TestAttempt.findOne({where:{TestId:id, UserId:userId}});
        if(attempt){
            return {status:"resume"}
        }
        const completeTest = await CompleteTest.findOne({where:{TestId:id, UserId:userId}});
        if(!completeTest){
            return {status:"uncompleted"};
        }
        else{
            const test = await this.getTest(completeTest.TestId);
            return new TestWithAnswersDTO(test, completeTest);
        }
    }

    async getTestWithoutAnswers(id){
        const test = await this.getTest(id);
        test.questions =  test.questions.map(question=>{
            switch(question.type){
                case "singleChoice":
                    return{
                        type:question.type,
                        text:question.type,
                        options:question.options
                    }
                case "multipleChoice":
                    return{
                        type:question.type,
                        text:question.type,
                        options:question.options
                    }
                case "openEnded":
                    return{
                        type:question.type,
                        text:question.type,
                    }
                case "matching":
                    return{
                        type:question.type,
                        text:question.type,
                        options:question.options,
                        answers:question.answers
                    }
            }
        });
        return test;
    }

    async getUserAttempt(id, userId){
        const t = await sequelize.transaction();
        try{
            const test = await this.getTestWithoutAnswers(id);
            const completeTest = await CompleteTest.findOne({where:{TestId:id, UserId:userId}});
            if(completeTest){
                throw APIError.BadRequestError("Test already completed!");
            }
            const attempt = await TestAttempt.findOne({where:{TestId:id, UserId:userId}, attributes:["startTime", "answers"]});
            if(attempt){
                await t.commit();
                return {
                    timeLimit: test.timeLimit,
                    title: test.title,
                    questions: test.questions,
                    startTime:attempt.startTime,
                    answers:attempt.answers};
            }
            else{
                const answers = test.questions.map(_=>{
                    return "";
                });
                const newAttempt = await TestAttempt.create({TestId:id, UserId:userId, startTime: Date.now(), answers:answers},{transaction:t});
                await t.commit();
                return {
                    startTime:newAttempt.startTime,
                    answers:newAttempt.answers,
                    timeLimit: test.timeLimit,
                    title: test.title,
                    questions: test.questions,
                }
            }
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async checkTest(id, userId, answers){
        const t = await sequelize.transaction();
        try{
            const completeTest = await CompleteTest.findOne({where:{UserId:userId, TestId:id}});
            if(completeTest){
                throw new APIError.BadRequestError("Test already completed!");
            }
            await TestAttempt.destroy({where:{UserId:userId, TestId:id}, transaction:t});
            const test = await this.getTest(id);
            let correctAnswers = 0;
            const points=[];
            test.questions.forEach((question, index) => {
                const userAnswer = answers[index];
                switch (question.type) {
                    case "singleChoice":
                        correctAnswers += (userAnswer!=='' && (question.correctAnswer === +userAnswer)) ? 1 : 0;
                        points[index]=(userAnswer!=='' && (question.correctAnswer === +userAnswer)) ? 1 : 0;
                        break;
                    case "multipleChoice":
                        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
                            const total = question.correctAnswer.length;
                            const correctCount = userAnswer.filter(a => question.correctAnswer.includes(a)).length;
                            const incorrectCount = userAnswer.filter(a => !question.correctAnswer.includes(a)).length;

                            if (correctCount === total && incorrectCount === 0) {
                                correctAnswers += 1;
                                points[index]=1;
                            } else if (correctCount >= total / 2 && incorrectCount === 0) {
                                correctAnswers += 0.5;
                                points[index]=0.5;
                            } else {
                                correctAnswers += 0;
                                points[index]=0;
                            }
                        }
                        break;
                    case "openEnded":
                        correctAnswers += question.correctAnswer === userAnswer ? 1 : 0;
                        points[index]=question.correctAnswer === userAnswer ? 1 : 0;

                        break;
                    case "matching":
                        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
                            const totalPairs = question.correctAnswer.length;
                            let correctPairsCount = 0;
                            question.correctAnswer.forEach(correctPair => {
                                const match = userAnswer.find(userPair =>
                                    userPair.option === correctPair.option &&
                                    userPair.answer === correctPair.answer
                                );
                                if (match) correctPairsCount++;
                            });
                            if (correctPairsCount === totalPairs) {
                                correctAnswers += 1;
                                points[index]=1;
                            } else if (correctPairsCount >= totalPairs / 2) {
                                correctAnswers += 0.5;
                                points[index]=0.5;
                            } else {
                                correctAnswers += 0;
                                points[index]=0;
                            }
                        }
                        break;
                    default:
                        break;
                }
            });
            const mark = Math.round(correctAnswers/test.questions.length*10)||1;
            await CompleteTest.create({UserId:userId, TestId:id, mark:mark, answers:answers, points}, {transaction:t});
            await t.commit();
        }
        catch (err){
            await t.rollback();
            throw err;
        }
    }

    async finishTestAttempts() {
        try {
            const now = new Date();
            const attempts = await TestAttempt.findAll({ include: [Test] });

            for (const attempt of attempts) {
                const { createdAt, TestId, UserId, answers } = attempt;
                const test = attempt.Test;
                const deadline = new Date(createdAt.getTime() + test.timeLimit * 60000);
                if (now > deadline) {
                    await this.checkTest(TestId, UserId, answers);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    startMonitoringAttempts(intervalMs = 60 * 1000) {
        setInterval(this.finishTestAttempts.bind(this), intervalMs);
    }

    async saveProgress(id, userId, answers){
        const t= await sequelize.transaction();
        try{
            await TestAttempt.update({answers:answers},{where:{TestId:id, UserId:userId}, transaction:t});
            await t.commit();
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async getCompleteTests(id){
        const completeTests = await CompleteTest.findAll({where:{TestId:id}, attributes:["id", "mark", "points"], include:[{model:User, attributes:["id", "name", "email"]}]});
        return completeTests.map(test=>new CompleteTestWithUserDTO(test));
    }

    async getCompleteTestById(id){
        const completeTest = await CompleteTest.findOne({where:{id:id}, attributes:["id", "mark", "points", "answers"], include:[{model:User, attributes:["id", "name", "email"]},{model:Test, attributes:["title", "questions"], include:[{model:Course, attributes:["name"]}]}]});
        return {
            ...new TestWithAnswersDTO(completeTest.Test, completeTest),
            user: completeTest.User,
            courseName: completeTest.Test.Course.name,
            testTitle: completeTest.Test.title,
        }
    }
}

module.exports = new AssignmentService();