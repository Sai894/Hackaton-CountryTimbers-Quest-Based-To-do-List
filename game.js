// Redirect if not logged in
const activeUser = localStorage.getItem("activeUser");
if (typeof getUserData !== "function") {
  alert("Error: quests.js did not load properly!");
}

if (!activeUser) window.location.href = "login.html";

// === Canvas setup ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const dialogBox = document.getElementById('dialogBox');
const logoutBtn = document.getElementById('logoutBtn');
const shopBtn = document.getElementById('shopBtn');

logoutBtn.onclick = () => {
  localStorage.removeItem('activeUser');
  window.location.href = 'login.html';
};

let { activeUseruser } = getUserData();
updateHUD();

let player = { x: 100, y: 100, size: 20, speed: 4 };
let npc = { x: 400, y: 250, size: 30, color: '#e1b12c' };

let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function drawPlayer() {
  ctx.fillStyle = user.color || '#4cd137';
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawNPC() {
  ctx.fillStyle = npc.color;
  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
}

function isNearNPC() {
  return Math.abs(player.x - npc.x) < 40 && Math.abs(player.y - npc.y) < 40;
}

function showDialog(text) {
  dialogBox.innerText = text;
  dialogBox.style.display = 'block';
}

function hideDialog() {
  dialogBox.style.display = 'none';
}

function handleNPCInteraction() {
  const quest = getNextQuest();
  if (!quest) {
    showDialog("No quests available! Use console to add one.");
  } else {
    const confirmQuest = confirm(`Quest: "${quest.text}"\n\nMark as complete?`);
    if (confirmQuest) {
      completeQuest(quest.text);
      user = getUserData().user;
      updateHUD();
      showDialog(`You completed "${quest.text}"! +20 XP, +10 Coins`);
      setTimeout(hideDialog, 2000);
    }
  }
}

function update() {
  // Movement
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // Boundaries
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Interactions
  if (isNearNPC()) {
    showDialog("Press [SPACE] to talk to the Quest Giver!");
    if (keys[' ']) handleNPCInteraction();
  } else {
    hideDialog();
  }

  // Draw scene
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNPC();
  drawPlayer();

  requestAnimationFrame(update);
}

update();
