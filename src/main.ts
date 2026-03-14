import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');
  const contents = document.querySelectorAll('.tab-content');

  let activeIndex = 0;

  const updateTabs = (index: number) => {
    if (index < 0) index = tabs.length - 1;
    if (index >= tabs.length) index = 0;

    activeIndex = index;

    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    contents.forEach((content, i) => {
      content.classList.toggle('active', i === index);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => updateTabs(index));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'q' || e.key === 'ArrowLeft') updateTabs(activeIndex - 1);
    if (e.key === 'e' || e.key === 'ArrowRight') updateTabs(activeIndex + 1);
  });

  document.getElementById('prev-tab')?.addEventListener('click', () => updateTabs(activeIndex - 1));
  document.getElementById('next-tab')?.addEventListener('click', () => updateTabs(activeIndex + 1));

  const carouselImg = document.querySelector('.carousel-img') as HTMLImageElement;
  const screenshots = [
    '/Community/image.png',
    '/Community/image2.png',
    '/Community/image3.png',
    '/Community/image4.png',
    '/Community/image5.png',
    '/Community/image6.png'
  ];
  let screenIndex = 0;

  const rotateScreenshot = (dir: number) => {
    screenIndex = (screenIndex + dir + screenshots.length) % screenshots.length;
    if (carouselImg) {
      carouselImg.style.opacity = '0';
      setTimeout(() => {
        carouselImg.src = screenshots[screenIndex];
        carouselImg.style.opacity = '1';
      }, 100);
    }
  };

  document.querySelector('.carousel-arrow.left')?.addEventListener('click', () => rotateScreenshot(-1));
  document.querySelector('.carousel-arrow.right')?.addEventListener('click', () => rotateScreenshot(1));

  // --- Download Logic ---
  const repo = 'Emerald-Legacy-Launcher/Emerald-Legacy-Launcher';
  const modal = document.getElementById('download-modal');
  const modalOptions = document.getElementById('modal-options');
  const modalTitle = document.getElementById('modal-title');
  const closeModal = document.getElementById('close-modal');

  let latestAssets: any[] = [];

  const detectOS = () => {
    const ua = window.navigator.userAgent;
    let os = 'Unknown';
    let arch = 'x64';

    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'macOS';
    if (ua.indexOf('Linux') !== -1) os = 'Linux';

    if (ua.indexOf('arm64') !== -1 || ua.indexOf('aarch64') !== -1) {
      arch = 'arm64';
    }

    return { os, arch };
  };

  const getRecommendedAsset = (os: string, arch: string, assets: any[]) => {
    if (os === 'Windows') return assets.find(a => a.name.endsWith('.exe'));
    if (os === 'macOS') return assets.find(a => a.name.endsWith(arch === 'arm64' ? 'aarch64.dmg' : 'x64.dmg'));
    if (os === 'Linux') return assets.find(a => a.name.endsWith('.AppImage'));
    return null;
  };

  const openDownloadModal = (osType: string) => {
    if (!modal || !modalOptions || !modalTitle) return;

    const { arch } = detectOS();
    let filteredAssets = [];
    let title = 'Select Downloader';

    if (osType === 'Windows') {
      filteredAssets = latestAssets.filter(a => a.name.endsWith('.exe') || a.name.endsWith('.msi'));
      title = 'Emerald Legacy for Windows';
    } else if (osType === 'macOS') {
      filteredAssets = latestAssets.filter(a => a.name.endsWith('.dmg'));
      title = 'Emerald Legacy for macOS';
    } else if (osType === 'Linux') {
      filteredAssets = latestAssets.filter(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.endsWith('.rpm'));
      title = 'Emerald Legacy for Linux';
    }

    const recommended = getRecommendedAsset(osType, arch, filteredAssets);

    modalTitle.innerText = title;
    modalOptions.innerHTML = filteredAssets.map(asset => {
      const isRecommended = asset.name === recommended?.name;
      return `
        <div class="modal-btn-container">
          <a href="${asset.browser_download_url}" class="main-btn">
            <span>${asset.name.split('_').pop()?.split('-').pop() || asset.name}</span>
          </a>
          ${isRecommended ? '<span class="splash-text">Recommended!</span>' : ''}
        </div>
      `;
    }).join('');

    modal.classList.add('active');
  };

  const updateDownloadButtons = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
      const data = await response.json();
      latestAssets = data.assets;
      const { os } = detectOS();

      const mainBtn = document.getElementById('main-download-btn');
      if (mainBtn) {
        mainBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openDownloadModal(os === 'Unknown' ? 'Windows' : os);
        });
        const span = mainBtn.querySelector('span');
        if (span) span.innerText = `Download for ${os === 'Unknown' ? 'Your OS' : os}`;
      }

      const winBtn = document.getElementById('download-win');
      const linuxBtn = document.getElementById('download-linux');
      const macBtn = document.getElementById('download-macos');

      winBtn?.addEventListener('click', (e) => { e.preventDefault(); openDownloadModal('Windows'); });
      linuxBtn?.addEventListener('click', (e) => { e.preventDefault(); openDownloadModal('Linux'); });
      macBtn?.addEventListener('click', (e) => { e.preventDefault(); openDownloadModal('macOS'); });

    } catch (error) {
      console.error('Error fetching latest release:', error);
    }
  };

  closeModal?.addEventListener('click', () => modal?.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal?.classList.remove('active'); });

  updateDownloadButtons();

  setInterval(() => rotateScreenshot(1), 5000);
});
