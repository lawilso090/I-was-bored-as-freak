// Section switching
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Simple game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let player = { x: 180, y: 350, w: 40, h: 40, color: "#22c55e" }; // green player
let obstacles = [];
let keys = {};
let gameOver = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// --- Touch controls ---
function pressKey(k) { keys[k] = true; }
function releaseKey(k) { keys[k] = false; }

document.getElementById("leftBtn").addEventListener("touchstart", e => { e.preventDefault(); pressKey("ArrowLeft"); });
document.getElementById("leftBtn").addEventListener("touchend", e => { e.preventDefault(); releaseKey("ArrowLeft"); });

document.getElementById("rightBtn").addEventListener("touchstart", e => { e.preventDefault(); pressKey("ArrowRight"); });
document.getElementById("rightBtn").addEventListener("touchend", e => { e.preventDefault(); releaseKey("ArrowRight"); });

document.getElementById("upBtn").addEventListener("touchstart", e => { e.preventDefault(); pressKey("ArrowUp"); });
document.getElementById("upBtn").addEventListener("touchend", e => { e.preventDefault(); releaseKey("ArrowUp"); });

document.getElementById("downBtn").addEventListener("touchstart", e => { e.preventDefault(); pressKey("ArrowDown"); });
document.getElementById("downBtn").addEventListener("touchend", e => { e.preventDefault(); releaseKey("ArrowDown"); });

// --- Touch drag option (finger follows player) ---
canvas.addEventListener("touchmove", e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  player.x = x - player.w / 2;
  player.y = y - player.h / 2;
  e.preventDefault();
});

// --- Game logic ---
function update() {
  if (gameOver) return;

  // Move player with keys
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += 5;
  if (keys["ArrowUp"] && player.y > 0) player.y -= 5;
  if (keys["ArrowDown"] && player.y < canvas.height - player.h) player.y += 5;

  // Add obstacles
  if (Math.random() < 0.03) {
    obstacles.push({ x: Math.random() * 360, y: -20, w: 40, h: 20, color: "#ef4444" }); // red obstacles
  }

  // Move obstacles
  obstacles.forEach(o => o.y += 4);

  // Collision detection
  for (let o of obstacles) {
    if (player.x < o.x + o.w &&
        player.x + player.w > o.x &&
        player.y < o.y + o.h &&
        player.y + player.h > o.y) {
      gameOver = true;
      setTimeout(() => alert("Game Over!"), 10);
    }
  }

  // Clean up off-screen obstacles
  obstacles = obstacles.filter(o => o.y < canvas.height);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255,255,255,0.15)"; // faint white lines
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function draw() {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid overlay
  drawGrid();

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Obstacles
  obstacles.forEach(o => {
    ctx.fillStyle = o.color;
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
