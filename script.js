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
const musicToggle = document.querySelector('#musicToggle');
const bgMusic = document.querySelector('#bgMusic');
let photoIndex = 6;
let photoChanging = false;
let queuedPhotoDirection = 0;
let photoSwapTimer;
let photoReleaseTimer;

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

function changePhoto(direction = 1) {
  if (!document.body.classList.contains('is-unlocked')) return;
  if (photoChanging) {
    queuedPhotoDirection = direction;
    return;
  }
  photoChanging = true;
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
    if (queuedPhotoDirection !== 0) {
      const nextDirection = queuedPhotoDirection;
      queuedPhotoDirection = 0;
      changePhoto(nextDirection);
    }
  }, 850);
}

photoStage.querySelectorAll('.photo-control').forEach((control) => {
  control.addEventListener('click', () => {
    changePhoto(Number(control.dataset.direction));
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
});
photoStage.addEventListener('pointercancel', () => { swipeStart = null; });

function updateMusicButton(isPlaying) {
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Dừng nhạc' : 'Tiếp tục nhạc');
  musicToggle.querySelector('.button-icon').textContent = isPlaying ? 'Ⅱ' : '▶';
  musicToggle.querySelector('.button-label').textContent = isPlaying ? 'Dừng' : 'Tiếp tục';
}

async function playBackgroundMusic() {
  try {
    await bgMusic.play();
    updateMusicButton(true);
  } catch {
    updateMusicButton(false);
  }
}

musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    playBackgroundMusic();
    return;
  }
  bgMusic.pause();
  updateMusicButton(false);
});

const letterIntro = document.querySelector('#letterIntro');
const enterLetter = document.querySelector('#enterLetter');
enterLetter.addEventListener('click', () => {
  // Opening the envelope is a user gesture, allowing browsers to start the song.
  playBackgroundMusic();
  letterIntro.classList.add('is-closing');
  window.setTimeout(() => {
    letterIntro.hidden = true;
    document.body.classList.add('is-unlocked');
    photoStage.classList.add('is-open');
  }, 430);
});
