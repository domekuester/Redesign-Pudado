/* =============================================================
   Pudado · Soft Water Wool
   Zentrale, progressive Motion-Schicht für die Startseite.
   Inhalte und Funktionen bleiben ohne diese Datei vollständig nutzbar.
   ============================================================= */

(() => {
  'use strict';

  const MOTION = Object.freeze({
    fast: 0.2,
    normal: 0.65,
    slow: 1.1,
    stagger: 0.08,
    distanceSmall: 14,
    distanceMedium: 28,
    easeEnter: 'power3.out',
    easeSoft: 'power2.out'
  });

  const isHome = document.body && document.body.dataset.page === 'home';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopScroll = window.matchMedia('(min-width: 981px)');
  const SCROLL_CONFIG = Object.freeze({
    lerp: 0.22,
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
    autoRaf: false,
    stopInertiaOnNavigate: true
  });
  const state = {
    lenis: null,
    triggers: [],
    locks: new Set(),
    calculatorObserver: null,
    heroMediaMatchMedia: null,
    heroMediaAnimations: [],
    heroMediaObserver: null,
    heroMediaVisibilityCleanup: null,
    heroMediaVisible: true,
    destroyed: false
  };

  if (!isHome || reducedMotion.matches) {
    document.documentElement.classList.add('motion-static');
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    document.documentElement.classList.add('motion-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function initLenis() {
    if (!window.Lenis || !finePointer.matches || !desktopScroll.matches) return;
    state.lenis = new window.Lenis(SCROLL_CONFIG);
    state.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('pudado:scroll-lock', handleScrollLock);

    const banner = document.getElementById('cookieBanner');
    const modal = document.getElementById('cookieModal');
    const nav = document.getElementById('mainNav');
    if (banner && !banner.hidden) state.locks.add('cookie-banner');
    if (modal && !modal.hidden) state.locks.add('cookie-modal');
    if (nav && nav.classList.contains('open')) state.locks.add('navigation');
    if (state.locks.size) state.lenis.stop();
  }

  function lenisRaf(time) {
    if (state.lenis) state.lenis.raf(time * 1000);
  }

  function handleAnchorClick(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !state.lenis) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    state.lenis.scrollTo(target, {
      // Das globale scroll-padding-top reserviert bereits den Sticky-Header.
      offset: 0,
      lerp: 0.22,
      lock: false,
      force: true,
      onComplete: () => {
        if (history.replaceState) history.replaceState(null, '', href);
      }
    });
  }

  function handleScrollLock(event) {
    const detail = event.detail || {};
    const source = detail.source || 'interface';
    if (detail.locked) state.locks.add(source);
    else state.locks.delete(source);
    if (!state.lenis) return;
    if (state.locks.size) state.lenis.stop();
    else state.lenis.start();
  }

  function initHero() {
    const header = document.querySelector('.site-header');
    const copy = document.querySelector('.hero-copy');
    const headingLines = document.querySelectorAll('.hero h1 > span');
    const lead = document.querySelector('.hero .lead');
    const trust = document.querySelector('.hero .trust-line');
    const actions = document.querySelector('.hero-actions');
    const visual = document.querySelector('.hero-visual');
    const badges = document.querySelector('.hero .product-badges');
    const media = document.querySelector('.hero-media');
    if (!copy || !visual) return;

    gsap.timeline({ defaults: { ease: MOTION.easeEnter } })
      .from(header, { y: -MOTION.distanceSmall, opacity: 0, duration: 0.42, clearProps: 'transform,opacity' }, 0)
      .from(copy.querySelector('.hero-wordmark'), { y: MOTION.distanceSmall, opacity: 0, duration: 0.42, clearProps: 'transform,opacity' }, 0.05)
      .from(headingLines, { y: MOTION.distanceMedium, opacity: 0, duration: 0.56, stagger: 0.08, clearProps: 'transform,opacity' }, 0.12)
      .from([lead, trust], { y: MOTION.distanceSmall, opacity: 0, duration: 0.48, stagger: 0.07, clearProps: 'transform,opacity' }, 0.28)
      .from(actions, { y: MOTION.distanceSmall, opacity: 0, duration: 0.46, clearProps: 'transform,opacity' }, 0.42)
      .from(visual, { y: MOTION.distanceMedium, scale: 0.985, opacity: 0, duration: 0.72, clearProps: 'transform,opacity' }, 0.18)
      .from(badges, { y: 8, opacity: 0, duration: 0.34, clearProps: 'transform,opacity' }, 0.75);

    if (media) initHeroMediaMotion(document.getElementById('hero'));

    if (window.innerWidth > 980) {
      state.triggers.push(ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        animation: gsap.to(visual, { yPercent: 2.5, ease: 'none' })
      }));
    }
  }

  function setHeroMediaPlayback() {
    const shouldPlay = state.heroMediaVisible && !document.hidden;
    state.heroMediaAnimations.forEach((animation) => animation.paused(!shouldPlay));
  }

  function initHeroMediaMotion(hero) {
    if (!hero) return;
    const image = hero.querySelector('.hero-media-image');
    const pointerLayer = hero.querySelector('.hero-media-pointer-layer');
    if (!image || !pointerLayer) return;

    const createLivingStill = (frames) => {
      const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
      gsap.set(image, { x: 0, y: 0, scale: frames.startScale, force3D: true });
      frames.steps.forEach((step) => timeline.to(image, step));
      state.heroMediaAnimations.push(timeline);
      setHeroMediaPlayback();
      return () => {
        const index = state.heroMediaAnimations.indexOf(timeline);
        if (index !== -1) state.heroMediaAnimations.splice(index, 1);
        timeline.kill();
      };
    };

    const mm = gsap.matchMedia();
    state.heroMediaMatchMedia = mm;
    mm.add('(min-width: 1000px)', () => createLivingStill({
      startScale: 1.02,
      steps: [
        { x: 5, y: -3, scale: 1.025, duration: 7.2 },
        { x: -4, y: 3, scale: 1.03, duration: 8.4 },
        { x: 0, y: 0, scale: 1.02, duration: 7.6 }
      ]
    }));
    mm.add('(min-width: 431px) and (max-width: 999px)', () => createLivingStill({
      startScale: 1.012,
      steps: [
        { x: 2, y: -2, scale: 1.018, duration: 9.2 },
        { x: -2, y: 1, scale: 1.016, duration: 10.1 },
        { x: 0, y: 0, scale: 1.012, duration: 9.4 }
      ]
    }));
    mm.add('(max-width: 430px)', () => {
      gsap.set(image, { x: 0, y: 0, scale: 1.008 });
      return () => gsap.set(image, { clearProps: 'transform' });
    });

    mm.add('(min-width: 1000px) and (hover: hover) and (pointer: fine)', () => {
      const moveX = gsap.quickTo(pointerLayer, 'x', { duration: 1.45, ease: 'power2.out' });
      const moveY = gsap.quickTo(pointerLayer, 'y', { duration: 1.45, ease: 'power2.out' });
      const reset = () => {
        moveX(0);
        moveY(0);
      };
      const move = (event) => {
        const rect = hero.getBoundingClientRect();
        const nx = gsap.utils.clamp(-1, 1, ((event.clientX - rect.left) / rect.width) * 2 - 1);
        const ny = gsap.utils.clamp(-1, 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
        moveX(nx * 4);
        moveY(ny * 2.5);
      };
      hero.addEventListener('pointermove', move, { passive: true });
      hero.addEventListener('pointerleave', reset, { passive: true });
      return () => {
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', reset);
        gsap.set(pointerLayer, { clearProps: 'transform' });
      };
    });

    state.heroMediaObserver = new IntersectionObserver(([entry]) => {
      state.heroMediaVisible = Boolean(entry && entry.isIntersecting);
      setHeroMediaPlayback();
    }, { threshold: 0.04 });
    state.heroMediaObserver.observe(hero);
    const handleVisibility = () => setHeroMediaPlayback();
    document.addEventListener('visibilitychange', handleVisibility);
    state.heroMediaVisibilityCleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }

  function revealOnce(trigger, targets, vars = {}) {
    const elements = gsap.utils.toArray(targets);
    if (!elements.length) return;
    state.triggers.push(ScrollTrigger.create({
      trigger,
      start: vars.start || 'top 82%',
      once: true,
      onEnter: () => gsap.from(elements, {
        y: vars.y == null ? MOTION.distanceSmall : vars.y,
        x: vars.x || 0,
        scale: vars.scale || 1,
        opacity: vars.opacity == null ? 0 : vars.opacity,
        duration: vars.duration || MOTION.normal,
        stagger: vars.stagger == null ? MOTION.stagger : vars.stagger,
        ease: MOTION.easeEnter,
        clearProps: 'transform,opacity'
      })
    }));
  }

  function initSectionReveals() {
    revealOnce('#set', ['#set .set-copy', '#set .set-visual'], { y: 18, stagger: 0.12 });
    revealOnce('#checker', ['#checker .section-head', '#checker .fotocheck'], { y: 18, stagger: 0.1 });
    revealOnce('#rechner', ['#rechner .calc2-inputs', '#rechner .calc2-results'], { y: 18, stagger: 0.12 });
    document.querySelectorAll('.mood-section').forEach((section) => {
      const isForest = section.classList.contains('mood-section--primary');
      revealOnce(section, section, {
        y: isForest ? 12 : 10,
        scale: isForest ? 1.008 : 1.006,
        duration: isForest ? 1 : 0.92,
        stagger: 0
      });
      if (window.innerWidth > 980) {
        const media = section.querySelector('.mood-media img');
        if (media) {
          state.triggers.push(ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: isForest ? 0.6 : 0.5,
            animation: isForest
              ? gsap.fromTo(media, { yPercent: -1.15, scale: 1.02 }, {
                yPercent: 1.15,
                scale: 1,
                ease: 'none'
              })
              : gsap.fromTo(media, { xPercent: -0.45, yPercent: -0.55, scale: 1.015 }, {
                xPercent: 0.45,
                yPercent: 0.65,
                scale: 1,
                ease: 'none'
              })
          }));
        }
      }
    });
    revealOnce('#warum', ['#warum .section-head', '#warum .brand-stage'], { y: 18, stagger: 0.12 });
  }

  function initSignatureMoments() {
    revealOnce('#insight', '#insight .section-head', { y: 14, stagger: 0 });
    revealOnce('#insight .comparison', '#insight .comparison', {
      y: 10,
      scale: 1,
      stagger: 0,
      duration: 0.75
    });

    revealOnce('#produkt', ['#produkt .product-copy > .section-label', '#produkt .product-copy > h2', '#produkt .product-copy > .section-text'], {
      y: 16,
      stagger: 0.07
    });
    revealOnce('#produkt .num-list', '#produkt .num-list li', { x: -14, y: 0, stagger: 0.08 });
    const productVisual = document.querySelector('#produkt .product-visual');
    if (productVisual && window.innerWidth > 980) {
      state.triggers.push(ScrollTrigger.create({
        trigger: '#produkt',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.9,
        animation: gsap.fromTo(productVisual, { yPercent: -1.5 }, { yPercent: 1.5, ease: 'none' })
      }));
    }

    revealOnce('#how', ['#how .section-head', '#how .how-figure'], { y: 18, stagger: 0.1 });
    if (window.innerWidth > 700) {
      revealOnce('#how .steps', '#how .step', { y: 12, stagger: 0.08 });
    } else {
      revealOnce('#how .steps', '#how .steps', { y: 8, stagger: 0 });
    }
  }

  function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    if (!progress) return;
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    state.triggers.push(ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(progress, { scaleX: self.progress })
    }));
  }

  function initCalculatorFeedback() {
    const results = document.getElementById('calcResults');
    if (!results || !window.MutationObserver) return;
    state.calculatorObserver = new MutationObserver((mutations) => {
      const changed = new Set();
      mutations.forEach((mutation) => {
        const el = mutation.target.nodeType === 3 ? mutation.target.parentElement : mutation.target;
        const value = el && el.closest && el.closest('.kpi-num, .bar2-val');
        if (value) changed.add(value);
      });
      if (changed.size) {
        gsap.fromTo(Array.from(changed), { opacity: 0.45, y: 3 }, {
          opacity: 1,
          y: 0,
          duration: MOTION.fast,
          ease: MOTION.easeSoft,
          overwrite: true
        });
      }
    });
    state.calculatorObserver.observe(results, { subtree: true, childList: true, characterData: true });
  }

  function refreshAfterAssets() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    const pendingMoodImages = Array.from(document.querySelectorAll('.mood-media img'))
      .filter((image) => !image.complete);
    if (pendingMoodImages.length) {
      Promise.all(pendingMoodImages.map((image) => new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))).then(() => {
        if (!state.destroyed) ScrollTrigger.refresh();
      });
    }
  }

  function cleanup() {
    if (state.destroyed) return;
    state.destroyed = true;
    if (state.heroMediaMatchMedia) state.heroMediaMatchMedia.revert();
    state.heroMediaMatchMedia = null;
    state.heroMediaAnimations.forEach((animation) => animation.kill());
    state.heroMediaAnimations.length = 0;
    if (state.heroMediaObserver) state.heroMediaObserver.disconnect();
    state.heroMediaObserver = null;
    if (state.heroMediaVisibilityCleanup) state.heroMediaVisibilityCleanup();
    state.heroMediaVisibilityCleanup = null;
    if (state.calculatorObserver) state.calculatorObserver.disconnect();
    state.triggers.forEach((trigger) => trigger.kill());
    state.triggers.length = 0;
    if (state.lenis) state.lenis.destroy();
    state.lenis = null;
    gsap.ticker.remove(lenisRaf);
    document.removeEventListener('click', handleAnchorClick);
    document.removeEventListener('pudado:scroll-lock', handleScrollLock);
  }

  try {
    initLenis();
    initHero();
    initSectionReveals();
    initSignatureMoments();
    initScrollProgress();
    initCalculatorFeedback();
    refreshAfterAssets();
    document.documentElement.classList.add('js-motion-ready');
    window.addEventListener('pagehide', cleanup, { once: true });
  } catch (_) {
    cleanup();
    document.documentElement.classList.add('motion-static');
  }
})();
