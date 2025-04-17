const {Task, File} = require("../models/models");

class TaskService {
    async getCourseTasks(courseId) {
        const tasks= await Task.findAll({where:{CourseId: courseId}});
        return Promise.all(tasks.map(async task => {
            task.dataValues["files"]=await File.findAll({where:{entityId: task.id, entityType:"Task"}});
        }))
    }
}

module.exports = new TaskService();