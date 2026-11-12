// Site configuration: swap the Amazon store URL here once it is live.
const SITE_CONFIG = {
  amazonStoreUrl: '#'
};

(function () {
  const nav = document.getElementById('main-nav');
  const logo = nav && nav.querySelector('.nav-brand img');
  const setScrolled = () => {
    const scrolled = window.scrollY > 60;
    nav.classList.toggle('scrolled', scrolled);
    if (logo) logo.src = scrolled ? 'assets/elb_picto_dark.svg' : 'assets/elb_picto.svg';
  };
  if (nav) {
    window.addEventListener('scroll', setScrolled, { passive: true });
    setScrolled();
  }

  const burger = document.querySelector('.burger');
  const menu = document.getElementById('site-menu');
  if (burger && menu) {
    const setOpen = (open) => {
      menu.classList.toggle('nav-open', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', () => setOpen(!menu.classList.contains('nav-open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('nav-open')) { setOpen(false); burger.focus(); }
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  document.querySelectorAll('[data-amazon-link]').forEach((a) => {
    if (SITE_CONFIG.amazonStoreUrl && SITE_CONFIG.amazonStoreUrl !== '#') {
      a.href = SITE_CONFIG.amazonStoreUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.addEventListener('click', (e) => e.preventDefault());
    }
  });

  // Video block: set data-youtube="VIDEO_ID" or data-mp4="assets/video.mp4" on .video to enable.
  document.querySelectorAll('.video[data-video]').forEach((box) => {
    const yt = box.dataset.youtube;
    const mp4 = box.dataset.mp4;
    if (yt) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt);
      iframe.title = box.dataset.title || 'Video';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      box.replaceChildren(iframe);
    } else if (mp4) {
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'none';
      video.playsInline = true;
      if (box.dataset.poster) video.poster = box.dataset.poster;
      video.src = mp4;
      box.replaceChildren(video);
    }
  });

  const dlg = document.getElementById('lightbox');
  const items = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (dlg && items.length && typeof dlg.showModal === 'function') {
    const img = dlg.querySelector('img');
    const cap = dlg.querySelector('figcaption');
    let index = 0;
    let opener = null;
    const show = (n) => {
      index = (n + items.length) % items.length;
      const item = items[index];
      const thumb = item.querySelector('img');
      img.src = item.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = (thumb ? thumb.alt : '') + ' (' + (index + 1) + ' / ' + items.length + ')';
    };
    items.forEach((item, n) => item.addEventListener('click', (e) => {
      e.preventDefault();
      opener = item;
      show(n);
      dlg.showModal();
    }));
    dlg.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
    dlg.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
    dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { if (opener) opener.focus(); });

    let startX = null;
    const fig = dlg.querySelector('.lightbox-figure');
    fig.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    fig.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
    });
  }
})();
