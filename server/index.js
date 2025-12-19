import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.emit("game_state", {
    paddles: {
      left: { y: 150 },
      right: { y: 150 },
    },
  });
});
