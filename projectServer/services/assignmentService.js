const {Task, Test} = require("../models/models");
const AssignmentDTO = require("../DTO/AssignmentDTO");
const sequelize = require("../db");
const fileService = require("../services/fileService");
const TaskDTO = require("../DTO/TaskDTO");
const TestDTO = require("../DTO/TestDTO");

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
            return task.id;
        }
        catch(err){
            await fileService.deleteFromTemp(addedFiles);
            await fileService.deleteFromTemp(addedImages);
            await t.rollback();
            throw err;
        }
    }

    async getTask(id){
        const task = await Task.findOne({where:{id:id}});
        const taskWithFile = task.get({plain:true});
        taskWithFile["files"]=await fileService.getAllFiles("Task", id);
        return new TaskDTO(taskWithFile);
    }

    async deleteTask(id){
        const t = await sequelize.transaction();
        try{
            const task = await Task.findOne({where:{id:id}, transaction:t});
            const files = await  fileService.getTaskImages(task.text);
            await Task.destroy({where:{id:id}, transaction:t});
            await t.commit();
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
            await Task.update({text: task.text, CourseId: courseId, dueDate: task.dueDate, openDate: task.openDate, title: task.title},{where:{id: id}, transaction: t});
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
            const newTest = await Test.create({title:test.title, questions:test.questions, CourseId: courseId, dueDate: test.dueDate, openDate: test.openDate}, {transaction:t});
            await t.commit();
            return newTest.id;
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }

    async getTest(id){
        const test = await Test.findOne({where:{id:id}});
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
            await Test.update({title:test.title, questions:test.questions, CourseId: courseId, dueDate: test.dueDate, openDate: test.openDate}, {where:{id:id}, transaction:t});
            await t.commit();
            const newTest = await this.getTest(id);
            return new TestDTO(newTest);
        }
        catch(err){
            await t.rollback();
            throw err;
        }
    }
}

module.exports = new AssignmentService();