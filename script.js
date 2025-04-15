<script>
const symbols = ["🍒", "🔔", "🍋", "⭐", "💎"];
let balance = 100;

function updateCasinoTheme() {
  const casino = document.getElementById('casino').value;
  const clown = document.getElementById('clown-face');
  let img = '';
  switch (casino) {
    case 'joker': img = 'joker.png'; break;
    case 'lucky': img = 'lucky.png'; break;
    case 'gold': img = 'gold.png'; break;
    case 'retro': img = 'retro.png'; break;
  }
  clown.style.backgroundImage = `url('${img}')`;
}

function playSlot() {
  const bet = parseInt(document.getElementById('bet').value);
  const spinButton = document.querySelector('button');
  if (bet > balance || bet <= 0) {
    alert("Nie masz wystarczająco żetonów lub nieprawidłowa stawka.");
    return;
  }

  spinButton.disabled = true;
  document.getElementById("spin-sound").play();

  const slotElements = document.querySelectorAll('#slots .slot');
  const result = [];

  slotElements.forEach(el => {
    el.classList.add('spinning');
  });

  setTimeout(() => {
    slotElements.forEach(el => el.classList.remove('spinning'));
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

    updateClownFace(balance);
    if (fireworks) startFireworks();

    // Odblokuj przycisk po 2 sekundach
    setTimeout(() => {
      spinButton.disabled = false;
    }, 2000);

  }, 1000);
}

function showFullScreenWin(text, winClass) {
  const div = document.createElement("div");
  div.className = winClass;
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function updateClownFace(balance) {
  const clown = document.getElementById('clown-face');
  if (balance < 30) {
    clown.classList.add('laugh');
    clown.classList.remove('surprised');
  } else if (balance > 150) {
    clown.classList.add('surprised');
    clown.classList.remove('laugh');
  } else {
    clown.classList.remove('laugh', 'surprised');
  }
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

updateCasinoTheme(); // uruchom od razu, by załadować obrazek
</script>
