// Oberfläche: Ansichten, Panels aus den Produktdaten, Bedienung der Bühne.
import { STATUS, META, FINISH, COMPONENTS, DETAILS, CONNECTION, INSTALL_GUIDE, stepFor } from '../data/product.js?v=78787a72';
import { Stage, webglAvailable } from './stage.js?v=33856113';
import { initOpening } from './opening.js?v=41a317ad';

const MODEL_URL = 'assets/models/ecobum-home-prototype02-detail.glb';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Kleiner DOM-Helfer: h('p.klasse', {attr}, kinder...) */
function h(tag, attrs = {}, ...children) {
  const [name, ...classes] = tag.split('.');
  const el = document.createElement(name);
  if (classes.length) el.className = classes.join(' ');
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null) el.append(c);
  return el;
}

function directionIcon(kind = 'next') {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'control-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(NS, 'path');
  const paths = { next: 'M5 12h14m-6-6 6 6-6 6', expand: 'M5 12h14M12 5v14', play: 'm9 5 11 7-11 7Z', pause: 'M8 5v14M16 5v14', replay: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5' };
  path.setAttribute('d', paths[kind]);
  svg.append(path);
  return svg;
}

function infoIcon() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'notice__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', '12'); c.setAttribute('cy', '12'); c.setAttribute('r', '9');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', 'M12 11v6M12 7.5v.5');
  svg.append(c, p);
  return svg;
}

function statusTag(key) {
  const s = STATUS[key];
  return h(`span.tag.tag--${key}`, { title: s.description },
    h('span.tag__mark', { 'aria-hidden': 'true' }), s.label);
}

// Angaben mit Kennzeichnung; darunter die Bedeutung der vorkommenden Marken (Tooltips gibt es auf Touch nicht)
function factList(facts) {
  if (!facts || !facts.length) return null;
  const used = [...new Set(facts.map((f) => f.status))];
  return h('div.facts-wrap', {},
    h('dl.facts', {}, facts.map((f) => h('div.facts__row', {},
      h('dt', { text: f.label }),
      h('dd', {}, h('span.facts__value', { text: f.value }), statusTag(f.status))
    ))),
    h('p.tag-legend', {}, used.map((k) => h('span', {}, h('b', { text: `${STATUS[k].label}:` }), ` ${STATUS[k].description}`))));
}

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const state = { waterMode: 'spray', slowWater: false, lightAngle: 0, presentation: false, guided: false, chapter: 0, tour: false, view: 'discover', detail: 'overview', component: null, exploded: false, step: 0, stepChosen: false, lever: true, scenario: 'wc', compare: 'before', techOpen: false };
let stage = null;
let playbackTimer = 0;
let playbackActive = false;
let playbackFinished = false;
let playbackElapsed = 0;
let playbackStartedAt = 0;
let playbackHasStarted = false;
let playbackProgress = null;
let opening = { active: () => false, end: () => {} };

/* ------------------------------------------------------------------ Panels */
// Untereinander (schmal, hochkant) oder nebeneinander (ab 960 px und im flachen Querformat), wie styles.css
export const STACKED_MQ = '(max-width: 959px) and (orientation: portrait), (max-width: 959px) and (min-height: 600.02px), (max-width: 559.98px)';
const narrowQuery = window.matchMedia(STACKED_MQ);

// Element so scrollen, dass es nicht unter der festen Bühne (mobil) oder außerhalb
// des Panels (Desktop) liegt. Nutzt scroll-padding aus dem CSS.
function revealInPanel(el, block = 'nearest') {
  if (!el) return;
  const behavior = reducedQuery.matches ? 'auto' : 'smooth';
  el.scrollIntoView({ block, behavior });
}

// Gewähltes Bauteil samt Erklärung zeigen: nur scrollen, wenn es nicht vollständig sichtbar ist.
function revealItem(el) {
  const r = el.getBoundingClientRect();
  const top = narrowQuery.matches ? $('#stage').getBoundingClientRect().bottom : $('#panel').getBoundingClientRect().top;
  const bottom = narrowQuery.matches ? window.innerHeight : $('#panel').getBoundingClientRect().bottom;
  if (r.top >= top && r.bottom <= bottom) return;
  revealInPanel(el, 'start');
}


function streamIcon(mode) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'stream-icon'); svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', mode === 'spray' ? 'M8 4L4 20M12 4v16M16 4l4 16' : 'M9 4v16M12 4v16M15 4v16');
  svg.append(path); return svg;
}
function waterControls(context) {
  return h('div.water-choice', { 'data-water-controls': context },
    h('div.segmented', { role: 'group', 'aria-label': 'Strahlart wählen' },
      [['spray', 'Brausestrahl'], ['stream', 'Gebündelt']].map(([id, name]) =>
        h('button.segmented__btn', { type: 'button', 'data-spray-mode': id, 'aria-pressed': id === state.waterMode ? 'true' : 'false', onclick: () => {
          pausePresentationPlayback();
          state.waterMode = id; stage?.setWaterMode(id); updateWaterUI();
        } }, streamIcon(id), h('span', {}, name)))),
    h('p.water-choice__description', { 'data-water-description': '', 'aria-live': 'polite' }, 'Mehrere getrennte Wasserstrahlen.'),
    context !== 'discover' ? h('button.btn.btn--primary', { type: 'button', 'data-water-toggle': '', 'aria-pressed': 'false', onclick: toggleWater }, 'Wasser starten') : null,
    context === 'discover' ? h('button.btn.btn--quiet.water-choice__slow', {
      type: 'button', id: 'slowWater', 'aria-describedby': reducedQuery.matches ? 'motionNote' : null, 'aria-pressed': 'false', disabled: reducedQuery.matches,
      onclick: () => { state.slowWater = !state.slowWater; stage?.water?.setSpeed(state.slowWater ? .25 : 1); updateWaterUI(); },
    }, 'Zeitlupe · ¼') : null,
    h('p.water-choice__note', {}, 'Strahlbild illustrativ · keine Druck- oder Durchflussmessung.'));
}
function updateWaterUI() {
  const active = !!stage?.waterActive;
  $$('[data-spray-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sprayMode === state.waterMode)));
  $$('[data-water-description]').forEach(p => { p.textContent = state.waterMode === 'spray' ? 'Mehrere getrennte Wasserstrahlen.' : 'Ein zusammenhängender Wasserstrahl.'; });
  $$('[data-water-toggle]').forEach(b => { b.textContent = active ? 'Wasser stoppen' : 'Wasser starten'; b.setAttribute('aria-pressed', String(active)); });
  const btn = $('#waterBtn');
  btn.setAttribute('aria-label', active ? 'Wasser stoppen' : 'Wasser starten');
  btn.classList.toggle('is-active', active); btn.setAttribute('aria-pressed', String(active));
  btn.querySelector('.water__label').textContent = active ? 'Wasser stoppen' : 'Wasser starten';
  $('#sprayBadge').hidden = !active;
  $('#sprayBadge').textContent = reducedQuery.matches ? 'Reduzierte Bewegung · Standbild' : state.slowWater ? 'Zeitlupe · ¼ Tempo · illustrative Demo' : 'Illustrative Demo';
  const slow = $('#slowWater');
  if (slow) {
    slow.setAttribute('aria-pressed', String(state.slowWater));
    slow.textContent = 'Zeitlupe · ¼';
    slow.setAttribute('aria-label', state.slowWater ? 'Zeitlupe ausschalten' : 'Zeitlupe einschalten');
    slow.disabled = reducedQuery.matches;
    if (reducedQuery.matches) slow.setAttribute('aria-describedby', 'motionNote');
    else slow.removeAttribute('aria-describedby');
    $('#motionNote').hidden = !reducedQuery.matches;
  }
}
function toggleWater() {
  pausePresentationPlayback();
  if (!stage?.objects) return;
  if (stage.waterActive) stage.stopWater();
  else {
    if (!state.presentation) setDetail('spray');
    stage.setWaterMode(state.waterMode); stage.startWater(); hideHint();
  }
  updateWaterUI();
}

function inspectionTools() {
  return h('details.inspection', {},
    h('summary', {}, 'Oberfläche im Licht entdecken'),
    h('p', {}, 'Führe das Licht über den Kopf und den Griff. So werden Rundungen, Kanten und die feine Bürstung sichtbar.'),
    h('label.inspection__label', { for: 'inspectionLight' }, 'Licht drehen', h('output', { id: 'lightValue', for: 'inspectionLight', 'aria-live': 'off' }, `${Math.round(state.lightAngle)}°`)),
    h('input.inspection__range', { id: 'inspectionLight', type: 'range', min: '-60', max: '60', step: '1', value: String(Math.round(state.lightAngle)),
      oninput: e => stage?.setInspectionLight(Number(e.target.value)),
    }),
    h('div.inspection__actions', {},
      h('button.btn.btn--quiet', { id: 'lightStudy', type: 'button', disabled: reducedQuery.matches, onclick: () => stage?.playLightStudy() }, 'Lichtspiel ansehen'),
      h('button.btn.btn--quiet', { type: 'button', onclick: () => stage?.setInspectionLight(0) }, 'Licht zurücksetzen')),
    h('p.inspection__note', {}, 'Virtuelle Studiobeleuchtung. Die endgültige Oberfläche ist noch in Entwicklung.'));
}

function renderDiscover() {
  const root = $('#view-discover');
  const caption = h('div.detail-card', { id: 'detailCard', 'aria-live': 'polite' });
  const group = h('div.segmented.detail-options', { role: 'group', 'aria-label': 'Detailansicht wählen' },
    DETAILS.map((d) => h('button.segmented__btn', {
      type: 'button', 'data-detail': d.id, 'aria-pressed': d.id === state.detail ? 'true' : 'false',
      onclick: () => setDetail(d.id),
    }, d.name)));
  root.append(
    h('h2.panel__title', { text: 'Jedes Detail entdecken.' }),
    h('p.panel__text', {}, 'Drehe das Produkt, entdecke die Details oder lass dich durch Form und Bedienung führen.'),
    h('button.btn.btn--primary', { type: 'button', onclick: () => startPresentation({ guided: true }) }, 'Präsentation starten', directionIcon()),
    h('h3.panel__sub', { text: 'Detailansicht' }),
    group,
    caption,
    h('p.water-choice__note', { id: 'motionNote', hidden: !reducedQuery.matches }, 'Reduzierte Bewegung aktiv: Das Wasser wird als Standbild gezeigt. Die Zeitlupe ist deshalb ausgeschaltet.'),
    inspectionTools(),
    h('p.water-choice__note', {}, 'Brausestrahl oder gebündelt: Die Wasserbedienung findest du direkt an der 3D-Ansicht. Strahlbild illustrativ, keine Druck- oder Durchflussmessung.'),
    h('details.finish-details', {}, h('summary', {}, 'Oberfläche und Entwicklungsstand'),
    h('div.finish', {},
      h('span.finish__swatch', { style: `background:${FINISH.hex}`, 'aria-hidden': 'true' }),
      h('div', {},
        h('p.finish__name', {}, `${FINISH.name} `, h('span.finish__code', { text: FINISH.code })),
        h('p.finish__note', { text: FINISH.note }),
        statusTag(FINISH.status))
    )),
    h('div.discovery-next', {},
      h('p', { text: 'Vom einzelnen Handbidet zum Zusammenspiel aller fünf Teile.' }),
      h('button.btn.btn--light', { type: 'button', onclick: startSetTour }, 'Das Set kennenlernen', directionIcon()))
  );
  const dock = h('div.water-dock', { id: 'waterDock', 'aria-label': 'Wasser ausprobieren', role: 'group' }, waterControls('discover'));
  // On short screens keep controls in the reading area, leaving the 3D product room.
  const shortScreen = window.matchMedia('(max-height: 600px)');
  const placeWaterDock = () => {
    const focus = dock.contains(document.activeElement) ? document.activeElement : null;
    if (shortScreen.matches) root.prepend(dock);
    else $('#stageControls').before(dock);
    if (focus) focus.focus({ preventScroll: true });
    requestAnimationFrame(updateInsets);
  };
  placeWaterDock();
  shortScreen.addEventListener('change', placeWaterDock);
  $('#stageHint').after(h('button.btn.btn--light.detail-return', { id: 'detailReturn', type: 'button', hidden: true, onclick: () => {
    stage?.stopWater(); setDetail('overview'); $('#scene').focus({ preventScroll: true });
  } }, 'Zum ganzen Produkt'));
  updateDetailCard();
}

function updateDetailCard() {
  const d = DETAILS.find((x) => x.id === state.detail) || { title: 'Zwei Strahlarten', text: 'Brausestrahl und gebündelter Strahl nach dem Prototypvideo. Die Wasseranimation ist eine Illustration.' };
  const back = $('#detailReturn');
  if (back) back.hidden = state.detail === 'overview';
  document.body.classList.toggle('has-detail', state.detail !== 'overview');
  const card = $('#detailCard');
  card.replaceChildren(h('p.detail-card__title', { text: d.title }), h('p.detail-card__text', { text: d.text }));
  $$('[data-detail]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.detail === state.detail ? 'true' : 'false'));
}

function renderSet() {
  const root = $('#view-set');
  $('#stageControls').prepend(h('button.btn.btn--light.set-overview', {
    id: 'setOverview', type: 'button', hidden: true, onclick: () => {
      state.tour = false; setExploded(false); selectComponent(null, { reveal: false });
      $('#scene').focus({ preventScroll: true });
    },
  }, 'Ganzes Set'));
  const list = h('ul.parts', { 'aria-label': 'Bauteile des Sets' },
    COMPONENTS.map((c) => h('li.parts__item', { 'data-item': c.id },
      h('button.parts__btn', {
        type: 'button', 'data-component': c.id, 'aria-pressed': 'false', 'aria-expanded': 'false', 'aria-controls': 'partCard',
        onclick: () => selectComponent(state.component === c.id ? null : c.id),
      },
      h('span.parts__n', { text: String(c.number), 'aria-hidden': 'true' }),
      h('span.parts__text', {}, h('span.parts__name', { text: c.name }), h('span.parts__short', { text: c.short })), directionIcon('expand'))
    )));
  root.append(
    h('h2.panel__title', { id: 'setTitle', text: 'Fünf Teile. Ein Zusammenspiel.' }),
    h('div.set-intro', { id: 'setIntro' },
      h('p.panel__text', { text: 'Wähle ein Bauteil direkt im Bild oder erkunde die fünf Teile in einem kurzen Rundgang.' }),
      h('button.btn.btn--primary', { type: 'button', id: 'startSetTour', onclick: startSetTour }, 'Rundgang starten', directionIcon())),
    h('button.switch', { type: 'button', id: 'explodeBtn', 'aria-pressed': 'false', onclick: () => setExploded(!state.exploded) },
      h('span.switch__track', { 'aria-hidden': 'true' }, h('span.switch__thumb')),
      h('span', { text: 'Bauteile auseinanderziehen' })),
    list,
    h('div.part-card', { id: 'partCard', 'aria-live': 'polite', hidden: true }),
    h('section.set-tour', { id: 'setTour', hidden: true, 'aria-label': 'Geführter Set-Rundgang' },
      h('div.set-tour__top', {},
        h('p.set-tour__count', { id: 'tourCount' }),
        h('button.btn.btn--quiet', { type: 'button', id: 'endSetTour', onclick: () => endSetTour() }, 'Frei erkunden')),
      h('div.set-tour__progress', { id: 'tourProgress', role: 'progressbar', 'aria-label': 'Fortschritt im Set-Rundgang', 'aria-valuemin': '1', 'aria-valuemax': String(COMPONENTS.length) }, h('span', { 'aria-hidden': 'true' })),
      h('div.set-tour__copy', { id: 'tourCopy', 'aria-live': 'polite', 'aria-atomic': 'true' },
        h('h2.panel__title', { id: 'tourTitle', tabindex: '-1' }),
        h('p.set-tour__role', { id: 'tourRole' })),
      h('details.set-tour__facts', { id: 'tourFacts' },
        h('summary.step-more__summary', {}, 'Technische Angaben und Planungsstand'),
        h('div', { id: 'tourFactsBody' })),
      h('div.set-tour__nav', { role: 'group', 'aria-label': 'Teile im Rundgang wechseln' },
        h('button.btn.btn--light', { type: 'button', id: 'tourPrev', onclick: () => moveSetTour(-1) }, 'Zurück'),
        h('button.btn.btn--primary', { type: 'button', id: 'tourNext', onclick: () => moveSetTour(1) }, 'Weiter')))

  );
  updatePartCard();
}

// Die Erklärung erscheint direkt unter dem gewählten Bauteil.
function updatePartCard({ reveal = false } = {}) {
  const card = $('#partCard');
  const c = COMPONENTS.find((x) => x.id === state.component);
  updateTourVisibility();
  updateSetOverview();
  $$('[data-component]').forEach((b) => {
    const on = b.dataset.component === state.component;
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-expanded', String(on && !state.tour));
  });
  if (state.tour && c) {
    card.hidden = true;
    updateSetTour(c);
    return;
  }
  if (!c) {
    card.hidden = true;
    $('#view-set').append(card);
    return;
  }
  const nextPart = COMPONENTS[COMPONENTS.indexOf(c) + 1];
  card.replaceChildren(
    h('p.part-card__text', { text: c.role }),
    h('details.part-card__facts', {}, h('summary.step-more__summary', {}, 'Details und Planungsstand'), factList(c.facts)),
    h('div.part-card__actions', {},
      h('button.btn.btn--quiet', { type: 'button', onclick: () => { const id = state.component; selectComponent(null); $(`[data-component="${id}"]`).focus({ preventScroll: true }); } }, 'Ganzes Set'),
      h('button.btn.btn--quiet', { type: 'button', onclick: () => {
        if (nextPart) {
          selectComponent(nextPart.id);
          $(`[data-component="${nextPart.id}"]`).focus({ preventScroll: true });
        } else setView('connect', { focusPanel: true });
      } }, nextPart ? nextPart.name : 'Anschluss verstehen', directionIcon()))
  );
  $(`[data-item="${c.id}"]`).append(card);
  card.hidden = false;
  if (reveal) requestAnimationFrame(() => revealItem($(`[data-item="${c.id}"]`)));
}


// Optionaler Rundgang in derselben Szene. Kein Autoplay: der Besucher bestimmt jeden Schritt.
function updateTourVisibility() {
  const touring = state.tour;
  document.body.classList.toggle('is-set-tour', touring && state.view === 'set');
  $('#setTour').hidden = !touring;
  for (const el of [$('#setTitle'), $('#setIntro'), $('#explodeBtn'), $('#view-set .parts')]) el.hidden = touring;
}

function updateSetTour(c) {
  const i = COMPONENTS.findIndex((part) => part.id === c.id);
  $('#tourCount').textContent = `Teil ${i + 1} von ${COMPONENTS.length}`;
  $('#tourTitle').textContent = c.name;
  $('#tourRole').textContent = c.role;
  $('#tourProgress').setAttribute('aria-valuenow', String(i + 1));
  $('#tourProgress').setAttribute('aria-valuetext', `Teil ${i + 1} von ${COMPONENTS.length}: ${c.name}`);
  $('#tourProgress').style.setProperty('--tour-progress', (i + 1) / COMPONENTS.length);
  $('#tourFacts').open = false;
  $('#tourFactsBody').replaceChildren(...[factList(c.facts)].filter(Boolean));
  $('#tourFacts').hidden = !c.facts?.length;
  const prev = $('#tourPrev'), next = $('#tourNext');
  const first = i === 0, last = i === COMPONENTS.length - 1;
  prev.disabled = first;
  prev.setAttribute('aria-label', first ? 'Zurück' : `Zurück zu ${COMPONENTS[i - 1].name}`);
  next.textContent = last ? 'Anschluss ansehen' : 'Weiter';
  next.setAttribute('aria-label', last ? 'Anschluss ansehen' : `Weiter zu ${COMPONENTS[i + 1].name}`);
  if (first && document.activeElement === prev) next.focus({ preventScroll: true });
  const copy = $('#tourCopy');
  copy.getAnimations().forEach((a) => a.cancel());
  if (!reducedQuery.matches) copy.animate(
    [{ opacity: 0.45, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 280, easing: 'cubic-bezier(.22,.61,.24,1)' });
}

function revealSetTour() {
  const top = $('#tourCount');
  const limit = narrowQuery.matches ? $('#stage').getBoundingClientRect().bottom : $('#panel').getBoundingClientRect().top;
  const nav = $('#setTour .set-tour__nav').getBoundingClientRect().top;
  const r = top.getBoundingClientRect();
  if (r.top < limit || $('#tourRole').getBoundingClientRect().top + 24 > nav) top.scrollIntoView({ block: 'start', behavior: 'auto' });
}

function startSetTour() {
  setView('set');
  setExploded(false);
  state.tour = true;
  selectComponent(COMPONENTS[0].id, { reveal: false });
  requestAnimationFrame(() => {
    revealSetTour();
    $('#tourTitle').focus({ preventScroll: true });
  });
}

function moveSetTour(delta) {
  const index = COMPONENTS.findIndex((c) => c.id === state.component);
  if (index + delta >= COMPONENTS.length) {
    endSetTour({ connect: true });
    return;
  }
  const next = Math.max(0, index + delta);
  selectComponent(COMPONENTS[next].id, { reveal: false });
  requestAnimationFrame(revealSetTour);
}

function endSetTour({ connect = false } = {}) {
  state.tour = false;
  selectComponent(null, { reveal: false });
  if (connect) {
    setView('connect');
    // Ein neuer Rundgang endet am Anfang der Erklärung; normale Reiter-Rückkehr behält ihren Schritt.
    setStep(0);
    $('#panel').focus({ preventScroll: true });
  } else {
    $('#startSetTour').focus({ preventScroll: true });
    revealInPanel($('#setTitle'), 'start');
  }
}

// Vier bewusst selbst gewählte Perspektiven. Bestehende 3D-Szene, keine zweite Render-Schleife.
const CHAPTERS = [
  { label: 'Form', title: 'Wasser. In deiner Hand.', text: 'Entdecke EcoBum Home: eine klare Form, zwei Strahlarten und ein Druckknopf für Ein und Aus.', view: 'discover', detail: 'overview', next: 'Wasser erleben' },
  { label: 'Wasser', title: 'Ein Dreh. Zwei Strahlarten.', text: 'Einzelne Strahlen oder ein gebündelter Wasserstrahl. Starte die Demo und entdecke den Unterschied.', view: 'discover', detail: 'spray', next: 'Zum Druckknopf', water: true },
  { label: 'Knopf', title: 'Ein Druck. Wasser an.', text: 'Noch einmal drücken: Wasser aus. Erlebe den hinteren Druckknopf in der Nahansicht.', view: 'discover', detail: 'button', next: 'Zum Set', water: true },
  { label: 'Set', title: 'Fünf Teile. Ein Zusammenspiel.', text: 'Vom Handbidet bis zum flexiblen Anschlussschlauch: Entdecke, wie das geplante Set zusammengehört. Passung und Anschlüsse sind noch in Prüfung.', view: 'set', next: 'Set erkunden' },
];

// One finite, opt-in sequence. Existing cameras do the work; no extra animation loop.
const PRESENTATION_CHAPTER_MS = 4000;
function chapterElapsed() {
  return Math.min(PRESENTATION_CHAPTER_MS, playbackElapsed + (playbackActive ? performance.now() - playbackStartedAt : 0));
}
function updatePresentationProgress() {
  playbackProgress?.cancel();
  playbackProgress = null;
  const elapsed = chapterElapsed();
  $$('[data-chapter-progress]').forEach(track => {
    const index = Number(track.dataset.chapterProgress);
    const progress = playbackFinished || index < state.chapter ? 1 : index === state.chapter ? elapsed / PRESENTATION_CHAPTER_MS : 0;
    track.style.transform = `scaleX(${progress})`;
    if (index === state.chapter && playbackActive && !reducedQuery.matches && !document.hidden && state.presentation && track.animate) {
      playbackProgress = track.animate([
        { transform: `scaleX(${progress})` }, { transform: 'scaleX(1)' },
      ], { duration: Math.max(0, PRESENTATION_CHAPTER_MS - elapsed), easing: 'linear', fill: 'forwards' });
    }
  });
}
function updatePresentationPlayback() {
  const button = $('#presentationPlay');
  if (!button) return;
  const label = playbackActive ? 'Pause' : playbackFinished ? 'Erneut abspielen' : playbackHasStarted ? 'Weiterlaufen' : 'Einspieler starten';
  button.replaceChildren(directionIcon(playbackActive ? 'pause' : playbackFinished ? 'replay' : 'play'), h('span', {}, label));
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(playbackActive));
  button.disabled = reducedQuery.matches;
  $('#presentationPosition').textContent = `${String(state.chapter + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')} · ${CHAPTERS[state.chapter].label}`;
  $('#presentationTempo').textContent = reducedQuery.matches ? 'Reduzierte Bewegung · Kapitel einzeln wählen' : playbackFinished ? 'Alle vier Perspektiven entdeckt. Erkunde jetzt das Set.' : playbackActive ? '4 Perspektiven · ca. 16 Sekunden' : playbackHasStarted ? 'Pausiert. Weiterlaufen setzt genau hier fort.' : 'In deinem Tempo oder als kurzer Einspieler';
  $('#presentation').classList.toggle('is-playing', playbackActive);
  updatePresentationProgress();
}
function pausePresentationPlayback() {
  if (playbackActive) playbackElapsed = chapterElapsed();
  clearTimeout(playbackTimer);
  playbackTimer = 0;
  playbackActive = false;
  updatePresentationPlayback();
}
function handleStageInteraction() {
  pausePresentationPlayback();
  hideHint();
}
function schedulePresentationChapter() {
  clearTimeout(playbackTimer);
  playbackTimer = window.setTimeout(() => {
    playbackTimer = 0;
    if (!playbackActive || !state.presentation || document.hidden || reducedQuery.matches) {
      pausePresentationPlayback(); return;
    }
    if (state.chapter >= CHAPTERS.length - 1) {
      playbackFinished = true; pausePresentationPlayback(); return;
    }
    playbackElapsed = 0;
    playbackStartedAt = performance.now();
    setChapter(state.chapter + 1, { playback: true });
    updatePresentationPlayback();
    schedulePresentationChapter();
  }, Math.max(0, PRESENTATION_CHAPTER_MS - playbackElapsed));
}
function togglePresentationPlayback() {
  if (playbackActive) { pausePresentationPlayback(); return; }
  if (reducedQuery.matches || document.hidden || !state.presentation) return;
  // Resuming must preserve the visitor's current camera and the remaining chapter time.
  if (!playbackHasStarted || playbackFinished) {
    state.guided = true;
    const chapter = playbackFinished ? 0 : state.chapter;
    playbackElapsed = 0;
    playbackFinished = false;
    setChapter(chapter, { playback: true });
  }
  playbackHasStarted = true;
  playbackActive = true;
  playbackStartedAt = performance.now();
  updatePresentationPlayback();
  schedulePresentationChapter();
}

function renderPresentation() {
  $('#stage').append(h('section.presentation', { id: 'presentation', hidden: true, 'aria-label': 'Produktpräsentation' },
    h('div.presentation__playback', {},
      h('button.btn.btn--light', { id: 'presentationPlay', type: 'button', 'aria-pressed': 'false', 'aria-describedby': 'presentationTempo', onclick: togglePresentationPlayback }, 'Einspieler starten'),
      h('div.presentation__playback-info', {},
        h('p.presentation__position', { id: 'presentationPosition', 'aria-live': 'off' }),
        h('p', { id: 'presentationTempo' }))),
    h('button.btn.btn--light.presentation__exit', { type: 'button', onclick: () => endPresentation() }, 'Frei erkunden'),
    h('div.presentation__copy', { id: 'presentationCopy', 'aria-live': 'polite', 'aria-atomic': 'true' },
      h('h2', { id: 'presentationTitle', tabindex: '-1' }), h('p', { id: 'presentationText' }),
      h('div', { id: 'presentationWater', hidden: true }, waterControls('presentation')),
      h('button.btn.btn--quiet.presentation__connection', { id: 'presentationConnection', type: 'button', hidden: true, onclick: () => {
        endPresentation(); setView('connect');
        requestAnimationFrame(() => $('#panel').focus({ preventScroll: true }));
      } }, 'Wie passt es in mein Bad?')),
    h('nav.presentation__nav', { 'aria-label': 'Präsentationskapitel' },
      h('div.presentation__routes', { id: 'entryRoutes', hidden: true, role: 'group', 'aria-label': 'Dein Einstieg' },
        h('button.btn.btn--primary', { type: 'button', onclick: () => enterExperience('product') }, 'Produkt entdecken'),
        h('button.btn.btn--light', { type: 'button', onclick: () => enterExperience('water') }, 'Wasser ausprobieren'),
        h('button.btn.btn--quiet', { type: 'button', onclick: () => enterExperience('connect') }, 'Anschlussmöglichkeiten ansehen')),
      h('div.presentation__chapters', {}, CHAPTERS.map((c, i) => h('button.presentation__chapter', {
        type: 'button', 'data-chapter': i, 'aria-label': `Kapitel ${i + 1}: ${c.label}`, onclick: () => setChapter(i),
      }, h('span.presentation__chapter-number', { 'aria-hidden': 'true', text: String(i + 1).padStart(2, '0') }), c.label,
        h('span.presentation__chapter-track', { 'aria-hidden': 'true' }, h('span.presentation__chapter-progress', { 'data-chapter-progress': i }))))),
      h('div.presentation__actions', {},
        h('button.btn.btn--quiet', { id: 'presentationPrev', type: 'button', onclick: () => setChapter(state.chapter - 1) }, 'Zurück'),
        h('button.btn.btn--primary', { id: 'presentationNext', type: 'button', onclick: () => state.chapter === CHAPTERS.length - 1 ? endPresentation({ tour: true }) : setChapter(state.chapter + 1) }))),
    h('p.presentation__note', { text: 'Gestaltungsprototyp · Ausführung und Anschlüsse in Entwicklung.' })));

  updatePresentationPlayback();
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausePresentationPlayback(); });
  window.addEventListener('pagehide', pausePresentationPlayback);
  document.addEventListener('keydown', (e) => {
    if (state.presentation && e.key === 'Escape') { e.preventDefault(); endPresentation(); }
  });
}

function startPresentation({ fromOpening = false, guided = false } = {}) {
  pausePresentationPlayback();
  playbackFinished = false;
  playbackElapsed = 0;
  playbackHasStarted = false;
  if (document.body.classList.contains('no-3d') || $('#stageState')?.dataset.kind === 'error') return;
  if (state.tour) endSetTour();
  state.slowWater = false;
  stage?.water?.setSpeed(1);
  stage?.setInspectionLight(0);
  updateWaterUI();
  state.presentation = true;
  state.guided = guided;
  document.body.classList.add('is-presentation');
  $('#presentation').hidden = false;
  $('#panel').inert = true;
  $('#stageLabels').inert = true;
  stage?.stopWater();
  setChapter(0, { sync: !fromOpening });
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => {
    updateInsets();
    if (!fromOpening && document.activeElement !== document.body) $('#presentationTitle').focus({ preventScroll: true });
  });
}

function setChapter(index, { sync = true, playback = false } = {}) {
  if (!playback) {
    pausePresentationPlayback();
    playbackFinished = false; playbackHasStarted = false; playbackElapsed = 0;
  }
  const returnToTop = window.scrollY > 0;
  const focusReading = !!document.activeElement?.closest('.presentation__nav');
  state.chapter = Math.max(0, Math.min(CHAPTERS.length - 1, index));
  const c = CHAPTERS[state.chapter];
  updatePresentationPlayback();
  stage?.stopWater();
  $('#presentationWater').hidden = !c.water;
  $('#presentationConnection').hidden = c.view !== 'set';
  document.body.classList.toggle('is-entry', !state.guided && state.chapter === 0);
  $('#entryRoutes').hidden = state.guided || state.chapter !== 0;
  document.body.classList.toggle('has-water-chapter', !!c.water);
  document.body.classList.toggle('has-button-chapter', c.detail === 'button');
  $('#presentationTitle').textContent = c.title;
  $('#presentationText').textContent = c.text;
  const prev = $('#presentationPrev');
  prev.disabled = state.chapter === 0;
  $('#presentationNext').textContent = c.next;
  if (prev.disabled && document.activeElement === prev) $('#presentationNext').focus({ preventScroll: true });
  $$('[data-chapter]').forEach((b) => b.setAttribute('aria-current', Number(b.dataset.chapter) === state.chapter ? 'step' : 'false'));
  setView(c.view, { syncStageNow: false });
  state.detail = c.detail || 'overview';
  updateDetailCard();
  if (sync) { updateInsets(); syncStage(); }
  if (returnToTop && !playback) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focusReading) $('#presentationTitle').focus({ preventScroll: true });
  }
  const copy = $('#presentationCopy');
  copy.getAnimations().forEach((a) => a.cancel());
  if (!reducedQuery.matches) copy.animate([
    { opacity: .25, translate: '0 12px' },
    { opacity: 1, translate: '0 0' },
  ], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' });
}

function endPresentation({ tour = false, after = null } = {}) {
  pausePresentationPlayback();
  state.presentation = false;
  document.body.classList.remove('is-presentation', 'has-water-chapter', 'has-button-chapter', 'is-entry');
  stage?.stopWater();
  $('#presentation').hidden = true;
  $('#panel').inert = false;
  $('#stageLabels').inert = false;
  requestAnimationFrame(() => {
    updateInsets(); syncStage();
    if (after) after();
    else if (tour) startSetTour();
    else $('#panel').focus({ preventScroll: true });
  });
}

function enterExperience(route) {
  endPresentation({ after: () => {
    setView(route === 'connect' ? 'connect' : 'discover');
    if (route === 'water') {
      setDetail('spray');
      stage?.setWaterMode(state.waterMode);
      stage?.startWater();
      hideHint();
      updateWaterUI();
      $('#waterBtn').focus({ preventScroll: true });
    } else if (route === 'product') {
      setDetail('overview');
      $('#scene').focus({ preventScroll: true });
    } else $('#panel').focus({ preventScroll: true });
    if (narrowQuery.matches) window.scrollTo({ top: $('.topbar').offsetHeight, behavior: 'auto' });
  } });
}

/* Anschluss verstehen: der aktuelle Schritt zuerst (Titel, kurze Erklärung, hervorgehobene Verbindung),
 * technische Angaben und die Übersicht aller Schritte aufklappbar. Der Entwicklungshinweis bleibt
 * sichtbar, aber als eine kompakte Zeile. */
function renderConnect() {
  const root = $('#view-connect');
  const steps = CONNECTION.steps;
  const overview = h('ol.steps-all__list', {},
    steps.map((s, i) => h('li', {}, h('button.steps-all__btn', {
      type: 'button', 'data-step': String(i), onclick: () => {
        setStep(i);
        // Übersicht schließt nach der Wahl; Fokus bleibt auf ihrem Titel (das gewählte Element verschwindet)
        const d = $('#stepsAll');
        d.open = false;
        d.querySelector('summary').focus({ preventScroll: true });
        revealInPanel($('#stepCount'), 'start');
      },
    }, h('span.steps-all__n', { text: String(i + 1), 'aria-hidden': 'true' }), h('span.steps-all__title', { 'data-step-title': String(i) })))));
  const tech = h('details.step-more', { id: 'stepMore' },
    h('summary.step-more__summary', {}, h('span', { id: 'stepMoreLabel', text: 'Technische Angaben' })),
    h('div.step-more__body', { id: 'stepMoreBody' }));
  tech.addEventListener('toggle', () => { state.techOpen = tech.open; });
  root.append(
    h('p.dev-note', { role: 'note' }, infoIcon(), h('span', { text: CONNECTION.notice })),
    h('h2.visually-hidden', { text: 'Geplantes Anschlussprinzip in Schritten' }),
    h('div.segmented.segmented--2', { role: 'group', 'aria-label': 'Badsituation wählen' },
      CONNECTION.scenarios.map((sc) => h('button.segmented__btn', {
        type: 'button', 'data-scenario': sc.id, 'aria-pressed': sc.id === state.scenario ? 'true' : 'false',
        onclick: () => setScenario(sc.id),
      }, sc.label))),
    h('div.stepper', { id: 'stepper' },
      h('p.stepper__count', { id: 'stepCount' }),
      h('div.stepper__progress', { 'aria-hidden': 'true' }, h('span', { id: 'connectionProgress' })),
      h('div.step-card', { id: 'stepCard', 'aria-live': 'polite' })),
    tech,
    h('details.steps-all', { id: 'stepsAll' },
      h('summary.step-more__summary', {}, 'Alle Schritte im Überblick'),
      overview),
    // Vor/Zurück bleibt am unteren Rand erreichbar (CSS: position sticky)
    h('div.stepper__nav', { role: 'group', 'aria-label': 'Schritte blättern' },
      h('button.btn.btn--light', { type: 'button', id: 'prevStep', onclick: () => setStep(state.step - 1) }, '← Zurück'),
      h('span.stepper__pos', { id: 'stepPos', 'aria-hidden': 'true' }),
      h('button.btn.btn--primary', { type: 'button', id: 'nextStep', onclick: () => setStep(state.step + 1) }, 'Weiter →'))
  );
  updateScenarioNote();
  updateStepCard();
}

function updateScenarioNote() {
  $$('[data-scenario]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.scenario === state.scenario ? 'true' : 'false'));
}

function compareLabel() {
  return state.compare === 'before'
    ? 'Bestehende Installation ohne Set (Beispiel)'
    : (state.scenario === 'wc' ? 'Mit Pudado-Set bei passender Installation – geplantes Konzept' : 'Mit T-Ventil – zu prüfendes Konzept');
}

// Fokus innerhalb eines neu aufgebauten Bereichs auf das entsprechende neue Element zurücksetzen
function keepFocus(container, rebuild) {
  const a = document.activeElement;
  const key = a && container.contains(a)
    ? (a.dataset.compare ? `[data-compare="${a.dataset.compare}"]` : a.id ? `#${a.id}` : null)
    : null;
  rebuild();
  if (key) { const el = container.querySelector(key); if (el) el.focus({ preventScroll: true }); }
}

function updateStepCard() {
  const steps = CONNECTION.steps;
  const s = stepFor(steps[state.step], state.scenario);
  const sc = CONNECTION.scenarios.find((x) => x.id === state.scenario);
  $('#stepCount').replaceChildren(
    h('span', { text: `Schritt ${state.step + 1} von ${steps.length}` }),
    statusTag(sc.status));
  $('#stepPos').textContent = `${state.step + 1} / ${steps.length}`;
  $('#connectionProgress').style.transform = `scaleX(${(state.step + 1) / steps.length})`;
  const card = $('#stepCard');
  const inlineFacts = s.id === 'open';   // „Was noch offen ist“: die Liste ist die Erklärung
  keepFocus(card, () => {
    // Reihenfolge: Titel, Erklärung, dann der Schalter des Schritts (die Erklärung hat Vorrang)
    const children = [h('h3.step-card__title', { text: s.title }), h('p.step-card__text', { text: s.text })];
    if (s.compare) {
      children.push(h('div.segmented.segmented--2', { role: 'group', 'aria-label': 'Vorher oder nachher anzeigen' },
        [['before', 'Vorher'], ['after', 'Nachher']].map(([id, name]) => h('button.segmented__btn', {
          type: 'button', 'data-compare': id, 'aria-pressed': state.compare === id ? 'true' : 'false',
          onclick: () => setCompare(id),
        }, name))),
      h('p.scenario__note', { id: 'compareNote', 'aria-live': 'polite', text: compareLabel() }));
    }
    if (s.lever) {
      children.push(h('button.switch', {
        type: 'button', id: 'leverBtn', 'aria-pressed': state.lever ? 'true' : 'false',
        onclick: () => setLever(!state.lever),
      }, h('span.switch__track', { 'aria-hidden': 'true' }, h('span.switch__thumb')),
      h('span', { id: 'leverLabel', text: state.lever ? 'Abzweig offen' : 'Abzweig geschlossen' })));
    }
    if (inlineFacts) children.push(factList(s.facts));
    card.replaceChildren(...children.filter(Boolean));
  });
  // Technische Angaben: Badsituation mit Status und die Angaben des Schritts, für Fachgespräche
  const facts = inlineFacts ? [] : (s.facts || []);
  $('#stepMoreLabel').textContent = `Technische Angaben (${facts.length})`;
  $('#stepMore').hidden = !facts.length;   // ohne Angaben kein leerer Aufklapper
  $('#stepMoreBody').replaceChildren(...[
    h('p.scenario__note', {}, statusTag(sc.status), h('span', { text: sc.note })),
    factList(facts)].filter(Boolean));
  $('#stepMore').open = state.techOpen;
  const focused = document.activeElement;
  $('#prevStep').disabled = state.step === 0;
  $('#nextStep').disabled = state.step === steps.length - 1;
  // Wird der fokussierte Knopf am Ende der Folge gesperrt, wandert der Fokus zum Gegenstück
  if (focused && focused.disabled && (focused.id === 'nextStep' || focused.id === 'prevStep')) {
    (focused.id === 'nextStep' ? $('#prevStep') : $('#nextStep')).focus({ preventScroll: true });
  }
  const next = steps[state.step + 1];
  $('#nextStep').setAttribute('aria-label', next ? `Weiter zu Schritt ${state.step + 2}: ${stepFor(next, state.scenario).title}` : 'Weiter');
  const prev = steps[state.step - 1];
  $('#prevStep').setAttribute('aria-label', prev ? `Zurück zu Schritt ${state.step}: ${stepFor(prev, state.scenario).title}` : 'Zurück');
  $$('[data-step]').forEach((b) => {
    const i = Number(b.dataset.step);
    b.setAttribute('aria-current', i === state.step ? 'step' : 'false');
    b.querySelector('[data-step-title]').textContent = stepFor(steps[i], state.scenario).title;
  });
}

// Ausführliche Hintergrundinformationen gebündelt in einem aufklappbaren Bereich
function renderMore() {
  $('#legendList').replaceChildren(...Object.entries(STATUS).map(([k, s]) =>
    h('li', {}, statusTag(k), h('span.legend__desc', { text: s.description }))));
  $('#moreNotes').replaceChildren(
    h('li', { text: META.disclaimer }),
    h('li', { text: 'Das Set zeigt die äußere Form; innere Bauteile sind nicht dargestellt. Die Halterung hängt an einer neutralen Wand, die Schläuche sind verkürzt dargestellt; Anordnung und Längen sind nicht maßstäblich.' }),
    h('li', { text: CONNECTION.intro }),
    INSTALL_GUIDE ? null : h('li', { text: 'Eine geprüfte Montageanleitung wird nach Herstellerfreigabe ergänzt.' })
  );
}

/* ------------------------------------------------------------------ Zustand */
function setView(view, { focusPanel = false, syncStageNow = true } = {}) {
  if (state.view === view) return;
  if (state.tour && view !== 'set') {
    state.tour = false;
    updateTourVisibility();
  }
  state.view = view;
  document.body.dataset.view = view;
  updateSetOverview();
  $$('.views__tab').forEach((t) => {
    const on = t.dataset.view === view;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  $$('.panel__view').forEach((p) => { p.hidden = p.dataset.view !== view; });
  // Neuer Inhalt beginnt oben: Panel (Desktop) bzw. Seite (mobil) zurücksetzen. Rückkehr zu einem
  // gewählten Schritt: liegen Schrittanzeige oder Erklärungsbeginn außerhalb des Lesebereichs, die
  // Schrittanzeige an dessen Anfang holen (scroll-padding); Hinweis und Variantenwahl bleiben darüber
  const back = view === 'connect' && state.stepChosen ? $('#stepCount') : null;
  const place = () => {
    if (!back) return;
    const limit = narrowQuery.matches ? $('#stage').getBoundingClientRect().bottom : $('#panel').getBoundingClientRect().top;
    const navTop = $('#view-connect .stepper__nav').getBoundingClientRect().top;
    const text = $('#stepCard .step-card__text').getBoundingClientRect();
    if (back.getBoundingClientRect().top < limit - 1 || text.top + 20 > navTop) back.scrollIntoView({ block: 'start', behavior: 'auto' });
  };
  $('#panel').scrollTop = 0;
  // mobil: Kopfzeile ausblenden, damit Tabs, Bühne und Erklärung den Platz bekommen
  if (narrowQuery.matches && !state.presentation) {
    const top = $('.topbar').offsetHeight;
    window.scrollTo({ top, behavior: 'auto' });
    place();
    requestAnimationFrame(() => { window.scrollTo({ top, behavior: 'auto' }); place(); });   // nach Höhenwechsel der Bühne
  } else place();
  if (view === 'set') {
    state.component = null;
    state.exploded = false;
    $('#explodeBtn').setAttribute('aria-pressed', 'false');
    updatePartCard();
  }
  if (view === 'discover') {
    state.detail = 'overview';
    updateDetailCard();
  }
  if (syncStageNow) syncStage();
  requestAnimationFrame(updateInsets);
  if (focusPanel) $('#panel').focus({ preventScroll: true });
}

// Bühne auf die gewählte Ansicht bringen (auch nachträglich: nach dem Laden oder nach der Übergabe)
function syncStage() {
  if (!stage || !stage.objects) return;
  updateInsets();   // neue Bühnenhöhe und Bedienleiste vor dem Kameraflug berücksichtigen
  if (stage.view !== state.view) stage.setView(state.view);
  if (state.presentation && state.view === 'discover') stage.setDetail(CHAPTERS[state.chapter].detail);
  if (state.view === 'set') {
    stage.setExploded(state.exploded);
    stage.selectComponent(state.component);
  }
  if (state.view === 'connect') {
    stage.setScenario(state.scenario);
    stage.setLever(state.lever, true);
    stage.setStep(stepFor(CONNECTION.steps[state.step], state.scenario));
    if (CONNECTION.steps[state.step].compare) stage.setCompare(state.compare);
  }
}

function setDetail(id) {
  state.detail = id;
  updateDetailCard();
  updateInsets();
  stage && stage.setDetail(id);
}

function selectComponent(id, { reveal = true } = {}) {
  if (!id && state.tour) state.tour = false;
  state.component = id;
  updatePartCard({ reveal: reveal && !state.tour });
  stage && stage.selectComponent(id);
}

function updateSetOverview() {
  const button = $('#setOverview');
  if (button) button.hidden = state.view !== 'set' || (!state.component && !state.exploded);
  requestAnimationFrame(updateInsets);
}

function setExploded(on) {
  state.exploded = on;
  updateSetOverview();
  $('#explodeBtn').setAttribute('aria-pressed', on ? 'true' : 'false');
  stage && stage.setExploded(on);
}

function setStep(i) {
  const n = CONNECTION.steps.length;
  const prev = state.step;
  state.step = Math.max(0, Math.min(n - 1, i));
  state.stepChosen = true;
  if (CONNECTION.steps[state.step].compare && prev !== state.step) state.compare = 'before';
  updateStepCard();
  // Neue Schritterklärung sichtbar machen, falls weggescrollt
  const head = $('#stepCount');
  const hr = head.getBoundingClientRect();
  const limit = narrowQuery.matches ? $('#stage').getBoundingClientRect().bottom : $('#panel').getBoundingClientRect().top;
  const navTop = $('#view-connect .stepper__nav').getBoundingClientRect().top;
  // Neuer Schritt oberhalb des sichtbaren Bereichs oder unter der Schrittleiste: an den Anfang holen
  // maßgeblich ist der Schalter des Schritts (Vorher/Nachher, Hebel), sonst die Erklärung
  const last = $('#stepCard [data-compare], #leverBtn') || $('#stepCard .step-card__text');
  // sofort (nicht weich): schnelle Folgeklicks messen sonst mitten in der laufenden Bewegung
  if (hr.top < limit || (last && last.getBoundingClientRect().bottom > navTop - 8)) {
    head.scrollIntoView({ block: 'start', behavior: 'auto' });
    // Fehlt dem Schalter danach ein Stück, höchstens bis zur Oberkante nachschieben: Schrittzähler bleibt im Bild
    const miss = last.getBoundingClientRect().bottom - (navTop - 8);
    const room = head.getBoundingClientRect().top - limit;
    const nudge = Math.min(miss, room);
    if (nudge > 0) (narrowQuery.matches ? window : $('#panel')).scrollBy({ top: nudge, behavior: 'auto' });
  }
  if (stage) {
    stage.setStep(stepFor(CONNECTION.steps[state.step], state.scenario));
    if (CONNECTION.steps[state.step].compare) stage.setCompare(state.compare);
  }
}

function setScenario(id) {
  if (state.scenario === id) return;
  state.scenario = id;
  updateScenarioNote();
  updateStepCard();
  if (stage) {
    stage.setScenario(id);
    stage.setStep(stepFor(CONNECTION.steps[state.step], state.scenario));
    if (CONNECTION.steps[state.step].compare) stage.setCompare(state.compare);
  }
}

function setCompare(mode) {
  state.compare = mode;
  $$('[data-compare]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.compare === mode ? 'true' : 'false'));
  const note = $('#compareNote');
  if (note) note.textContent = compareLabel();
  stage && stage.setCompare(mode);
}

function setLever(open) {
  state.lever = open;
  const b = $('#leverBtn');
  if (b) {
    b.setAttribute('aria-pressed', open ? 'true' : 'false');
    $('#leverLabel').textContent = open ? 'Abzweig offen' : 'Abzweig geschlossen';
  }
  stage && stage.setLever(open);
}

/* ------------------------------------------------------------- Bedienung */
function bindTabs() {
  const tabs = $$('.views__tab');
  // Eine Ansicht wählen beendet die Eröffnung: Die Bühne übernimmt die Videokamera und fährt von dort in
  // die gewählte Ansicht; die Seitenleiste zeigt sofort deren Inhalt
  const choose = (view) => {
    pausePresentationPlayback();
    if (opening.active()) { opening.end({ view, focus: false }); setView(view, { syncStageNow: false }); }
    else setView(view);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => choose(t.dataset.view));
    t.addEventListener('keydown', (e) => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j != null) {
        e.preventDefault();
        tabs[j].focus();
        choose(tabs[j].dataset.view);
      }
    });
  });
}

function bindStageTools() {
  $('#resetBtn').addEventListener('click', () => {
    handleStageInteraction();
    if (state.view === 'discover' && state.detail !== 'overview') setDetail('overview');
    else stage && stage.resetView();
  });
  $$('.stage__tools [data-action]').forEach((b) => b.addEventListener('click', () => {
    if (!stage) return;
    handleStageInteraction();
    const a = b.dataset.action;
    if (a === 'zoom-in') stage.zoomBy(0.8);
    if (a === 'zoom-out') stage.zoomBy(1.25);
    if (a === 'rotate-left') stage.rotateBy(-45);
    if (a === 'rotate-right') stage.rotateBy(45);
  }));
}

// Von Bedienelementen belegte Bühnenränder an die Kamera melden, damit das Produkt frei bleibt
function updateInsets() {
  if (!stage) return;
  const st = $('#stage').getBoundingClientRect();
  if (!st.width) return;
  const vis = (el) => el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  const ins = { top: 0, right: 0, bottom: 0, left: 0 };
  if (state.presentation) {
    const copy = $('#presentationCopy').getBoundingClientRect();
    $('#stage').style.setProperty('--presentation-cut-bottom', `${Math.max(0, st.bottom - copy.top + 12)}px`);
    const nav = $('#presentation .presentation__nav').getBoundingClientRect();
    const transport = $('.presentation__playback').getBoundingClientRect();
    const transportInset = Math.max(64, transport.bottom - st.top + 12);
    if (window.matchMedia('(min-width: 760px)').matches) {
      ins.left = copy.right - st.left + 32;
      ins.bottom = st.bottom - nav.top + 24;
      ins.top = transportInset; ins.right = 32;
    } else {
      ins.bottom = st.bottom - copy.top + 24;
      ins.top = transportInset; ins.left = ins.right = 24;
    }
    stage.setInsets(ins);
    return;
  }
  const hint = $('#stageHint');
  // auch ausgeblendet gleich behandeln, sonst springt der Bildausschnitt beim ersten Ziehen
  if (vis(hint)) ins.top = Math.max(0, hint.getBoundingClientRect().bottom - st.top + 4);
  const detailReturn = $('#detailReturn');
  if (vis(detailReturn)) ins.top = Math.max(ins.top, detailReturn.getBoundingClientRect().bottom - st.top + 8);
  // Bedienzeile am unteren Rand: Wasserknopf (nur „Entdecken“) links, Werkzeugleiste rechts
  const tools = $('.stage__tools');
  const water = $('#waterBox');
  let top = st.bottom;
  if (vis(tools)) top = Math.min(top, tools.getBoundingClientRect().top);
  const setOverview = $('#setOverview');
  if (vis(setOverview)) top = Math.min(top, setOverview.getBoundingClientRect().top);
  if (state.view === 'discover' && vis(water)) top = Math.min(top, water.getBoundingClientRect().top);
  // „Entdecken“ auf breiten Bühnen: halbe Höhe genügt (Leiste in den Ecken, Produkt in der Mitte).
  // Set und Anschluss tragen Beschriftungen bis an den Rand: dort volle Höhe
  const dock = $('#waterDock');
  if (vis(dock) && $('#stage').contains(dock)) top = Math.min(top, dock.getBoundingClientRect().top);
  const half = st.width >= 560 && state.view === 'discover' && !(vis(dock) && $('#stage').contains(dock));
  ins.bottom = Math.max(0, st.bottom - top + 6) * (half ? 0.5 : 1);
  stage.setInsets(ins);
}

function hideHint() {
  $('#stageHint').classList.add('is-hidden');
}

// Ein/Aus wie im Prototypvideo. Beim Verlassen der Demo endet der Fluss.
function bindWater() {
  $('#waterBtn').addEventListener('click', toggleWater);
  const stop = () => stage?.stopWater();
  window.addEventListener('blur', () => { stop(); stage?.setInspectionLight(state.lightAngle); });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); stage?.setInspectionLight(state.lightAngle); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') stop(); });
  stage.addEventListener('water', updateWaterUI);
  $$('.views__tab').forEach(t => t.addEventListener('click', stop));
}

/* ------------------------------------------------------------ Zustände */
function showState(kind, { title, text, retry = false, progress = false } = {}) {
  if (kind === 'error' && state.presentation) endPresentation();
  const box = $('#stageState');
  box.dataset.kind = kind;
  box.hidden = kind === 'ready';
  if (kind === 'ready') return;
  if (kind === 'error') pausePresentationPlayback();
  $('#stateTitle').textContent = title || '';
  $('#stateText').textContent = text || '';
  $('#progress').hidden = !progress;
  $('#retryBtn').hidden = !retry;
}

async function boot() {
  window.__ecobumBooted = true;
  renderDiscover();
  renderSet();
  renderConnect();
  renderMore();
  renderPresentation();
  bindTabs();
  // Nach einem Formatwechsel die Orientierung im laufenden Rundgang erhalten.
  let tourResizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(tourResizeFrame);
    if (state.tour) tourResizeFrame = requestAnimationFrame(revealSetTour);
    if (state.presentation) requestAnimationFrame(() => { updateInsets(); syncStage(); });
  });
  document.body.dataset.view = state.view;
  $('.skip-link').addEventListener('click', (e) => {
    if (state.presentation) endPresentation();
    if (!opening.active()) return;
    e.preventDefault();
    opening.end({ focus: false });
    $('#panel').focus({ preventScroll: false });
  });
  const requestedView = new URLSearchParams(location.search).get('view');
  const directView = ['set', 'connect'].includes(requestedView) ? requestedView : null;
  if (directView) setView(directView, { syncStageNow: false });
  opening = initOpening({
    getStage: () => stage,
    narrowQuery,
    reducedQuery,
    // Bedienelemente werden erst nach der Eröffnung sichtbar: Ränder danach (erneut) messen
    onEnd: () => { requestAnimationFrame(updateInsets); setTimeout(updateInsets, 150); },
    syncStage,
  });

  if (location.protocol === 'file:') return; // Hinweis kommt aus index.html

  if (!webglAvailable()) {
    document.body.classList.add('no-3d');
    $('#scene').tabIndex = -1;   // ohne Darstellung kein Tab-Ziel (wie bei den übrigen Fehlerzuständen)
    showState('error', {
      title: '3D-Ansicht nicht verfügbar',
      text: 'Ihr Browser unterstützt WebGL nicht oder es ist ausgeschaltet. Die Erklärungen rechts bzw. unten bleiben vollständig lesbar.',
    });
    return;
  }

  // „Erneut versuchen“: vollständiger Neustart der Seite (frischer Zustand, Modell neu geladen)
  $('#retryBtn').addEventListener('click', () => location.reload());

  try {
    stage = new Stage($('#scene'), $('#stageLabels'), {
      reducedMotion: reducedQuery.matches,
      finishHex: FINISH.hex,
      content: { components: COMPONENTS, connectLabels: CONNECTION.labels },
    });
  } catch (err) {
    showStageError(err.kind ? err : Object.assign(err, { kind: 'setup' }));
    return;
  }
  if (opening.active() && $('#opening').classList.contains('is-playing')) stage.setPaused(true);
  stage.addEventListener('interaction', handleStageInteraction);
  stage.addEventListener('inspectionlight', e => {
    state.lightAngle = e.detail;
    const slider = $('#inspectionLight'), label = $('#lightValue');
    const value = String(Math.round(e.detail));
    if (slider && slider.value !== value) slider.value = value;
    if (label && label.textContent !== `${value}°`) label.textContent = `${value}°`;
  });
  stage.addEventListener('productaction', (e) => {
    if (state.view !== 'discover' || state.presentation) return;
    if (e.detail === 'button') {
      if (stage.waterActive) stage.stopWater();
      else { stage.setWaterMode(state.waterMode); stage.startWater(); }
    } else if (e.detail === 'mode') {
      state.waterMode = state.waterMode === 'spray' ? 'stream' : 'spray';
      stage.setWaterMode(state.waterMode);
    }
    hideHint();
    updateWaterUI();
  });
  stage.addEventListener('labelselect', (e) => {
    const fromLabel = document.activeElement && document.activeElement.closest && document.activeElement.closest('.stage__labels');
    selectComponent(state.tour ? e.detail : state.component === e.detail ? null : e.detail);
    // Im Rundgang bleibt der Fokus bei der sichtbaren Erklärung, sonst beim Listeneintrag.
    if (fromLabel) (state.tour ? $('#tourTitle') : $(`[data-component="${e.detail}"]`)).focus({ preventScroll: true });
  });
  stage.addEventListener('contextlost', () => {
    showState('error', { title: '3D-Ansicht unterbrochen', text: 'Die Grafikverbindung wurde vom Browser beendet. Bitte erneut versuchen.', retry: true });
  });
  stage.addEventListener('runtimeerror', (e) => showStageError(Object.assign(e.detail, { kind: e.detail.kind || 'runtime' })));
  reducedQuery.addEventListener('change', (e) => {
    if (e.matches) pausePresentationPlayback();
    updatePresentationPlayback();
    stage.setReducedMotion(e.matches);
    if (e.matches) { state.slowWater = false; stage.water?.setSpeed(1); }
    $('#lightStudy').disabled = e.matches;
    updateWaterUI();
  });
  bindStageTools();
  bindWater();

  showState('loading', { title: 'Produktmodell wird geladen …', progress: true });
  $('#progressBar').style.transform = 'scaleX(0.05)';
  try {
    await stage.load(MODEL_URL, (p) => { $('#progressBar').style.transform = `scaleX(${Math.max(0.05, p)})`; });
  } catch (err) {
    showStageError(err);
    return;
  }
  showState('ready');
  document.body.classList.add('is-ready');
  updateInsets();
  if (state.view === 'discover') startPresentation();
  // Wurde während des Ladens schon eine andere Ansicht gewählt, die Bühne nachziehen
  if (!opening.active() && state.view !== 'discover') syncStage();
  new ResizeObserver(() => updateInsets()).observe($('#stage'));
  // Fehler aus Bedienhandlungen nicht still verschlucken
  window.addEventListener('error', (e) => { if (e.error && document.body.classList.contains('is-ready')) showStageError(Object.assign(e.error, { kind: e.error.kind || 'runtime' })); });
}

// Verständliche Meldung je Fehlerart, ohne eine unbewiesene Ursache zu behaupten
function showStageError(err) {
  pausePresentationPlayback();
  console.error(err, err.cause || '');
  document.body.classList.remove('is-ready');
  $('#scene').tabIndex = -1;   // ohne Darstellung kein Tab-Ziel
  const status = err.cause && err.cause.response && err.cause.response.status;
  const messages = {
    load: {
      title: 'Das 3D-Modell konnte nicht geladen werden',
      text: status === 404
        ? 'Die Modelldatei wurde auf dem Server nicht gefunden. Bitte später erneut versuchen. Die Erklärungen bleiben lesbar. (Fehlercode 404)'
        : status
          ? `Der Server hat die Modelldatei nicht ausgeliefert. Bitte erneut versuchen. Die Erklärungen bleiben lesbar. (Fehlercode ${status})`
          : 'Die Modelldatei kam nicht vollständig an oder ist nicht lesbar. Bitte erneut versuchen. Die Erklärungen bleiben lesbar.',
    },
    model: {
      title: 'Das 3D-Modell ist unvollständig',
      text: 'Die Modelldatei ist beschädigt oder veraltet. Bitte die Seite neu laden. Die Erklärungen bleiben lesbar.',
    },
    setup: {
      title: 'Die 3D-Ansicht konnte nicht aufgebaut werden',
      text: 'Beim Aufbau der Ansicht ist ein Fehler aufgetreten. Bitte erneut versuchen. Die Erklärungen bleiben lesbar.',
    },
    runtime: {
      title: 'Die 3D-Ansicht wurde angehalten',
      text: 'Während der Darstellung ist ein Fehler aufgetreten. Bitte erneut versuchen. Die Erklärungen bleiben lesbar.',
    },
  };
  const m = messages[err.kind] || messages.setup;
  showState('error', { title: m.title, text: m.text, retry: true });
}

boot();
