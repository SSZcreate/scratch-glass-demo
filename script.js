/****************************************************
 * 1) メインCanvas(#canvas) で曇りガラスを削る処理
 ****************************************************/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 画面サイズに合わせる
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// fog.jpg の透明度
const FOG_ALPHA = 0.9;

// fog画像を読み込み＆描画
const fogImage = new Image();
fogImage.src = 'fog.jpg';
fogImage.onload = () => {
  ctx.globalAlpha = FOG_ALPHA;
  ctx.drawImage(fogImage, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;
};

let isDrawing = false;
function getMousePos(e) {
  return {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  };
}

// マウス操作
canvas.addEventListener('mousedown', () => {
  isDrawing = true;
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  ctx.globalCompositeOperation = 'destination-out';

  const pos = getMousePos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  ctx.globalCompositeOperation = 'source-over';
});

// タッチ操作 (スマホ・タブレット)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isDrawing = true;
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  ctx.globalCompositeOperation = 'destination-out';

  const touch = e.touches[0];
  const pos = {
    x: touch.clientX - canvas.offsetLeft,
    y: touch.clientY - canvas.offsetTop
  };
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('touchend', () => {
  isDrawing = false;
  ctx.globalCompositeOperation = 'source-over';
});


/****************************************************
 * 2) 水滴アニメーションCanvas(#droplets)
 ****************************************************/
const dropletsCanvas = document.getElementById('droplets');
const dctx = dropletsCanvas.getContext('2d');

// 画面サイズに合わせる
function resizeDropletsCanvas() {
  dropletsCanvas.width = window.innerWidth;
  dropletsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeDropletsCanvas);
resizeDropletsCanvas();

// 水滴を表すクラス
class Droplet {
  constructor() {
    this.init();
  }
  init() {
    // 画面上部またはランダム位置に生成してもOK
    // ここでは yをマイナスにして上から落とす例にします
    this.x = Math.random() * dropletsCanvas.width;
    this.y = -Math.random() * 200; // -200〜0あたりから落ちてくる
    this.radius = 2 + Math.random() * 3; // 水滴の大きさ
    this.speed = 1 + Math.random() * 2;  // 落ちる速度
  }
  update() {
    this.y += this.speed;
    // 画面外(下)に出たらリセット(再び上から落ちてくる)
    if (this.y - this.radius > dropletsCanvas.height) {
      this.init();
    }
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = 'rgba(255,255,255,0.7)'; 
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}

// 水滴の配列を用意
const droplets = [];
const NUM_DROPS = 30; // 水滴の数（増やすと賑やかになる）
for (let i = 0; i < NUM_DROPS; i++) {
  droplets.push(new Droplet());
}

// アニメーションループ
function animateDroplets() {
  // 前フレームの描画を消す
  dctx.clearRect(0, 0, dropletsCanvas.width, dropletsCanvas.height);

  // 各水滴を更新＆描画
  for (let i = 0; i < droplets.length; i++) {
    droplets[i].update();
    droplets[i].draw(dctx);
  }

  requestAnimationFrame(animateDroplets);
}
animateDroplets();
