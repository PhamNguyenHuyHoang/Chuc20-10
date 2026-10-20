const sakura = document.querySelector('#sakura');
const petalPalette = ['#ee8dc0', '#f2a6d0', '#e979b4', '#ffd3e9', '#f5b7d9'];
for (let i = 0; i < 54; i += 1) {
  const petal = document.createElement('span');
  petal.className = 'sakura-petal';
  petal.style.setProperty('--left', `${Math.random() * 100}%`);
  petal.style.setProperty('--size', `${5 + Math.random() * 8}px`);
  petal.style.setProperty('--duration', `${10 + Math.random() * 13}s`);
  petal.style.setProperty('--delay', `${-Math.random() * 22}s`);
  petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 20}vw`);
  petal.style.setProperty('--opacity', `${0.38 + Math.random() * 0.43}`);
  petal.style.setProperty('--petal', petalPalette[Math.floor(Math.random() * petalPalette.length)]);
  sakura.appendChild(petal);
}

const sakuraBursts = document.querySelector('#sakuraBursts');
function burstSakura(x, y) {
  for (let i = 0; i < 28; i += 1) {
    const petal = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.35;
    const distance = 45 + Math.random() * 110;
    petal.className = 'burst-petal';
    petal.style.setProperty('--x', `${x}px`);
    petal.style.setProperty('--y', `${y}px`);
    petal.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    petal.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    petal.style.setProperty('--spin', `${Math.random() * 520 - 260}deg`);
    petal.style.setProperty('--size', `${7 + Math.random() * 9}px`);
    petal.style.setProperty('--petal', petalPalette[Math.floor(Math.random() * petalPalette.length)]);
    sakuraBursts.appendChild(petal);
    window.setTimeout(() => petal.remove(), 1200);
  }
}

// A tap/click releases a visible blossom burst on both touchscreens and computers.
window.addEventListener('pointerdown', (event) => burstSakura(event.clientX, event.clientY), { passive: true });

// Scatter a small cluster along mouse/pen movement for a continuous trail.
let lastPointerPetals = 0;
window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') return;
  const now = performance.now();
  if (now - lastPointerPetals < 42) return;
  lastPointerPetals = now;
  for (let i = 0; i < 3; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'cursor-petal';
    petal.style.setProperty('--x', `${event.clientX + (Math.random() - 0.5) * 24}px`);
    petal.style.setProperty('--y', `${event.clientY + (Math.random() - 0.5) * 20}px`);
    petal.style.setProperty('--size', `${6 + Math.random() * 8}px`);
    petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
    petal.style.setProperty('--petal', petalPalette[Math.floor(Math.random() * petalPalette.length)]);
    sakuraBursts.appendChild(petal);
    window.setTimeout(() => petal.remove(), 1900);
  }
}, { passive: true });

const photos = [
  ['moment-01.webp', 'Ngày mình đi trốn'], ['moment-02.webp', 'Một buổi tối thật vui'],
  ['moment-03.webp', 'Ngày thật đáng nhớ'], ['moment-04.webp', 'Nụ cười anh thích nhất'],
  ['moment-05.webp', 'Bình yên của anh'], ['moment-07.webp', 'Một ngày bên nhau'],
  ['moment-09.webp', 'Gương mặt anh thương'], ['moment-10.webp', 'Cô gái ngầu nhất'],
  ['moment-12.webp', 'Hai em bé đáng yêu'], ['moment-13.webp', 'Cái ôm ấm áp'],
  ['moment-14.webp', 'Nàng thơ của anh'], ['moment-15.webp', 'Em lúc nào cũng xinh'],
];

const photoStage = document.querySelector('#photoStage');
const featurePhoto = document.querySelector('#featurePhoto');
const photoCount = document.querySelector('#photoCount');
const autoplayToggle = document.querySelector('#autoplayToggle');
const autoplayIcon = autoplayToggle.querySelector('.button-icon');
const autoplayLabel = autoplayToggle.querySelector('.button-label');
const musicToggle = document.querySelector('#musicToggle');
const musicPanel = document.querySelector('#musicPanel');
const zingPlayer = document.querySelector('#zingPlayer');
const closeMusic = document.querySelector('#closeMusic');
let photoIndex = 6;
let photoChanging = false;
let queuedPhotoDirection = 0;
let photoChangeAutomatic = false;
let photoSwapTimer;
let photoReleaseTimer;
let photoTimer;
let autoplayEnabled = true;

function updatePhotoCounter() {
  photoCount.value = `${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  photoCount.textContent = photoCount.value;
}

function preloadNearbyPhotos() {
  [-1, 1].forEach((direction) => {
    const neighborIndex = (photoIndex + direction + photos.length) % photos.length;
    const image = new Image();
    image.src = `assets/photos/${photos[neighborIndex][0]}`;
  });
}

function changePhoto(direction = 1, automatic = false) {
  if (!document.body.classList.contains('is-unlocked')) return;
  if (photoChanging) {
    if (automatic) return;
    if (photoChangeAutomatic) {
      window.clearTimeout(photoSwapTimer);
      window.clearTimeout(photoReleaseTimer);
      photoStage.classList.remove('is-changing', 'is-changing-prev', 'is-changing-next');
      photoChanging = false;
      queuedPhotoDirection = 0;
    } else {
      queuedPhotoDirection = direction;
      return;
    }
  }
  photoChanging = true;
  photoChangeAutomatic = automatic;
  const currentFile = featurePhoto.getAttribute('src').split('/').pop();
  const currentIndex = photos.findIndex(([file]) => file === currentFile);
  if (currentIndex !== -1) photoIndex = currentIndex;
  const directionClass = direction < 0 ? 'is-changing-prev' : 'is-changing-next';
  photoStage.classList.add('is-changing', directionClass);
  photoSwapTimer = window.setTimeout(() => {
    photoIndex = (photoIndex + direction + photos.length) % photos.length;
    const [file, caption] = photos[photoIndex];
    featurePhoto.src = `assets/photos/${file}`;
    featurePhoto.alt = caption;
    updatePhotoCounter();
    preloadNearbyPhotos();
  }, 390);
  // Always release the transition lock, even when reduced-motion disables CSS animations.
  photoReleaseTimer = window.setTimeout(() => {
    photoStage.classList.remove('is-changing', 'is-changing-prev', 'is-changing-next');
    photoChanging = false;
    photoChangeAutomatic = false;
    if (queuedPhotoDirection !== 0) {
      const nextDirection = queuedPhotoDirection;
      queuedPhotoDirection = 0;
      changePhoto(nextDirection);
    }
  }, 850);
}

function restartPhotoTimer() {
  window.clearInterval(photoTimer);
  photoTimer = window.setInterval(() => {
    if (autoplayEnabled) changePhoto(1, true);
  }, 2000);
}

autoplayToggle.addEventListener('click', () => {
  autoplayEnabled = !autoplayEnabled;
  autoplayToggle.setAttribute('aria-pressed', String(autoplayEnabled));
  autoplayToggle.setAttribute('aria-label', autoplayEnabled ? 'Tạm dừng ảnh tự chuyển' : 'Tiếp tục ảnh tự chuyển');
  autoplayIcon.textContent = autoplayEnabled ? 'Ⅱ' : '▶';
  autoplayLabel.textContent = autoplayEnabled ? 'Tự chạy' : 'Đã dừng';
  if (autoplayEnabled) restartPhotoTimer();
});

photoStage.querySelectorAll('.photo-control').forEach((control) => {
  control.addEventListener('click', () => {
    changePhoto(Number(control.dataset.direction));
    restartPhotoTimer();
  });
});

let swipeStart = null;
photoStage.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
});
photoStage.addEventListener('pointerup', (event) => {
  if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;
  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  changePhoto(deltaX < 0 ? 1 : -1);
  restartPhotoTimer();
});
photoStage.addEventListener('pointercancel', () => { swipeStart = null; });

function setMusicPanelOpen(open) {
  musicPanel.hidden = !open;
  musicToggle.setAttribute('aria-expanded', String(open));
  musicToggle.setAttribute('aria-pressed', String(open));
  musicToggle.setAttribute('aria-label', open ? 'Đóng trình phát Zing MP3' : 'Mở trình phát Zing MP3');
  if (open) {
    zingPlayer.src = zingPlayer.dataset.src;
  } else {
    // Removing the iframe source also stops playback when the panel is dismissed.
    zingPlayer.removeAttribute('src');
  }
}

musicToggle.addEventListener('click', () => setMusicPanelOpen(musicPanel.hidden));
closeMusic.addEventListener('click', () => setMusicPanelOpen(false));

const letterIntro = document.querySelector('#letterIntro');
const enterLetter = document.querySelector('#enterLetter');
enterLetter.addEventListener('click', () => {
  letterIntro.classList.add('is-closing');
  window.setTimeout(() => {
    letterIntro.hidden = true;
    document.body.classList.add('is-unlocked');
    photoStage.classList.add('is-open');
    restartPhotoTimer();
  }, 430);
});
