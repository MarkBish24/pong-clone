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
  ball: {
    x: 400,
    y: 200,
    // Velocity
    vx: 4,
    vy: 4,
  },
  score: {
    left: 0,
    right: 0,
  },
};

const PADDLE_SPEED = 8;
const PADDLE_HEIGHT = 100;
const CANVAS_HEIGHT = 400;
const BALL_RADIUS = 8;

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

const TICK_RATE = 1000 / 60;

setInterval(() => {
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  if (state.ball.y <= 0 || state.ball.y >= 400 - BALL_RADIUS * 2) {
    state.ball.vy *= -1;
  }

  // Check collision with left paddle
  if (
    state.ball.x <= 30 &&
    state.ball.y + BALL_RADIUS * 2 >= state.paddles.left.y &&
    state.ball.y <= state.paddles.left.y + 100
  ) {
    state.ball.vx *= -1;
  }

  // Check collision with right paddle
  if (
    state.ball.x + BALL_RADIUS * 2 >= 770 &&
    state.ball.y + BALL_RADIUS * 2 >= state.paddles.right.y &&
    state.ball.y <= state.paddles.right.y + 100
  ) {
    state.ball.vx *= -1;
  }

  if (state.ball.x < 0) {
    state.score.right += 1;
    console.log(state.score);
    resetBall();
  }
  if (state.ball.x > 800) {
    state.score.left += 1;
    console.log(state.score);
    resetBall();
  }

  // Broadcast updated state
  io.emit("game_state", state);
}, TICK_RATE);

function resetBall() {
  state.ball.x = 400;
  state.ball.y = 200;
  state.ball.vx = Math.random() < 0.5 ? 4 : -4;
  state.ball.vy = Math.random() < 0.5 ? 4 : -4;
}
