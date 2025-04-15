const symbols = ["🍒", "🔔", "🍋", "⭐", "💎"];
let balance = 100;

function playSlot() {
  const bet = parseInt(document.getElementById('bet').value);
  if (bet > balance || bet <= 0) {
    alert("Nie masz wystarczająco żetonów lub nieprawidłowa stawka.");
    return;
  }

  document.getElementById("spin-sound").play();

  const slotElements = document.querySelectorAll('#slots div');
  const result = [];
  for (let i = 0; i < 5; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    slotElements[i].textContent = symbol;
    result.push(symbol);
  }

  const counts = {};
  result.forEach(sym => counts[sym] = (counts[sym] || 0) + 1);

  let output = 'Spróbuj jeszcze raz...';
  let reward = 0;
  let fireworks = false;
  let winClass = "";

  for (let key in counts) {
    if (counts[key] === 3) {
      reward = bet * 2;
      output = '🎉 BIG WIN! 🎉';
      winClass = "big-win";
    } else if (counts[key] === 4) {
      reward = bet * 5;
      output = '💥 MEGA WIN!!! 💥';
      winClass = "mega-win";
      fireworks = true;
    } else if (counts[key] === 5) {
      reward = bet * 10;
      output = '🔥🔥 ULTRA WIN!!!! 🔥🔥';
      winClass = "ultra-win";
      fireworks = true;
    }
  }

  if (reward === 0) {
    balance -= bet;
    document.getElementById("lose-sound").play();
  } else {
    balance += reward;
    document.getElementById("win-sound").play();
    showFullScreenWin(output, winClass);
  }

  document.getElementById('balance').textContent = balance;
  document.getElementById('result').textContent = output;

  if (fireworks) startFireworks();
}

function showFullScreenWin(text, winClass) {
  const div = document.createElement("div");
  div.className = winClass;
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startFireworks() {
  let particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: Math.random() * 12 - 6,
      dy: Math.random() * 12 - 6,
      life: 30
    });
  }
  let interval = setInterval(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length === 0) {
      clearInterval(interval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, 20);
}
