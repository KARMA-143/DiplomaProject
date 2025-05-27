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
}

module.exports = new assignmentController();