const wheelCanvas = document.getElementById('wheelCanvas');
const ctxWheel = wheelCanvas.getContext('2d');
const segments = [
  'Dexter', 'Nagroda', 'Walter', 'Jackpot',
  'Tony', 'Spin+', 'Nic', 'Joker'
];
const colors = ['#ff0000', '#ff9900', '#ffff00', '#00cc00', '#0099ff', '#6600cc', '#ff66cc', '#999999'];
let angle = 0;
const radius = wheelCanvas.width / 2;

function drawWheel() {
  const anglePerSegment = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    ctxWheel.beginPath();
    ctxWheel.fillStyle = colors[i];
    ctxWheel.moveTo(radius, radius);
    ctxWheel.arc(radius, radius, radius, i * anglePerSegment, (i + 1) * anglePerSegment);
    ctxWheel.fill();

    ctxWheel.save();
    ctxWheel.translate(radius, radius);
    ctxWheel.rotate(i * anglePerSegment + anglePerSegment / 2);
    ctxWheel.textAlign = "right";
    ctxWheel.fillStyle = "#000";
    ctxWheel.font = "16px Comic Sans MS";
    ctxWheel.fillText(segments[i], radius - 10, 5);
    ctxWheel.restore();
  }
}

function spinWheel() {
  const spins = Math.floor(Math.random() * 5 + 5); // 5–10 obrotów
  const segmentAngle = (2 * Math.PI) / segments.length;
  const randomSegment = Math.floor(Math.random() * segments.length);
  const targetAngle = randomSegment * segmentAngle;

  const totalRotation = spins * 2 * Math.PI + targetAngle;
  const duration = 3000;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    angle = totalRotation * easeOutCubic(progress);
    drawRotatedWheel(angle);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const finalAngle = angle % (2 * Math.PI);
      const index = Math.floor((segments.length - finalAngle / segmentAngle)) % segments.length;
      document.getElementById('wheel-result').textContent = `Wylosowano: ${segments[index]}`;
    }
  }

  requestAnimationFrame(animate);
}

function drawRotatedWheel(rotAngle) {
  ctxWheel.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
  ctxWheel.save();
  ctxWheel.translate(radius, radius);
  ctxWheel.rotate(rotAngle);
  ctxWheel.translate(-radius, -radius);
  drawWheel();
  ctxWheel.restore();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

window.onload = drawWheel;