const loadResources = (resourceUrls, onProgress, onComplete) => {
  const total = resourceUrls.length;
  let loaded = 0;
  const results = [];

  if (total === 0) {
    onProgress?.(100);
    onComplete?.([]);
    return;
  }

  resourceUrls.forEach(url => {
    const img = new Image();

    img.onload = () => {
      loaded++;
      results.push({ url, status: 'loaded' });
      updateProgress();
    };

    img.onerror = () => {
      loaded++;
      results.push({ url, status: 'error' });
      updateProgress();
    };

    img.src = url;
  });

  function updateProgress() {
    const percent = Math.round((loaded / total) * 100);
    onProgress?.(percent);

    if (loaded === total) {
      onComplete?.(results);
    }
  }
};

const moveCoconut = percent => {
  const bar = document.getElementById('progress-bar');
  const coconut = document.getElementById('progress-coconut');

  if (!bar || !coconut) return;

  const barWidth = bar.offsetWidth;
  const coconutWidth = coconut.offsetWidth;

  const maxLeft = barWidth - coconutWidth;
  const newLeft = (percent / 100) * maxLeft + 10;

  coconut.style.left = `${newLeft}px`;
};

const resourcesToLoad = [
  '/src/assets',
  './assets/image2.jpg',
  './assets/image3.jpg',
];

loadResources(
  resourcesToLoad,
  percent => {
    moveCoconut(percent);
  },
  () => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    loader.style.transition = 'opacity 0.5s ease';
    loader.style.opacity = '0';

    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
);
