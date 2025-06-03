const assignmentService = require("../services/assignmentService")

class assignmentController {
    async getCourseAssignments(req, res, next) {
        try{
            const courseId = req.params.id;
            const assignments = await assignmentService.getCourseAssignments(courseId);
            return res.status(200).json(assignments)
        }
        catch(err){
            next(err);
        }
    }

    async createTask(req, res, next){
        try{
            const courseId = req.params.id;
            const task = req.body;
            const files = req.files?.files;
            const images = req.files?.images;
            const id = await assignmentService.createTask(courseId, task, files, images);
            return res.status(200).json({id: id});
        }
        catch(err){
            next(err);
        }
    }

    async getTask(req, res, next){
        try{
            const id = req.params.taskId;
            const task = await assignmentService.getTask(id);
            return res.status(200).json(task);
        }
        catch(err){
            next(err);
        }
    }

    async deleteTask(req, res, next){
        try{
            const id = req.params.taskId;
            await assignmentService.deleteTask(id);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async updateTask(req, res, next){
        try{
            const id = req.params.taskId;
            const courseId = req.params.id;
            const task = req.body;
            const files = req.files?.files;
            const images = req.files?.images;
            const newTask = await assignmentService.updateTask(id, courseId, task, files, images);
            return res.status(200).json(newTask);
        }
        catch(err){
            next(err);
        }
    }

    async createTest(req, res, next){
        try{
            const courseId = req.params.id;
            const test = req.body;
            const id = await assignmentService.createTest(courseId, test);
            return res.status(200).json({id: id});
        }
        catch (err) {
            next(err);
        }
    }

    async getTest(req, res, next){
        try{
            const id = req.params.testId;
            const test = await assignmentService.getTest(id);
            return res.status(200).json(test);
        }
        catch (err){
            next(err);
        }
    }

    async deleteTest(req, res, next){
        try{
            const id = req.params.testId;
            await assignmentService.deleteTest(id);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async updateTest(req, res, next){
        try{
            const id = req.params.testId;
            const courseId = req.params.id;
            const test = req.body;
            const newTest = await assignmentService.updateTest(id, courseId, test);
            return res.status(200).json(newTest);
        }
        catch(err){
            next(err);
        }
    }

    async getUserAssignments(req, res, next){
        try{
            const user = req.user;
            const assignments = await assignmentService.getUserAssignments(user.id);
            return res.status(200).json(assignments);
        }
        catch(err){
            next(err);
        }
    }

    async getUserAssignmentsGroupedByCourse(req, res, next){
        try{
            const user = req.user;
            const assignments = await assignmentService.getUserAssignmentsGroupedByCourse(user.id);
            return res.status(200).json(assignments);
        }
        catch (err){
            next(err);
        }
    }

    async getUserTask(req, res, next){
        try{
            const user = req.user;
            const id = req.params.taskId;
            const userTask = await assignmentService.getUserTask(user.id, id);
            return res.status(200).json(userTask);
        }
        catch(err){
            next(err);
        }
    }

    async createUserTask(req, res, next){
        try{
            const user = req.user;
            const task = req.body;
            const id =req.params.taskId;
            const files = req.files?.files;
            const images = req.files?.images;
            const newTask = await assignmentService.createUserTask(id, task, user.id, files, images);
            return res.status(200).json(newTask);
        }
        catch(err){
            next(err);
        }
    }

    async updateUserTask(req, res, next){
        try{
            const user = req.user;
            const id = req.params.taskId;
            const courseId = req.params.id;
            const task = req.body;
            const files = req.files?.files;
            const images = req.files?.images;
            const newTask = await assignmentService.updateUserTask(id, courseId, task, files, images, user.id);
            return res.status(200).json(newTask);
        }
        catch(err){
            next(err);
        }
    }

    async deleteUserTask(req, res, next){
        try{
            const user = req.user;
            const id = req.params.taskId;
            await assignmentService.deleteUserTask(id, user.id);
            return res.status(200).send();
        }
        catch (err){
            next(err);
        }
    }

    async getUserTaskById(req, res, next){
        try{
            const id = req.params.taskId;
            const userTask = await assignmentService.getUserTaskById(id);
            return res.status(200).json(userTask);
        }
        catch(err){
            next(err);
        }
    }

    async setMark(req, res, next){
        try{
            const id = req.params.taskId;
            const body = req.body;
            await assignmentService.setMark(id, body.mark);
            return res.status(200).send();
        }
        catch (err){
            next(err);
        }
    }

    async getCompleteTasks(req, res, next){
        try{
            const id = req.params.taskId;
            const tasks = await assignmentService.getCompleteTasks(id);
            return res.status(200).json(tasks);
        }
        catch(err){
            next(err);
        }
    }

    async checkUserAttempt(req, res, next){
        try{
            const user = req.user;
            const id = req.params.testId;
            const attempt = await assignmentService.checkUserAttempt(id, user.id);
            return res.status(200).json(attempt);
        }
        catch (err){
            next(err);
        }
    }

    async getUserAttempt(req, res, next){
        try{
            const user = req.user;
            const id = req.params.testId;
            const attempt = await assignmentService.getUserAttempt(id, user.id);
            return res.status(200).json(attempt);
        }
        catch(err){
            next(err);
        }
    }

    async checkTest(req, res, next){
        try{
            const user = req.user;
            const id = req.params.testId;
            const answers = req.body;
            await assignmentService.checkTest(id, user.id, answers);
            return res.status(200).send();
        }
        catch(err){
            next(err)
        }
    }

    async saveProgress(req, res, next){
        try{
            const user = req.user;
            const id = req.params.testId;
            const body = req.body;
            await assignmentService.saveProgress(id, user.id, body.answers);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async getCompleteTests(req, res, next){
        try{
            const id = req.params.testId;
            const completeTests = await assignmentService.getCompleteTests(id);
            return res.status(200).json(completeTests);
        }
        catch (err){
            next(err);
        }
    }

    async getCompleteTestById(req, res, next){
        try{
            const id = req.params.completeTestId;
            const completeTest = await assignmentService.getCompleteTestById(id);
            return res.status(200).json(completeTest);
        }
        catch (err){
            next(err);
        }
    }
}

module.exports = new assignmentController();