<script setup>
import { ref, inject, onMounted } from "vue";
const socket = inject("socket");
const canvasRef = ref(null);

function draw(state) {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  //background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //center line
  ctx.strokeStyle = "white";
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  //paddles
  ctx.fillStyle = "white";
  ctx.fillRect(20, state.paddles.left.y, 10, 100);
  ctx.fillRect(canvas.width - 30, state.paddles.right.y, 10, 100);
}

onMounted(() => {
  if (!socket) return;

  window.addEventListener("keydown", handleKey);

  socket.on("game_state", (state) => {
    draw(state);
  });
});

function handleKey(e) {
  if (e.key === "ArrowUp") {
    socket.emit("player_input", { direction: -1 });
  }
  if (e.key === "ArrowDown") {
    socket.emit("player_input", { direction: 1 });
  }
}
</script>

<template>
  <h1>Pong Clone</h1>
  <canvas
    ref="canvasRef"
    width="800"
    height="400"
    style="background: black"
  ></canvas>
</template>

<style scoped></style>
