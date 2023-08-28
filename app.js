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
app.use(cors({
    origin: 'https://vibe-on-vibes.onrender.com/',
    optionsSuccessStatus: 200
  }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://vibe-on-vibes.onrender.com/');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
    next();
 });

app.use(express.json({ limit: "5 mb" }));
app.use(express.static(path.join(__dirname, "public")));
// app.use('/images', express.static(path.join(__dirname, './dalle')));

const server = http.createServer(app);

// Now that io is initialized, you can pass it to routesInit
routesInit(app);

let port = process.env.PORT || 3008;
server.listen(port);
console.log("server listening on port " + port);
createSocket(server);

// const express = require("express");
// const http = require("http");
// const path = require("path");
// const { routesInit } = require("./routes/configRoutes");
// const cors = require("cors");
// const socketIo = require("socket.io");
// const { createSocket } = require("./sockets/appSocket");

// require("./db/mongoConnect");

// const app = express();

// // Define the origins you want to allow
// const corsOptions = {
//     origin: ['https://vibe-on-vibes.onrender.com','https://vibe-on-vibes.netlify.app/', 'http://localhost:5173'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-api-key'],
//     optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

// app.use(express.json({ limit: "5 mb" }));
// app.use(express.static(path.join(__dirname, "public")));

// const server = http.createServer(app);

// // Initiate your routes
// routesInit(app);

// const port = process.env.PORT || 3008;
// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// createSocket(server);

// module.exports = app;  // In case you need to export your app for further usage
