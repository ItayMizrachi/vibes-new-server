// const iosocket = require('socket.io');

// let io;

// exports.createSocket = (server) => {
//     io = iosocket(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"]
//         }
//     });
//     io.on("connection", (socket) => {
//         console.log("New client connected");
    
//         socket.on("joinRoom", (roomId) => {
//             socket.join(roomId);
//         });
    
//         socket.on("disconnect", () => {
//             console.log("Client disconnected");
//         });

    
//            socket.on("sendMessage", (message) => {
//             // Ensure the room exists before emitting the message
//             console.log(message);
//             if (message && message.chat) {
//                 io.to(message.chat).emit("receiveMessage", message);
//             }
//         });
     
//     });
    
// }

// exports.emitMessageToRoom = (roomId, message) => {
//     io.to(roomId).emit("receiveMessage", message);
// }
  

const iosocket = require('socket.io');

let io;

exports.createSocket = (server) => {
  io = iosocket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", (message) => {
      if (message && message.chat) {
        io.to(message.chat).emit("receiveMessage", { message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

