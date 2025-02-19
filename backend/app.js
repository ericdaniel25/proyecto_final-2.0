//require dotenv to use variables
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const path = require("path");
const { dbConnect } = require("./config/mongo");
const { Server: SocketServer } = require("socket.io");
const server = http.createServer(app);
const io = new SocketServer(server);
const paymentRouter = require("./routes/payment");

io.on("connection", (socket) => {
  console.log(socket.id);
  
  socket.on("message", (body)=>{
    console.log(body);
    socket.broadcast.emit("message",{
      body,
      from: socket.id.slice(6)
    }
    );
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
