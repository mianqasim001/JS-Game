const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const groundY = 400;
let scrollSpeed = 3; // Slower obstacle movement
let gameOver = false;

const player = {
  x: 100,
  y: 350,
  w: 40,
  h: 50,
  color: "#00ff88",
  speed: 4,
  velocityY: 0,
  gravity: 0.8,
  onGround: true,
  crouching: false,
  punching: false,
};

let obstacles = [
  { x: 600, y: 370, w: 30, h: 20, type: "jump" },
  { x: 900, y: 390, w: 5, h: 10, type: "jump" },
  { x: 1200, y: 350, w: 20, h: 15, type: "jump" },
  { x: 1500, y: 370, w: 50, h: 20, type: "slide" },
  { x: 1800, y: 390, w: 40, h: 10, type: "jump" },
];

const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

document.addEventListener("keydown", (e) => {
  if (gameOver && e.key.toLowerCase() === "r") {
    resetGame();
  }
});

function updatePlayer() {
  if (gameOver) return;

  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;

  if (keys["ArrowUp"] && player.onGround) {
    player.velocityY = -12;
    player.onGround = false;
  }

  player.y += player.velocityY;
  if (!player.onGround) player.velocityY += player.gravity;

  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.velocityY = 0;
    player.onGround = true;
  }

  player.crouching = keys["ArrowDown"];
  player.punching = keys[" "];
}

function updateObstacles() {
  if (gameOver) return;

  for (let obs of obstacles) {
    obs.x -= scrollSpeed;

    if (obs.x + obs.w < 0) {
      obs.x = canvas.width + Math.random() * 400;
      obs.type = Math.random() > 0.5 ? "jump" : "slide";
    }

    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  }
}

function checkCollision(p, o) {
  return (
    p.x < o.x + o.w &&
    p.x + p.w > o.x &&
    p.y < o.y + o.h &&
    p.y + p.h > o.y
  );
}

function drawGround() {
  ctx.fillStyle = "#004488";
  ctx.fillRect(0, groundY, canvas.width, 50);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  let height = player.crouching ? player.h / 2 : player.h;
  ctx.fillRect(player.x, player.y + (player.h - height), player.w, height);

  if (player.punching) {
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(player.x + player.w, player.y + 10, 15, 10);
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    ctx.fillStyle = obs.type === "slide" ? "#ff5555" : "#ffaa00";
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
  }
}

function showGameOverScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "28px Poppins";
  ctx.fillText("💥 You hit an obstacle!", 270, 200);

  ctx.font = "22px Poppins";
  ctx.fillText("Press 'R' to Retry", 330, 240);
}

function resetGame() {
  gameOver = false;
  player.x = 100;
  player.y = 350;
  obstacles.forEach((obs, i) => (obs.x = 600 + i * 300));
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();
  updatePlayer();
  updateObstacles();
  drawPlayer();
  drawObstacles();

  if (gameOver) {
    showGameOverScreen();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
