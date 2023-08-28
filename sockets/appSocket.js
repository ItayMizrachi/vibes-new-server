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

