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
  clown.style.backgroundImage = url('${img}');
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
      ctx.fillStyle = hsl(${Math.random() * 360}, 100%, 70%);
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

  }
}
const wheelCanvas = document.getElementById('wheelCanvas');
const ctxWheel = wheelCanvas.getContext('2d');
const segments = [
  'Edycja Dexter Morgan',
  'Nagroda Specjalna',
  'Edycja Walter White',
  'Jackpot!',
  'Edycja Tony Montana',
  'Gratisowy Spin',
  'Nic nie wygrałeś',
  'Edycja Joker'
];
const colors = ['#ff0000', '#ff9900', '#ffff00', '#00cc00', '#0099ff', '#6600cc', '#ff66cc', '#999999'];

let angle = 0;
let spinning = false;

function drawWheel() {
  const radius = 200;
  const segmentAngle = (2 * Math.PI) / segments.length;

  for (let i = 0; i < segments.length; i++) {
    ctxWheel.beginPath();
    ctxWheel.fillStyle = colors[i];
    ctxWheel.moveTo(radius, radius);
    ctxWheel.arc(radius, radius, radius, i * segmentAngle, (i + 1) * segmentAngle);
    ctxWheel.fill();

    ctxWheel.save();
    ctxWheel.translate(radius, radius);
    ctxWheel.rotate(i * segmentAngle + segmentAngle / 2);
    ctxWheel.textAlign = "right";
    ctxWheel.fillStyle = "#000";
    ctxWheel.font = "16px Comic Sans MS";
    ctxWheel.fillText(segments[i], radius - 10, 10);
    ctxWheel.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const spinTime = 5000;
  const targetAngle = Math.random() * 2 * Math.PI + 10 * 2 * Math.PI; // kilka obrotów
  const start = performance.now();

  function animate(time) {
    const progress = (time - start) / spinTime;
    if (progress < 1) {
      angle = easeOut(progress) * targetAngle;
      drawRotatedWheel(angle);
      requestAnimationFrame(animate);
    } else {
      angle = targetAngle;
      drawRotatedWheel(angle);
      showWheelResult(angle);
      spinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function drawRotatedWheel(currentAngle) {
  ctxWheel.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  ctxWheel.save();
  ctxWheel.translate(200, 200);
  ctxWheel.rotate(currentAngle);
  ctxWheel.translate(-200, -200);
  drawWheel();
  ctxWheel.restore();
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function showWheelResult(finalAngle) {
  const segmentAngle = (2 * Math.PI) / segments.length;
  const index = Math.floor(((2 * Math.PI - (finalAngle % (2 * Math.PI))) % (2 * Math.PI)) / segmentAngle);
  const resultText = segments[index];
  document.getElementById('wheel-result').textContent = 🎯 Wylosowano: ${resultText};

  if (resultText.includes('Edycja')) {
    playWheelVideo(resultText);
  }
}

function playWheelVideo(label) {
  const video = document.getElementById('megaWinVideo');
  let videoMap = {
    'Edycja Dexter Morgan': 'dexteredit.mp4',
    'Edycja Walter White': 'walter.mp4',
    'Edycja Tony Montana': 'tony.mp4',
    'Edycja Joker': 'jokeredit.mp4'
  };
  const src = videoMap[label];
  if (src) {
    video.querySelector('source').src = src;
    video.load();
    video.style.display = 'block';
    video.muted = false;
    video.currentTime = 0;
    video.play();
    video.onended = () => {
      video.style.display = 'none';
    };
  }
}

drawWheel();


function showWinVideo(type) { const videoMap = { 'big-win': 'dexteredit.mp4', 'mega-win': 'Download (5).mp4', 'ultra-win': 'ssstik.io_1744655771300.mp4' }; const video = document.createElement('video'); video.src = videoMap[type]; video.autoplay = true; video.muted = false; video.className = 'win-video'; video.style.position = 'fixed'; video.style.top = '50%'; video.style.left = '50%'; video.style.transform = 'translate(-50%, -50%)'; video.style.zIndex = '9999'; video.style.maxWidth = '80%'; video.style.border = '5px solid yellow'; video.style.borderRadius = '20px'; video.style.boxShadow = '0 0 20px white'; document.body.appendChild(video); video.onended = () => { video.remove(); }; }
</script>
