const {File} = require("../models/models");
const {join} = require("node:path");
const {promises} = require("node:fs");
const uuid = require("uuid");
const path = require("node:path");
const fs = require("node:fs");
const {Op} = require("sequelize");
const cheerio = require('cheerio');

class fileService {
    async getAllFiles(entityType, entityId) {
        const files = await File.findAll({where:{entityId: entityId, entityType:entityType}});
        return await Promise.all(files.map(async (file)=>{
            file = file.get({plain:true});
            const fullPath = join(__dirname, "..", "static", file.path);
            const stats = await promises.stat(fullPath);
            file["size"]=stats.size;
            return file;
        }));
    }

    async addEntityFiles(entityType, entityId, files, transaction) {
        files= Array.isArray(files)
            ? files
            : files ? [files] : [];
        return await Promise.all(files.map(async (file)=>{
            const ext = file.name.split(".").pop();
            const filePath = `${uuid.v4()}.${ext}`;
            await file.mv(path.resolve(__dirname, '..', 'static', 'tmp', filePath));
            const createdFile = await File.create({name: Buffer.from(file.name, 'latin1').toString('utf8'), path: filePath, entityId: entityId, entityType: entityType}, {transaction});
            const stats = await promises.stat(path.resolve(__dirname, '..', 'static', 'tmp', filePath));
            file = createdFile.get({plain:true});
            file["size"]=stats.size;
            return file;
        }));
    }

    async deleteEntityFiles(entityType, entityId, transaction) {
        const files = await File.findAll({where:{entityId:entityId, entityType: entityType}});
        await File.destroy({where:{entityId:entityId, entityType: entityType}, transaction});
        return files;
    }

    async deleteExistingFiles(entityType, entityId, filesId, transaction) {
        filesId=JSON.parse(filesId);
        const removedFiles = await File.findAll({where:{entityId:entityId, entityType: entityType, id:{[Op.notIn]:filesId}}});
        await File.destroy({where:{entityId:entityId, entityType: entityType, id:{[Op.notIn]:filesId}}, transaction});
        return removedFiles;
    }

    async moveFilesFromTempToStatic(files){
        for(const file of files){
            const originPath = join(__dirname, "..", "static", "tmp", file.path);
            const finalPath = path.resolve(__dirname, '..', 'static', file.path);
            try {
                await fs.promises.rename(originPath, finalPath);
            } catch (err) {
                console.error(`Error moving file ${file.path}:`, err);
            }
        }
    }

    async deleteFromTemp(files){
        for(const file of files){
            await fs.promises.unlink(path.resolve(__dirname, "..", "static", "tmp", file.path)).catch((err) => {
                console.error(`File ${file.path} was not removed!`, err)
            });
        }
    }

    async deleteFilesFromStatic(files){
        for(const file of files){
            await fs.promises.unlink(path.resolve(__dirname, "..", "static", file.path)).catch((err) => {
                console.error(`File ${file.path} was not removed!`, err)
            });
        }
    }

    async addTaskImages(files, urls, taskText) {
        files= Array.isArray(files)
            ? files
            : files ? [files] : [];
        urls = Array.isArray(urls)
            ? urls
            : urls ? [urls] : [];
        const addedImages = await Promise.all(files.map(async (file, index)=>{
            const ext = file.name.split(".").pop();
            const filePath = `${uuid.v4()}.${ext}`;
            await file.mv(path.resolve(__dirname, '..', 'static', 'tmp', filePath));
            taskText=taskText.replaceAll(urls[index], `${process.env.API_URL}/static/${filePath}`);
            file.path=filePath;
            return file;
        }));
        return {addedImages, taskText};
    }

    async getTaskImages(text){
        const $ = cheerio.load(text);
        const srcList = [];
        $('img').each((_, img) => {
            const src = $(img).attr('src');
            if (src) srcList.push(src);
        });
        return srcList.map(file=>{
            return {
                path: file.replace(`${process.env.API_URL}/static/`,""),
            }
        })
    }

    async deleteFilteredImages(serverImages, text){
        const $ = cheerio.load(text);
        const srcList = [];
        $('img').each((_, img) => {
            const src = $(img).attr('src');
            if (src) srcList.push(src);
        });
        serverImages= Array.isArray(serverImages)
            ? serverImages
            : serverImages ? [serverImages] : [];
        serverImages = serverImages.filter(image=>{
            return !srcList.includes(image);
        });
        return serverImages.map(file=>{
            return {
                path: file.replace(`${process.env.API_URL}/static/`,""),
            }
        })
    }
}

module.exports = new fileService();