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

function changePhoto() {
  if (!document.body.classList.contains('is-unlocked') || photoChanging) return;
  photoChanging = true;
  photoStage.classList.add('is-changing');
  window.setTimeout(() => {
    photoIndex = (photoIndex + 1) % photos.length;
    const [file, caption] = photos[photoIndex];
    featurePhoto.src = `assets/photos/${file}`;
    featurePhoto.alt = caption;
  }, 390);
  // Always release the transition lock, even when reduced-motion disables CSS animations.
  window.setTimeout(() => {
    photoStage.classList.remove('is-changing');
    photoChanging = false;
  }, 850);
}

photoStage.addEventListener('click', changePhoto);
photoStage.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    changePhoto();
  }
});

window.setInterval(changePhoto, 2000);

const letterIntro = document.querySelector('#letterIntro');
const enterLetter = document.querySelector('#enterLetter');
enterLetter.addEventListener('click', () => {
  letterIntro.classList.add('is-closing');
  window.setTimeout(() => {
    letterIntro.hidden = true;
    document.body.classList.add('is-unlocked');
    photoStage.classList.add('is-open');
  }, 430);
});
