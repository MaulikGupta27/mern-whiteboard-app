const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let history = [];
let redoStack = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("init", { history, redoStack });

  socket.on("drawStroke", (stroke) => {
    history.push(stroke);
    redoStack = [];
    io.emit("init", { history, redoStack });
  });

  socket.on("undo", () => {
    if (history.length === 0) return;
    const last = history.pop();
    redoStack.push(last);
    io.emit("init", { history, redoStack });
  });

  socket.on("redo", () => {
    if (redoStack.length === 0) return;
    const restored = redoStack.pop();
    history.push(restored);
    io.emit("init", { history, redoStack });
  });

  socket.on("clear", () => {
    history = [];
    redoStack = [];
    io.emit("init", { history, redoStack });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
