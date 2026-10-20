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
  ['moment-01.jpg', 'Ngày mình đi trốn'], ['moment-02.jpg', 'Một buổi tối thật vui'],
  ['moment-03.jpg', 'Ngày thật đáng nhớ'], ['moment-04.jpg', 'Nụ cười anh thích nhất'],
  ['moment-05.jpg', 'Bình yên của anh'], ['moment-07.jpg', 'Một ngày bên nhau'],
  ['moment-09.jpg', 'Gương mặt anh thương'], ['moment-10.jpg', 'Cô gái ngầu nhất'],
  ['moment-12.jpg', 'Hai em bé đáng yêu'], ['moment-13.jpg', 'Cái ôm ấm áp'],
  ['moment-14.jpg', 'Nàng thơ của anh'], ['moment-15.jpg', 'Em lúc nào cũng xinh'],
];

const photoStage = document.querySelector('#photoStage');
const featurePhoto = document.querySelector('#featurePhoto');
let photoIndex = 6;
let photoChanging = false;
let queuedPhotoDirection = 0;
let photoChangeAutomatic = false;
let photoSwapTimer;
let photoReleaseTimer;
let photoTimer;

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
  photoTimer = window.setInterval(() => changePhoto(1, true), 2000);
}

photoStage.querySelectorAll('.photo-control').forEach((control) => {
  control.addEventListener('click', () => {
    changePhoto(Number(control.dataset.direction));
    restartPhotoTimer();
  });
});

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
