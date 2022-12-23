const http = require("http");
const express = require("express");
const cors = require("cors");
const soketIo = require("socket.io");
const port = 5012 
const app = express();

const users = [{}]
const server = http.createServer(app);

const io = soketIo(server);

app.get("/", (req, res) => {
  res.send({ msg: "Hello World" });
});

io.on("connection", (socket) => {
  console.log("New Connection");

    socket.on("joined",({user})=>{
        users[socket.id] = user
        console.log(user)
        socket.emit("welcome",{user: "Admin", msg: "welcome to the chat "+users[socket.id]})
        socket.broadcast.emit("userJoined",{user: "admin", msg: "user has joined "+users[socket.id]})
    })

    socket.on("message",({msg,id})=>{
        io.emit("sendMessage",{user: users[id],msg,id})
    })

    socket.on("disconnect",()=>{
        console.log("user left")
    })



});

server.listen(port, () => {
  console.log("listen on", "http://localhost:" + port);
});
