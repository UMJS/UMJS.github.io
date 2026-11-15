(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var navBtn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  var meta = document.querySelector('meta[name="theme-color"]');

  /* ---------- Tema claro/escuro ---------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B1120' : '#F8FAFC');
    if (toggle) {
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Alternar para o tema claro' : 'Alternar para o tema escuro'
      );
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('umjs-theme', next); } catch (e) {}
    });
  }

  /* ---------- Menu mobile ---------- */
  function setMenu(open) {
    if (!navBtn || !menu) return;
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
  }

  if (navBtn && menu) {
    navBtn.addEventListener('click', function () {
      setMenu(navBtn.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    navBtn.closest('nav').addEventListener('focusout', function (e) {
      if (navBtn.contains(e.relatedTarget) || menu.contains(e.relatedTarget)) return;
      if (navBtn.getAttribute('aria-expanded') === 'true') setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        navBtn.focus();
      }
    });
  }

  /* ---------- Visualizador das capturas ---------- */
  var viewer = document.querySelector('.gallery-dialog');
  if (viewer && typeof viewer.showModal === 'function') {
    var viewerImage = viewer.querySelector('img');
    var caption = viewer.querySelector('figcaption');
    var opener;

    document.querySelectorAll('.project-gallery a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        var image = link.querySelector('img');
        viewerImage.src = image.currentSrc || link.href;
        viewerImage.alt = image.alt;
        caption.textContent = link.closest('figure').querySelector('figcaption').textContent;
        viewer.showModal();
        opener = link;
        e.preventDefault();
      });
    });

    viewer.querySelector('button').addEventListener('click', function () {
      viewer.close();
    });

    viewer.addEventListener('click', function (e) {
      if (e.target !== viewer) return;
      var bounds = viewer.getBoundingClientRect();
      if (e.clientX < bounds.left || e.clientX > bounds.right ||
          e.clientY < bounds.top || e.clientY > bounds.bottom) viewer.close();
    });

    viewer.addEventListener('close', function () {
      if (opener) opener.focus();
    });
  }

  /* ---------- Link ativo conforme a seção visível ---------- */
  var links = document.querySelectorAll('.nav-links a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var active = map[entry.target.id];
        if (active) { active.classList.add('is-active'); active.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
