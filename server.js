const path = require("path")
const express = require("express")
const app = express()
const http = require("http")
const Server = http.createServer(app)
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const {userJoin ,getCurrentUser, userLeave,
    getRoomUsers} = require("./utils/users")

//Serving static files
app.use(express.static(path.join(__dirname,"public")))
const io = socketio(Server)
const botName = 'Guftagu Bot'
const port  = process.env.port || 3000;

//Run whenever a client connects
io.on("connection",(socket)=>{
 socket.on('joinRoom',({username ,room})=>{
    const user = userJoin(socket.id,username,room)

    socket.join(user.room);


//Welcome current user
socket.emit('message',formatMessage(botName,"Welcome to Guftago"))

//Broadcast when a user connects
socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

//send users and room info
io.to(user.room).emit('roomUsers',{
room:user.room,
users:getRoomUsers(user.room)
});

    });


    //Listen for chat message event

    socket.on('chatMessage',(msg)=>{

        const user = getCurrentUser(socket.id);

       io.to(user.room).emit('message',formatMessage(user.username,msg)); 
    })



    
    //Runs when user disconnect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,` ${user.username} have left the chat`));


            //send users and room info
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
    });


        }

    });


})


Server.listen(port,()=>console.log(`Server running on port ${port}`))