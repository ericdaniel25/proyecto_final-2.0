//require dotenv to use variables
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const path = require("path");
const { dbConnect } = require("./config/mongo");
const paymentRouter = require("./routes/payment");
const { Server: SocketServer } = require("socket.io");
const server = http.createServer(app);

const io = new SocketServer(server);

//Middleware para validar el nombre de usuario
io.use((socket, next) => {
  const userName = socket.handshake.auth.userName;
  if (!userName) {
    return next(new Error("invalid username"));
  }
  socket.username = userName; // Asegúrate de usar `socket.username`
  console.log(socket.username);
  next();
});


//Enviando de usuarios conectados al cliente
io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username, // Asegúrate de usar `socket.username`
    });
  }
  socket.emit("users", users);
});

//Enviando usuarios conectados
io.on("connection", (socket) => {
  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });
});

//Enviando mensajes
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
});


dbConnect();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(paymentRouter)
app.use(express.static(path.resolve("/frontend/src/pages/ProfilePage.jsx")));
//app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/", require("./routes"));
server.listen(PORT, () => {
  console.log("api is ready");
  console.log(`Server running on port ${PORT}`);
});
