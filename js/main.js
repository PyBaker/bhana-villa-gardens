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

  // ---- HERO SLIDER ----
  var slides = document.querySelectorAll('.hero-slide');
  var dots   = document.querySelectorAll('.hero-dot');
  var current = 0;
  var timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    timer = setInterval(next, 5000);
  }
  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (slides.length > 0) {
    startAuto();

    document.querySelector('.hero-arrow.next').addEventListener('click', function() {
      next(); resetAuto();
    });
    document.querySelector('.hero-arrow.prev').addEventListener('click', function() {
      prev(); resetAuto();
    });

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goTo(i); resetAuto(); });
    });
  }

})();
