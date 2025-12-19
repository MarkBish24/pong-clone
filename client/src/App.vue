<script setup>
import { ref, inject, onMounted } from "vue";
const socket = inject("socket");
const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  socket.on("game_state", (state) => {
    const ctx = canvasRef.value.getContext("2d");
    ctx.clearRect(0, 0, 800, 400);

    ctx.fillStyle = "white";
    ctx.fillRect(20, state.paddles.left.y, 10, 100);
    ctx.fillRect(770, state.paddles.right.y, 10, 100);
  });
});
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
