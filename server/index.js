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

const state = {
  paddles: {
    left: { y: 150 },
    right: { y: 150 },
  },
};

const PADDLE_SPEED = 8;
const PADDLE_HEIGHT = 100;
const CANVAS_HEIGHT = 400;

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.emit("game_state", state);

  socket.on("player_input", ({ direction }) => {
    state.paddles.left.y += direction * PADDLE_SPEED;

    state.paddles.left.y = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.paddles.left.y)
    );

    io.emit("game_state", state);
  });
});
