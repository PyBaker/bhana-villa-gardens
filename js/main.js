(function () {
  'use strict';

  // ---- NAV: transparent → solid on scroll ----
  var nav = document.querySelector('.site-nav');
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // ---- OFF-CANVAS ----
  var hamburger = document.querySelector('.nav-hamburger');
  var offcanvas = document.querySelector('.offcanvas');
  var overlay   = document.querySelector('.offcanvas-overlay');
  var closeBtn  = document.querySelector('.offcanvas-close');

  function openMenu() {
    offcanvas.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    offcanvas.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);

  // Close on offcanvas link tap
  document.querySelectorAll('.offcanvas-nav a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  // ---- HERO VIDEO ----
  var video = document.getElementById('hero-video');
  if (video) {
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function() {
        // Autoplay blocked — show poster, hide video gracefully
        video.style.display = 'none';
      });
    }
  }

})();
