const spinBtn = document.getElementById('spin-btn');

window.onload = function () {
  const loader = document.getElementById('loader');
  const loaderLogo = document.getElementById('loader-logo');
  const loaderProgress = document.getElementById('loader-progress');
  const bar = document.getElementById('loader-bar');
  const coconut = document.getElementById('loader-coconut');
  const overlay = document.getElementById('overlay');
  const startPopup = document.querySelector('[data-start-popup]');
  const activateBtn = document.getElementById('activate-btn');
  const main = document.querySelector('main');

  function getBackgroundImageUrl(elem) {
    const style = getComputedStyle(elem);
    const match = style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
    return match ? match[1] : null;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) return resolve();
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`${src}`));
      img.src = src;
    });
  }

  async function preloadImagesWithProgress(srcList, onProgress) {
    let loaded = 0;
    const total = srcList.length;

    await Promise.all(
      srcList.map(src =>
        loadImage(src)
          .then(() => {
            loaded++;
            onProgress?.(Math.round((loaded / total) * 100));
          })
          .catch(() => {})
      )
    );
  }

  const moveCoconut = percent => {
    if (!bar || !coconut) return;
    const barWidth = bar.offsetWidth;
    const coconutWidth = coconut.offsetWidth;
    const maxLeft = barWidth - coconutWidth;
    const newLeft = (percent / 100) * maxLeft;
    coconut.style.left = `${newLeft}px`;
  };

  async function startPreloading() {
    spinBtn.classList.add('blocked');
    main.style.display = 'none';
    overlay.setAttribute('data-visible', 'false');
    startPopup.setAttribute('data-open', 'false');

    const bgLoader = getBackgroundImageUrl(loader);
    const bgLogo = getBackgroundImageUrl(loaderLogo);
    const bgProgress = getBackgroundImageUrl(loaderProgress);

    const loaderImages = [
      bgLoader,
      bgLogo,
      bgProgress,
      bar.src,
      coconut.src,
    ].filter(Boolean);

    // await preloadImagesWithProgress(loaderImages, percent => {
    //   moveCoconut(percent);
    // });

    const resourcesToLoad = [
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
      './assets/fisher1.png',
      './assets/symbols/5f100096-c2aa-450c-9646-066714d0fcde1.png',
      './assets/symbols/6a6ac619-4362-4a83-8f0a-ead4c7bb17d11.png',
      './assets/symbols/6bb95a70-78ae-4a62-b470-dfbd2642e7111.png',
      './assets/symbols/60f98bb9-fe05-4812-ba6a-f742768f63881.png',
      './assets/symbols/425682eb-0f72-4976-8eb5-494d2b2d9a321.png',
      './assets/symbols/a9e0dac9-564d-4c7a-ada3-e4480f9ca5051.png',
      './assets/symbols/shoe5.png',
      './assets/symbols/slot11.png',
      './assets/symbols/slot21.png',
      './assets/symbols/slot31.png',
      './assets/symbols/slot41.png',
      './assets/symbols/slot51.png',
      './assets/symbols/slot61.png',
    ];

    await preloadImagesWithProgress(resourcesToLoad, percent => {
      moveCoconut(percent);
    });

    setTimeout(() => {
      loader.style.display = 'none';
      main.style.display = 'flex';

      startPopup.setAttribute('data-open', 'true');
      overlay.setAttribute('data-visible', 'true');
    }, 1000);

    activateBtn.addEventListener('click', () => {
      startPopup.setAttribute('data-open', 'false');
      overlay.setAttribute('data-visible', 'false');
      spinBtn.classList.remove('blocked');
    });
  }

  startPreloading();
};

const symbol = [
  '5f100096-c2aa-450c-9646-066714d0fcde1.png',
  '6a6ac619-4362-4a83-8f0a-ead4c7bb17d11.png',
  '6bb95a70-78ae-4a62-b470-dfbd2642e7111.png',
  '60f98bb9-fe05-4812-ba6a-f742768f63881.png',
  '425682eb-0f72-4976-8eb5-494d2b2d9a321.png',
  'a9e0dac9-564d-4c7a-ada3-e4480f9ca5051.png',
  'shoe5.png',
  'slot11.png',
  'slot21.png',
  'slot31.png',
  'slot41.png',
  'slot51.png',
  'slot61.png',
];

const luckySymbol = '5f100096-c2aa-450c-9646-066714d0fcde1.png';
const reels = document.querySelectorAll('.reel');
const counterEl = document.getElementById('counter');

let spinsLeft = 3;
let spinning = false;

spinBtn.addEventListener('click', spin);

initStart();

function initStart() {
  reels.forEach(reel => {
    const boxes = reel.querySelector('.boxes');
    boxes.innerHTML = '';
    getRandomSymbols(3).forEach(sym => {
      const box = createBox(sym);
      box.dataset.symbol = sym;
      boxes.appendChild(box);
    });
    boxes.style.transition = 'none';
    boxes.style.transform = 'translateY(0)';
  });
}

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

  for (let i = 0; i < reels.length; i++) {
    const reel = reels[i];
    const boxes = reel.querySelector('.boxes');

    const boxHeight = Math.round(reel.clientHeight / 3);

    let final3;
    if (isLastSpin) {
      final3 = [
        getRandomSymbol([luckySymbol]),
        luckySymbol,
        getRandomSymbol([luckySymbol]),
      ];
    } else {
      do {
        const center = getRandomSymbol();
        const top = getRandomSymbol([center]);
        const bottom = getRandomSymbol([center, top]);
        final3 = [top, center, bottom];
      } while (
        final3[0] === final3[1] ||
        final3[1] === final3[2] ||
        final3[0] === final3[2]
      );
    }

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
    setTimeout(showFinalPopup, 1500);
  }

  spinning = false;
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

function createBox(sym) {
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

function showFinalPopup() {
  const finalPopup = document.querySelector('[data-final-popup]');
  const countdownEl = document.getElementById('countdown');

  finalPopup.setAttribute('data-open', 'true');
  overlay.setAttribute('data-visible', 'true');

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
    }
  }, 1000);
}
