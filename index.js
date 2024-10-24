const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const PORT = 8000;

const server = http.createServer(app);
const io = socketIo(server);

const userMap = new Map();

io.on("connection", (socket) => {
    console.log(`A user connected`);
    const userId = socket.handshake.query.id
    userMap.set(userId,socket.id);
    console.log("hashmap => ", userMap);

    socket.on("sendMessage", (msg) => {
        console.log(socket.id, msg);
        /*
        const recieverSocketId = userMap.get(msg.recievedby)
        console.log("receiverSocketId",recieverSocketId?.toString())
        io.to(recieverSocketId).emit("rcv-msg",{  // Agar specific user ko bhejna ho to
            sendBy: socket.handshake.query.id,
            msg: msg.msg
        })
        // io.emit("rcv-msg",msg);  // Agar sab user ko bhejna ho to 
        */

        
        // msg.recievedby.forEach(userId => {
        //     console.log(`User ID: ${userId}, Socket ID: ${userMap.get(userId.toString())}`);
        // });

        // msg.receivedBy should be an array of user IDs
        const receiverSocketIds = msg.recievedby.map(userId => userMap.get(userId.toString())).filter(id => id); // get socket IDs from userMap
        
        console.log("receiverSocketIds", receiverSocketIds);

        // Iterate over each receiver's socket ID and send the message
        receiverSocketIds.forEach(receiverSocketId => {
            io.to(receiverSocketId).emit("rcv-msg", {
                sentBy: socket.handshake.query.id,
                msg: msg.msg
            });
        });



    });
});


server.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
})