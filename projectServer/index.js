const express = require('express');
require('dotenv').config();
const models = require('./models/models.js')
const sequelize = require('./db')
const {createServer} = require("node:http");
const cookieParser = require("cookie-parser");
const router = require("./routers/index");
const cors =require('cors')
const path = require("node:path");
const fileUpload = require('express-fileupload');
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
app.use(cookieParser());
const server=createServer(app);
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}))
app.use(express.json())
app.use(fileUpload({}));
app.use('/api', router)
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(errorMiddleware);

const start=async()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync({alter:true})
        server.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))
    }
    catch(e){
        console.log(e)
    }
};

start();