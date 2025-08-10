const spinBtn = document.getElementById('spin-btn');
const loader = document.getElementById('loader');
const main = document.querySelector('main');
const overlay = document.getElementById('overlay');
const startPopup = document.querySelector('[data-start-popup]');
const activateBtn = document.getElementById('activate-btn');
const installBtn = document.getElementById('install-btn');
const loaderLogo = document.getElementById('loader-logo');
const loaderProgress = document.getElementById('loader-progress');
const bar = document.getElementById('loader-bar');
const coconut = document.getElementById('loader-coconut');
const reels = document.querySelectorAll('.reel');
const counterEl = document.getElementById('counter');

const prebuiltSymbols = {};

const spinQueue = [
  [
    ['slot51.png', 'slot11.png', '5259a129-bfa2-40d5-945f-f4b57772ebdf1.png'],
    [
      '6a6ac619-4362-4a83-8f0a-ead4c7bb17d11.png',
      'a9e0dac9-564d-4c7a-ada3-e4480f9ca5051.png',
      'slot41.png',
    ],
    [
      'slot41.png',
      '425682eb-0f72-4976-8eb5-494d2b2d9a321.png',
      '791b8ed4-cc65-40c6-969c-0dc3f803bbfb1.png',
    ],
  ],
  [
    [
      'c6c20bba-677a-4b70-99e7-376f35fd4d311.png',
      '791b8ed4-cc65-40c6-969c-0dc3f803bbfb1.png',
      'slot51.png',
    ],
    ['slot61.png', '791b8ed4-cc65-40c6-969c-0dc3f803bbfb1.png', 'slot11.png'],
    [
      '6bb95a70-78ae-4a62-b470-dfbd2642e7111.png',
      'a9e0dac9-564d-4c7a-ada3-e4480f9ca5051.png',
      '60f98bb9-fe05-4812-ba6a-f742768f63881.png',
    ],
  ],
  [
    ['slot31.png', 'slot21.png', '6bb95a70-78ae-4a62-b470-dfbd2642e7111.png'],
    ['slot41.png', 'slot21.png', '791b8ed4-cc65-40c6-969c-0dc3f803bbfb1.png'],
    [
      '6a6ac619-4362-4a83-8f0a-ead4c7bb17d11.png',
      '928faf1b-c486-4b23-ac06-1dbd15e838401.png',
      '425682eb-0f72-4976-8eb5-494d2b2d9a321.png',
    ],
  ],
  [
    [
      '928faf1b-c486-4b23-ac06-1dbd15e838401.png',
      '5f100096-c2aa-450c-9646-066714d0fcde1.png',
      'a9e0dac9-564d-4c7a-ada3-e4480f9ca5051.png',
    ],
    [
      '6bb95a70-78ae-4a62-b470-dfbd2642e7111.png',
      '5f100096-c2aa-450c-9646-066714d0fcde1.png',
      'slot21.png',
    ],
    [
      '60f98bb9-fe05-4812-ba6a-f742768f63881.png',
      '5f100096-c2aa-450c-9646-066714d0fcde1.png',
      '5259a129-bfa2-40d5-945f-f4b57772ebdf1.png',
    ],
  ],
];

const symbol = [...new Set(spinQueue.flat(2))];
const luckySymbol = '5f100096-c2aa-450c-9646-066714d0fcde1.png';

function stopReel(reelIndex) {
  const currentCombo = spinQueue[0];

  const boxes = reels[reelIndex].querySelectorAll('.box');
  boxes.forEach((box, rowIndex) => {
    const symbol = currentCombo[reelIndex][rowIndex];
    box.dataset.symbol = symbol;
    box.style.backgroundImage = `url('assets/${symbol}')`;
  });

  if (reelIndex === reels.length - 1) {
    spinQueue.shift();

    if (spinQueue.length === 0) {
      highlightLuckySymbols();
    }
  }
}

let spinsLeft = 3;
let spinning = false;

spinBtn.addEventListener('click', spin);

function getBackgroundImageUrl(elem) {
  if (!elem) return null;
  const style = getComputedStyle(elem);
  const match = style.backgroundImage.match(/url\(['"]?(.+?)['"]?\)/);
  return match ? match[1] : null;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      resolve();
    };
    img.src = src;
  });
}

const moveCoconut = percent => {
  if (!bar || !coconut) return;
  const barWidth = bar.offsetWidth;
  const coconutWidth = coconut.offsetWidth;
  const maxLeft = barWidth - coconutWidth;
  const newLeft = (percent / 100) * maxLeft + 70;
  coconut.style.left = `${newLeft}px`;
};

async function preloadAllImages() {
  const cssBackgrounds = [
    getBackgroundImageUrl(loader),
    getBackgroundImageUrl(loaderLogo),
    getBackgroundImageUrl(loaderProgress),
  ].filter(Boolean);

  const htmlImages = [bar.src, coconut.src].filter(
    src => (src && src.startsWith('http')) || src.startsWith('./')
  );

  const allResources = [
    ...cssBackgrounds,
    ...htmlImages,
    './assets/79f74d1510eb07da2ce48e6f9a8960f9033afb1f.png',
    './assets/button1.png',
    './assets/buttondis1.png',
    './assets/dis1.png',
    './assets/done1.png',
    './assets/fisher21.png',
    './assets/slots22.png',
    './assets/table21.png',
    './assets/table41.png',
    './assets/table5.png',
    './assets/d-1774049281-game-logo-900x9001.png',
    ...symbol.map(s => `./assets/symbols/${s}`),
  ].filter(Boolean);

  let loadedCount = 0;
  const totalCount = allResources.length;

  const loadingPromises = allResources.map(src =>
    loadImage(src).then(() => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalCount) * 100);
      moveCoconut(percent);
    })
  );

  await Promise.all(loadingPromises);

  symbol.forEach(sym => {
    const box = createBox(sym);
    prebuiltSymbols[sym] = box;
  });
}

function initStart() {
  const initialSymbols = spinQueue[0];

  reels.forEach((reel, index) => {
    const boxes = reel.querySelector('.boxes');
    boxes.innerHTML = '';

    initialSymbols[index].forEach(sym => {
      const box = createBox(sym);
      box.dataset.symbol = sym;
      boxes.appendChild(box);
    });

    boxes.style.transition = 'none';
    boxes.style.transform = 'translateY(0)';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loader.style.display = 'flex';
  main.style.display = 'none';
  document.getElementById('spin-btn').classList.add('blocked');

  preloadAllImages().then(() => {
    setTimeout(() => {
      loader.style.display = 'none';
      main.style.display = 'flex';
      setTimeout(() => {
        startPopup.setAttribute('data-open', 'true');
        overlay.setAttribute('data-visible', 'true');
      }, 1000);
      initStart();
      activateBtn.classList.add('animate');
    }, 1000);

    activateBtn.addEventListener('click', () => {
      startPopup.setAttribute('data-open', 'false');
      overlay.setAttribute('data-visible', 'false');
      spinBtn.classList.remove('blocked');
      activateBtn.classList.remove('animate');
    });
  });
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function spin() {
  if (spinning || spinsLeft <= 0) return;
  spinning = true;
  spinsLeft--;
  counterEl.textContent = spinsLeft;

  const isLastSpin = spinsLeft === 0;
  if (isLastSpin) {
    spinBtn.classList.add('disabled');
    spinBtn.style.cursor = 'not-allowed';
  }

  const delayBetweenReels = 300;
  const spinPromises = [];
  const spinIndex = 3 - (spinsLeft + 1);
  const currentSpinResults = spinQueue[spinIndex + 1];

  for (let i = 0; i < reels.length; i++) {
    const reel = reels[i];
    const boxes = reel.querySelector('.boxes');
    const boxHeight = Math.round(reel.clientHeight / 3);

    const final3 = currentSpinResults[i];

    const prefill = getRandomSymbols(5, isLastSpin ? [luckySymbol] : []);
    const spinSequence = final3.concat(prefill);
    boxes.style.transition = 'none';

    for (let j = spinSequence.length - 1; j >= 0; j--) {
      const sym = spinSequence[j];
      const box = createBox(sym);
      box.dataset.symbol = sym;
      boxes.insertBefore(box, boxes.firstChild);
    }
    boxes.offsetHeight;
    const newHeight = spinSequence.length * boxHeight;
    boxes.style.transform = `translateY(-${newHeight}px)`;

    const promise = new Promise(resolve => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          boxes.style.transition = 'transform 1500ms ease-in-out';
          boxes.style.transform = 'translateY(0)';
        });

        boxes.addEventListener(
          'transitionend',
          () => {
            const visible = Array.from(boxes.children)
              .slice(0, 3)
              .map(n => n.cloneNode(true));

            boxes.innerHTML = '';
            visible.forEach(n => boxes.appendChild(n));

            boxes.style.transition = 'none';
            boxes.style.transform = 'translateY(0)';

            resolve();
          },
          { once: true }
        );
      }, delayBetweenReels * i);
    });

    spinPromises.push(promise);
  }

  await Promise.all(spinPromises);

  if (isLastSpin) {
    highlightLuckySymbols();
    setTimeout(showFinalPopup, 3000);
  }

  spinning = false;
}

function createBox(sym) {
  if (prebuiltSymbols[sym]) {
    return prebuiltSymbols[sym].cloneNode(true);
  }

  const box = document.createElement('div');
  box.className = 'box';
  const img = document.createElement('img');
  img.src = `./assets/symbols/${sym}`;
  img.alt = sym;
  img.draggable = false;
  box.appendChild(img);
  box.dataset.symbol = sym;
  return box;
}

function highlightLuckySymbols() {
  reels.forEach(reel => {
    const boxes = reel.querySelectorAll('.box');
    boxes.forEach(box => {
      if (box.dataset.symbol === luckySymbol) {
        box.classList.add('lucky-glow-container');
      } else {
        box.classList.remove('lucky-glow-container');
      }
    });
  });
}

function getRandomSymbol(exclude = []) {
  const excl = Array.isArray(exclude) ? exclude : [exclude];
  const filtered = symbol.filter(s => !excl.includes(s));
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getRandomSymbols(count, exclude = []) {
  const excl = Array.isArray(exclude) ? exclude : [exclude];
  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(getRandomSymbol(excl));
  }
  return res;
}

function getNonWinningCombo() {
  const combo = [];
  while (combo.length < 3) {
    const s = getRandomSymbol(combo);
    combo.push(s);
  }
  return combo;
}

function showFinalPopup() {
  const finalPopup = document.querySelector('[data-final-popup]');
  const countdownEl = document.getElementById('countdown');

  finalPopup.setAttribute('data-open', 'true');
  overlay.setAttribute('data-visible', 'true');
  installBtn.classList.add('animate');
  spinBtn.classList.add('blocked');

  let timeLeft = 15 * 60;

  const timerId = setInterval(() => {
    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      finalPopup.setAttribute('data-open', 'false');
      overlay.setAttribute('data-visible', 'false');
      installBtn.classList.remove('animate');
    }
  }, 1000);
}
