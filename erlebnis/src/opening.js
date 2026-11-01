// Eröffnung: Standbild sofort (im HTML), kurzes Video nur bei Bedarf, jederzeit überspringbar.
// Die Eröffnung belegt die ganze Fläche (Desktop: Bühne und Seitenleiste). Beim Einstieg übernimmt
// die 3D-Kamera die gerade gezeigte Videoeinstellung und fährt in die Entdecken-Ansicht.

const MEDIA = {
  camera: 'assets/opening/opening-camera.json',
  aspect: { desktop: 16 / 9, mobile: 9 / 16 },
  posY: { desktop: 0.5, mobile: 0.3 },   // object-position der Eröffnungsbilder (styles.css)
  plate: (fmt, kind) => `assets/plate/plate-${fmt}-${kind}.webp`,
};

// Hintergrundplatte der Bühne: letztes Filmbild ohne Set-Teile. Scharf und deckungsgleich mit dem
// Videobild zur Übergabe, danach weich (Fokus wandert zum Produkt).
function placePlate(plate, media, aspect, posY) {
  const st = plate.parentElement.getBoundingClientRect();
  const vw = Math.max(media.width, media.height * aspect);
  const vh = vw / aspect;
  const box = { left: media.left + (media.width - vw) / 2 - st.left, top: media.top + (media.height - vh) * posY - st.top };
  for (const img of plate.querySelectorAll('img')) {
    Object.assign(img.style, { left: `${box.left}px`, top: `${box.top}px`, width: `${vw}px`, height: `${vh}px`, objectFit: 'fill' });
  }
  // Bei späterer Größenänderung genügt die weiche Platte als Bühnenhintergrund (object-fit: cover)
  window.addEventListener('resize', () => plate.querySelectorAll('img').forEach((img) => img.removeAttribute('style')), { once: true });
}

// Videoauflösung nach tatsächlicher Darstellungsbreite in Gerätepixeln (object-fit: cover)
function videoSource(fmt, el) {
  if (fmt === 'mobile') return 'assets/opening/opening-mobile.mp4';
  const r = el.getBoundingClientRect();
  const shown = Math.max(r.width, r.height * MEDIA.aspect.desktop) * (window.devicePixelRatio || 1);
  return shown > 2000 ? 'assets/opening/opening-desktop-2560.mp4' : 'assets/opening/opening-desktop-1920.mp4';
}

export function initOpening({ getStage, narrowQuery, reducedQuery, onEnd, syncStage }) {
  const el = document.getElementById('opening');
  if (!el) return { active: () => false, end: () => {} };
  const video = document.getElementById('openingVideo');
  const cta = document.getElementById('openingCta');
  const panel = document.getElementById('panel');
  const fmt = narrowQuery.matches ? 'mobile' : 'desktop';
  let active = true;
  let shown = 'start';          // was gerade zu sehen ist: 'start' (Standbild), 'video', 'end'
  let camData = null;

  // Seitenleiste und Bühne liegen unter der Eröffnung: erst danach bedienbar (kein Tab-Ziel unter dem Film)
  const stageEl = document.getElementById('stage');
  if (panel) panel.inert = true;
  if (stageEl) stageEl.inert = true;
  const plate = document.getElementById('stagePlate');
  if (plate) {
    for (const [cls, kind] of [['plate--sharp', 'scharf'], ['plate--blur', 'weich']]) {
      const img = new Image();
      img.className = cls;
      img.alt = '';
      img.decoding = 'async';
      img.src = MEDIA.plate(fmt, kind);
      plate.append(img);
    }
  }
  fetch(MEDIA.camera).then((r) => (r.ok ? r.json() : null)).then((d) => { camData = d; }).catch(() => {});

  const conn = navigator.connection || {};
  const saveData = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  const resume = () => { const st = getStage(); if (st) st.setPaused(false); };

  if (!reducedQuery.matches && !saveData && video && typeof video.play === 'function') {
    video.addEventListener('playing', () => {
      if (!active) return;
      shown = 'video';
      el.classList.add('is-playing');
      const st = getStage();
      if (st) st.setPaused(true);   // keine parallele 3D-Darstellung unter dem Video
    });
    video.addEventListener('ended', () => {
      shown = 'end';
      resume();
    });
    video.addEventListener('error', () => {
      // Video fehlt oder lässt sich nicht abspielen: Standbild bleibt, Ansichten bleiben bedienbar
      el.classList.remove('is-playing');
      shown = 'start';
      resume();
    });
    video.src = videoSource(fmt, el);
    const p = video.play();
    if (p && p.catch) p.catch(() => { el.classList.remove('is-playing'); shown = 'start'; resume(); });
  }

  // Kameraeinstellung des gerade sichtbaren Bildes (Standbild = Bild 1, Video = aktuelles Bild)
  function currentPose() {
    const f = camData && camData.formats[fmt];
    if (!f) return null;
    if (shown === 'start') return f.start;
    if (shown === 'end') return f.end;
    if (!f.poses || !video) return null;
    const i = Math.min(f.poses.length - 1, Math.max(0, Math.round(video.currentTime * camData.fps)));
    const p = f.poses[i];
    return { position: p.slice(0, 3), quaternion: p.slice(3, 7) };
  }

  /* Einstieg. view: gewählte Ansicht („Produkt entdecken“ = discover, oder ein Reiter).
   * Reihenfolge: Einstiegstext weicht sofort (160 ms); das Video blendet über das deckungsgleiche 3D-Bild
   * aus (450 ms, Bild steht); erst danach erscheinen Seitenleiste und Bedienung (260 ms) und die Kamera
   * fährt. Ist keine deckungsgleiche Übergabe möglich (Modell lädt noch, Kameradaten fehlen), gibt es
   * einen kurzen Schnitt über die Wand: erst Video aus, dann 3D ein – nie zwei Produktbilder zugleich. */
  function end({ view = 'discover', focus = true } = {}) {
    if (!active) return;
    active = false;
    if (video) video.pause();
    const pose = currentPose();
    const r = el.getBoundingClientRect();
    const media = { left: r.left, top: r.top, width: r.width, height: r.height, posY: MEDIA.posY[fmt] };
    const atEnd = shown === 'end';   // nur dann zeigt die scharfe Platte genau das letzte Videobild
    const reduced = reducedQuery.matches;
    // Fläche der Eröffnung festhalten: mobil wird die Bühne danach niedriger, das Bild bleibt stehen
    el.style.height = `${media.height}px`;
    document.body.classList.add('is-entering');
    document.body.classList.remove('is-opening');
    if (panel) panel.inert = false;
    if (stageEl) stageEl.inert = false;
    resume();
    onEnd && onEnd();
    // Nach dem Layoutwechsel die Kamera auf den passenden Bildausschnitt setzen, dann überblenden
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const st = getStage();
      const then = syncStage || null;
      const handed = !!(st && camData && pose && st.handoff(pose, camData.fovY, MEDIA.aspect[fmt], media, { end: atEnd, then }));
      // Ragt das Produkt im Videobild über die Bühne hinaus (Seitenleiste), kann das 3D-Bild dort nicht
      // deckungsgleich stehen: dann kurzer Schnitt über die Wand statt halb abgeschnittener Überblendung
      const cv = document.getElementById('scene').getBoundingClientRect();
      const b = handed && st.handoffBox;
      // Am Filmende steht die scharfe Platte bereit; dort erst bei deutlichem Überstand schneiden
      const tol = atEnd ? 40 : 6;
      const spills = !!b && ((b.right > cv.right + tol && media.left + media.width > cv.right + tol) || (b.left < cv.left - tol && media.left < cv.left - tol));
      if (!handed || spills) {
        document.body.classList.add('is-cut');
        if (!handed && then) then();
      }
      if (plate) {
        if (handed && atEnd && !spills && !reduced) {   // im Schnitt nur die weiche Platte (ohne Wandhalterung)
          placePlate(plate, media, MEDIA.aspect[fmt], MEDIA.posY[fmt]);
          plate.style.transition = 'none';   // liegt sofort unter dem ausblendenden Video
          plate.classList.add('is-on');
          void plate.offsetWidth;
          plate.style.transition = '';
          setTimeout(() => plate.classList.add('is-soft'), 450);
        } else {
          // Ohne deckungsgleiches Filmende sofort die weiche Platte: die scharfe zeigt das letzte Filmbild mit
          // Wandhalterung und Schatten und wäre sonst während des Überblendens als leere Halterung zu sehen
          const imgs = plate.querySelectorAll('img');
          imgs.forEach((i) => { i.style.transition = 'none'; });
          plate.classList.add('is-on', 'is-soft');
          void plate.offsetWidth;
          imgs.forEach((i) => { i.style.transition = ''; });
        }
      }
      el.classList.add('is-leaving');
      const fade = reduced ? 0 : 450;
      // Seitenleiste und Bedienung erst, wenn das Produkt auf seinem Weg in die Ansicht die Bühnenkante
      // freigegeben hat (bis dahin reicht das 3D-Bild unter die Seitenleiste, styles.css); höchstens 0,9 s
      const reveal = () => {
        document.body.classList.add('is-settling');
        document.body.classList.remove('is-entering', 'is-cut');
        setTimeout(() => document.body.classList.remove('is-settling'), 480);
      };
      setTimeout(() => {
        el.hidden = true;
        if (video) { video.removeAttribute('src'); video.load(); }   // Speicher freigeben
        const t0 = performance.now();
        const edge = stageEl ? stageEl.getBoundingClientRect().right : Infinity;
        const wait = () => {
          if (!handed || spills || reduced || performance.now() - t0 > 900 || st.screenBox().right <= edge + 2) reveal();
          else requestAnimationFrame(wait);
        };
        wait();
      }, fade);
      if (focus) {
        // Fokus auf die Bühne nur, wenn sie bedienbar ist; sonst auf „Erneut versuchen“ bzw. die Erklärung
        const canvas = document.getElementById('scene');
        const retry = document.getElementById('retryBtn');
        if (document.body.classList.contains('is-ready') && canvas) canvas.focus({ preventScroll: true });
        else if (retry && !retry.hidden) retry.focus({ preventScroll: true });
        else if (panel) panel.focus({ preventScroll: true });
      }
    }));
  }

  cta.addEventListener('click', () => end());
  document.addEventListener('keydown', (e) => { if (active && e.key === 'Escape') end(); });

  return { active: () => active, end };
}
