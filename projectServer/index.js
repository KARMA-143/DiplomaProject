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
const assignmentService = require("./services/assignmentService");
const {Server} = require("socket.io");

const app = express();
app.use(cookieParser());
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods:["GET","POST"],
    }
});
app.use(cors({
    origin:["http://localhost:3000", "http://192.168.1.174:3000"],
    credentials: true,
}))
app.use(express.json())
app.use(fileUpload({}));
app.use('/api', router)
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(errorMiddleware);

io.on('connection', (socket)=>{
    socket.on('send_message',(data)=>{
        console.log(data);
        socket.broadcast.to(`user_${data.userId}`).emit("receive_message",data);
    });

    socket.on("update_message",(data)=>{
        socket.broadcast.to(`user_${data.userId}`).emit("update_chat",data);
    });

    socket.on("delete_message",(data)=>{
        console.log(data);
        socket.broadcast.to(`user_${data.userId}`).emit("delete_chat",data.id);
    });
    socket.on("user_connect", (userId)=>{
        socket.join(`user_${userId}`);
    });

    socket.on("user_disconnect", (userId)=>{
        socket.leave(`user_${userId}`);
    });
})

const start=async()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync({alter:true});
        await assignmentService.startMonitoringAttempts(60*1000);
        server.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))
    }
    catch(e){
        console.log(e)
    }
};

start();