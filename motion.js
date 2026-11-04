/* =============================================================
   Pudado · Royal Blue Motion
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
  const state = {
    triggers: [],
    calculatorObserver: null,
    brandContext: null,
    brandCleanup: null,
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

  // Scrolling and anchor navigation stay native: no wheel interception,
  // synthetic inertia or animation ticker controlling the scroll position.

  function initHero() {
    const header = document.querySelector('.site-header');
    const copy = document.querySelector('.hero-copy');
    const headingLines = document.querySelectorAll('.hero h1 > span');
    const lead = document.querySelector('.hero .lead');
    const trust = document.querySelector('.hero .trust-line');
    const actions = document.querySelector('.hero-actions');
    const visual = document.querySelector('.hero-visual');
    const badges = document.querySelector('.hero .product-badges');
    if (!copy || !visual) return;

    gsap.timeline({ defaults: { ease: MOTION.easeEnter } })
      .from(header, { y: -MOTION.distanceSmall, opacity: 0, duration: 0.42, clearProps: 'transform,opacity' }, 0)
      .from(copy.querySelector('.hero-wordmark'), { y: MOTION.distanceSmall, opacity: 0, duration: 0.42, clearProps: 'transform,opacity' }, 0.05)
      .from(headingLines, { y: MOTION.distanceMedium, opacity: 0, duration: 0.56, stagger: 0.08, clearProps: 'transform,opacity' }, 0.12)
      .from([lead, trust], { y: MOTION.distanceSmall, opacity: 0, duration: 0.48, stagger: 0.07, clearProps: 'transform,opacity' }, 0.28)
      .from(actions, { y: MOTION.distanceSmall, opacity: 0, duration: 0.46, clearProps: 'transform,opacity' }, 0.42)
      .from(visual, { y: MOTION.distanceMedium, scale: 0.985, opacity: 0, duration: 0.72, clearProps: 'transform,opacity' }, 0.18)
      .from(badges, { y: 8, opacity: 0, duration: 0.34, clearProps: 'transform,opacity' }, 0.75);

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
    revealOnce('#warum', '#warum .section-head', { y: 18, stagger: 0.12 });
  }

  function initBrandSignature() {
    const stage = document.querySelector('#warum .brand-stage');
    const word = stage && stage.querySelector('.brand-stage-word');
    const mirror = word && word.querySelector('.wordmark-mirror');
    if (!word || !mirror) return;
    const light = stage.querySelector('.brand-stage-light');
    const replay = stage.querySelector('[data-brand-replay]');
    let played = false;
    let running = false;

    const finish = () => {
      running = false;
      if (replay) replay.setAttribute('aria-disabled', 'false');
    };
    const restore = () => {
      if (state.brandContext) state.brandContext.revert();
      state.brandContext = null;
      finish();
    };
    const play = () => {
      if (running || state.destroyed || reducedMotion.matches || document.hidden) return;
      restore();
      played = true;
      running = true;
      // aria-disabled keeps keyboard focus stable while guarding repeated presses.
      if (replay) replay.setAttribute('aria-disabled', 'true');
      state.brandContext = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: MOTION.easeEnter }, onComplete: finish });
        timeline.from(word, {
          y: 6, opacity: 0.65, duration: 0.85,
          clearProps: 'transform,opacity'
        }, 0).from(mirror, {
          opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: 0.95,
          clearProps: 'opacity,clipPath'
        }, 0.3);
        // A single, finite light pass resolves into the original reflected logo.
        // Never animate the mirror transform: CSS owns its exact inversion.
        if (light) timeline
          .fromTo(light, { xPercent: -110 }, {
            xPercent: 500, duration: 1.45, ease: 'power2.inOut', clearProps: 'transform'
          }, 0.08)
          .fromTo(light, { opacity: 0 }, { opacity: 0.7, duration: 0.22 }, 0.12)
          .to(light, { opacity: 0, duration: 0.38, clearProps: 'opacity' }, 1.15);
      }, stage);
    };
    const preferenceChanged = () => {
      if (reducedMotion.matches) restore();
      if (replay) replay.hidden = reducedMotion.matches;
    };
    const visibilityChanged = () => { if (document.hidden) restore(); };
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', play);
    }
    reducedMotion.addEventListener('change', preferenceChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    state.brandCleanup = () => {
      restore();
      reducedMotion.removeEventListener('change', preferenceChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      if (replay) {
        replay.removeEventListener('click', play);
        replay.hidden = true;
      }
    };
    state.triggers.push(ScrollTrigger.create({
      trigger: stage,
      start: 'top 82%',
      once: true,
      onEnter: () => { if (!played) play(); }
    }));
  }

  function stopBrandMotion() {
    if (state.brandCleanup) state.brandCleanup();
    state.brandCleanup = null;
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
  }

  function cleanup() {
    if (state.destroyed) return;
    state.destroyed = true;
    stopBrandMotion();
    if (state.calculatorObserver) state.calculatorObserver.disconnect();
    state.triggers.forEach((trigger) => trigger.kill());
    state.triggers.length = 0;
  }

  try {
    initHero();
    initSectionReveals();
    initBrandSignature();
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
