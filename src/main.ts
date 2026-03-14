import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-item');
  const contents = document.querySelectorAll('.tab-content');
  const prevBtn = document.getElementById('prev-tab');
  const nextBtn = document.getElementById('next-tab');
  const gotoFeatures = document.getElementById('goto-features');
  const gotoDownload = document.getElementById('goto-download');

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

  prevBtn?.addEventListener('click', () => updateTabs(activeIndex - 1));
  nextBtn?.addEventListener('click', () => updateTabs(activeIndex + 1));

  gotoFeatures?.addEventListener('click', (e) => {
    e.preventDefault();
    updateTabs(1);
  });

  gotoDownload?.addEventListener('click', (e) => {
    e.preventDefault();
    updateTabs(3);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateTabs(activeIndex - 1);
    if (e.key === 'ArrowRight') updateTabs(activeIndex + 1);
  });
});
