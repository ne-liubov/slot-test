let spinsLeft = 3;
let isSpinning = false;

function createReel() {
  const container = document.createElement('div');
  container.classList.add('reel-inner');
  for (let i = 0; i < 30; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const img = document.createElement('img');
    img.src = `/assets/symbols/${symbol}`;
    img.draggable = false;
    container.appendChild(img);
  }
  return container;
}

function initReels() {
  reels.forEach(reel => {
    reel.innerHTML = '';
    reel.appendChild(createReel());
  });
}

// function startSpin() {
//   return new Promise(async resolve => {
//     for (let i = 0; i < reels.length; i++) {
//       const inner = reels[i].querySelector('.reel-inner');
//       inner.classList.add('animate');
//       inner.style.transition = '';
//       inner.style.transform = 'translateY(0)';
//       await new Promise(res => setTimeout(res, 500));
//     }
//     resolve();
//   });
// }
async function startSpin() {
  reels.forEach((reel, i) => {
    const inner = reel.querySelector('.reel-inner');
    inner.classList.add('animate');
    inner.style.animationDelay = `${i * 0.1}s`;
  });
}

async function doNormalSpin() {
  let stopIndexes = [];
  do {
    stopIndexes = reels.map(reel => {
      const inner = reel.querySelector('.reel-inner');
      return Math.floor(Math.random() * (inner.children.length - 2)) + 1;
    });
  } while (checkTriple(stopIndexes));

  await Promise.all(
    reels.map((reel, i) => {
      return new Promise(resolve => {
        const inner = reel.querySelector('.reel-inner');
        const imgHeight = inner.querySelector('img').offsetHeight + 10;
        inner.classList.remove('animate');

        const finalOffset =
          stopIndexes[i] * imgHeight - (reel.offsetHeight / 2 - imgHeight / 2);

        inner.style.transition = 'transform 1s ease-out';
        inner.style.transform = `translateY(-${finalOffset}px)`;

        inner.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'transform') {
            inner.style.transition = '';
            inner.removeEventListener('transitionend', onEnd);
            resolve();
          }
        });
      });
    })
  );
}

function getSymbolSrc(inner, index) {
  return inner.children[index].src;
}

function checkTriple(stopIndexes) {
  for (let offset = -1; offset <= 1; offset++) {
    const symbolSet = new Set();
    for (let i = 0; i < reels.length; i++) {
      const inner = reels[i].querySelector('.reel-inner');
      const idx = stopIndexes[i] + offset;
      if (idx < 0 || idx >= inner.children.length) return false;
      symbolSet.add(getSymbolSrc(inner, idx));
    }
    if (symbolSet.size === 1) {
      return true;
    }
  }
  return false;
}

function stopSpin(win = false) {
  const promises = reels.map((reel, i) => {
    return new Promise(resolve => {
      const inner = reel.querySelector('.reel-inner');
      inner.classList.remove('animate');

      const imgHeight = inner.querySelector('img').offsetHeight + 10;
      let stopIndex;

      if (win) {
        stopIndex = 14;
      } else {
        const maxIndex = inner.children.length - 2;
        do {
          stopIndex = Math.floor(Math.random() * (maxIndex - 1)) + 1;
        } while (
          (() => {
            const candidateIndexes = [];
            for (let j = 0; j < reels.length; j++) {
              if (j === i) candidateIndexes[j] = stopIndex;
              else candidateIndexes[j] = null;
            }
            return false;
          })()
        );
      }

      const finalOffset =
        stopIndex * imgHeight - (reel.offsetHeight / 2 - imgHeight / 2);
      inner.style.transition = 'transform 1s ease-out';
      inner.style.transform = `translateY(-${finalOffset}px)`;

      inner.addEventListener('transitionend', function onEnd(e) {
        if (e.propertyName === 'transform') {
          inner.style.transition = '';
          inner.removeEventListener('transitionend', onEnd);
          resolve();
        }
      });
    });
  });

  return Promise.all(promises);
}

// async function doLuckySpin() {
//   setLuckyCombo();

//   const centerIndex = 14;

//   await Promise.all(
//     reels.map(reel => {
//       return new Promise(resolve => {
//         const inner = reel.querySelector('.reel-inner');
//         const imgHeight = inner.querySelector('img').offsetHeight + 10;
//         inner.classList.remove('animate');

//         const finalOffset =
//           centerIndex * imgHeight - (reel.offsetHeight / 2 - imgHeight / 2);
//         inner.style.transition = 'transform 1s ease-out';
//         inner.style.transform = `translateY(-${finalOffset}px)`;

//         inner.addEventListener('transitionend', function onEnd(e) {
//           if (e.propertyName === 'transform') {
//             inner.style.transition = '';
//             inner.removeEventListener('transitionend', onEnd);
//             resolve();
//           }
//         });
//       });
//     })
//   );

//   spinBtn.classList.add('disabled');
//   spinBtn.style.cursor = 'not-allowed';

//   setTimeout(() => {
//     showFinalPopup();
//   }, 2000);
// }
async function doLuckySpin() {
  setLuckyCombination();

  const centerIndex = 14;

  await Promise.all(
    reels.map(reel => {
      return new Promise(resolve => {
        const inner = reel.querySelector('.reel-inner');
        const imgHeight = inner.querySelector('img').offsetHeight + 10;
        inner.classList.remove('animate');

        const finalOffset =
          centerIndex * imgHeight - (reel.offsetHeight / 2 - imgHeight / 2);

        inner.style.transition = 'transform 1s ease-out';
        inner.style.transform = `translateY(-${finalOffset}px)`;

        inner.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'transform') {
            inner.style.transition = '';
            inner.removeEventListener('transitionend', onEnd);
            resolve();
          }
        });
      });
    })
  );

  spinBtn.classList.add('disabled');
  spinBtn.style.cursor = 'not-allowed';

  setTimeout(() => {
    showFinalPopup();
  }, 2000);
}

// function setLuckyCombo() {
//   reels.forEach(reel => {
//     const inner = reel.querySelector('.reel-inner');
//     const centerIndex = 14;

//     [centerIndex - 1, centerIndex, centerIndex + 1].forEach(idx => {
//       if (inner.children[idx]) {
//         inner.children[idx].src = `/assets/symbols/${luckySymbol}`;
//       }
//     });
//   });
// }
function setLuckyCombination() {
  const centerIndex = 14;
  reels.forEach(reel => {
    const inner = reel.querySelector('.reel-inner');
    [centerIndex - 1, centerIndex, centerIndex + 1].forEach(idx => {
      if (inner.children[idx]) {
        inner.children[idx].src = `/assets/symbols/${luckySymbol}`;
      }
    });
  });
}

function showFinalPopup() {
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

  function closeFinalPopup() {
    finalPopup.setAttribute('data-open', 'false');
    overlay.setAttribute('data-visible', 'false');
    clearInterval(timerId);
    overlay.removeEventListener('click', closeFinalPopup);
  }

  overlay.addEventListener('click', closeFinalPopup);
}

spinBtn.addEventListener('click', async () => {
  if (isSpinning || spinsLeft <= 0) return;

  isSpinning = true;
  spinsLeft--;
  counter.textContent = spinsLeft;
  finalPopup.setAttribute('data-open', 'false');

  await startSpin();

  if (spinsLeft === 0) {
    await doLuckySpin();
  } else {
    await doNormalSpin();
  }

  isSpinning = false;
});

document.addEventListener('DOMContentLoaded', () => {
  initReels();
  counter.textContent = spinsLeft;
});
