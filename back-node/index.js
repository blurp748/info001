const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const port = 3000;

// Home route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Server API." });
});

//Websockets
const websocketServer = app.listen(port, () => {
    console.log(`WebSocket Server is running on port ${port}.`);
});

const io = require('socket.io')(websocketServer, {
    cors: {
        origin: '*'
    }
});


let txt = [];
let sockets = {};

io.on('connection', function (socket) {
    console.log("socket connected");
    sockets[socket.id] = {};
    io.to(socket.id).emit("message",{
        action: "sendMessage",
        value: txt,
        firstTime: ""
    })
    socket.on("message", function (data) {
        console.log("message received : ", data.action);
        if (data.action == "addCharacter") {
            addCharacter(socket,data)
            return;
        }
        if (data.action == "deleteCharacter") {
            deleteCharacter()
            return;
        }
        if (data.action == "changeStyle") {
            changeStyle(socket,data)
            return;
        }

    });
});

io.on('disconnect', function () {
    console.log("disconnected");
});

function addCharacter(socket,realData){
    console.log(realData)

    txt.push({
        style: sockets[socket.id],
        char: realData.value
    })

    var data = {}
    data["action"] = "sendMessage"
    data["value"] = txt

    io.sockets.emit('message', data);
}

function deleteCharacter(){
    txt.pop()

    var data = {}
    data["action"] = "sendMessage"
    data["value"] = txt

    io.sockets.emit('message', data);
}

function changeStyle(socket,realData){
    console.log(realData)
    sockets[socket.id] = realData.value;
}