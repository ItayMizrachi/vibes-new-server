const express = require("express");
const http = require("http");
const path = require("path");
const { routesInit } = require("./routes/configRoutes");
const cors = require("cors");
const socketIo = require("socket.io");
const { createSocket } = require("./sockets/appSocket");

require("./db/mongoConnect");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5 mb" }));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

// Now that io is initialized, you can pass it to routesInit
routesInit(app);

let port = process.env.PORT || 3009;
server.listen(port);
console.log("server listening on port " + port);
createSocket(server);
