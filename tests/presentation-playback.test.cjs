const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../erlebnis/src/main.js'), 'utf8');

function setup() {
  let now = 0, serial = 0;
  const timers = new Map(), visits = [], animations = [];
  const tracks = Array.from({length: 4}, (_, i) => ({dataset: {chapterProgress: String(i)}, style: {}, animate(frames, options) { const animation = {frames, options, cancelled: false, cancel() { this.cancelled = true; }}; animations.push(animation); return animation; }}));
  const nodes = new Map();
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {attrs: {}, textContent: '', disabled: false, children: [], replaceChildren(...children) { this.children = children; }, setAttribute(k, v) { this.attrs[k] = v; }, classList: { toggle() {} } });
    return nodes.get(selector);
  };
  const state = { presentation: true, guided: false, chapter: 0 };
  const context = {
    state, CHAPTERS: ['Form', 'Wasser', 'Knopf', 'Set'].map(label => ({label})),
    performance: {now: () => now},
    $$: () => tracks,
    reducedQuery: {matches: false}, document: {hidden: false},
    $: node, hideHint() {}, directionIcon: kind => kind, h: (tag, attrs, text) => text,
    clearTimeout: id => timers.delete(id),
    window: { setTimeout(fn, delay) { const id = ++serial; timers.set(id, {fn, at: now + delay}); return id; } },
    setChapter(i) { state.chapter = i; visits.push(i); },
  };
  vm.createContext(context);
  vm.runInContext('let playbackTimer = 0; let playbackActive = false; let playbackFinished = false; let playbackElapsed = 0; let playbackStartedAt = 0; let playbackHasStarted = false; let playbackProgress = null;\n' + source.slice(source.indexOf('const PRESENTATION_CHAPTER_MS'), source.indexOf('function renderPresentation()')), context);
  const tick = ms => {
    const end = now + ms;
    while (true) {
      const next = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      now = next[1].at; timers.delete(next[0]); next[1].fn();
    }
    now = end;
  };
  return {context, state, visits, timers, tick, node, tracks, animations};
}

test('presentation is opt-in, finishes after four chapters, and replays from the first', () => {
  const app = setup();
  app.tick(20000);
  assert.deepEqual(app.visits, []);
  app.context.togglePresentationPlayback();
  assert.equal(app.state.guided, true);
  app.tick(15999);
  assert.deepEqual(app.visits, [0, 1, 2, 3]);
  assert.equal(app.node('#presentationPlay').attrs['aria-pressed'], 'true');
  app.tick(1);
  assert.equal(app.timers.size, 0);
  assert.equal(app.node('#presentationPlay').attrs['aria-pressed'], 'false');
  assert.equal(app.node('#presentationPlay').attrs['aria-label'], 'Erneut abspielen');
  app.context.togglePresentationPlayback();
  assert.equal(app.visits.at(-1), 0);
  assert.equal(app.timers.size, 1);
});

test('pause removes pending work; resume does not accumulate timers', () => {
  const app = setup();
  app.context.togglePresentationPlayback();
  app.tick(4000);
  app.context.pausePresentationPlayback();
  assert.equal(app.timers.size, 0);
  app.tick(20000);
  assert.deepEqual(app.visits, [0, 1]);
  app.context.togglePresentationPlayback();
  assert.equal(app.timers.size, 1);
  app.tick(4000);
  assert.equal(app.state.chapter, 2);
  assert.equal(app.timers.size, 1);
});

test('hidden tab, reduced motion, or leaving presentation stops progression', () => {
  for (const change of [app => { app.context.document.hidden = true; }, app => { app.context.reducedQuery.matches = true; }, app => { app.state.presentation = false; }]) {
    const app = setup();
    app.context.togglePresentationPlayback();
    change(app);
    app.tick(20000);
    assert.deepEqual(app.visits, [0]);
    assert.equal(app.timers.size, 0);
    assert.equal(app.node('#presentationPlay').attrs['aria-pressed'], 'false');
    app.context.togglePresentationPlayback();
    assert.equal(app.timers.size, 0);
  }
});


test('taking control of the product pauses the timed camera sequence', () => {
  const app = setup();
  app.context.togglePresentationPlayback();
  app.tick(1000);
  app.context.handleStageInteraction();
  app.tick(12000);
  assert.deepEqual(app.visits, [0]);
  assert.equal(app.timers.size, 0);
  assert.equal(app.node('#presentationPlay').attrs['aria-pressed'], 'false');
});

test('zoom, rotate and reset buttons pause playback before applying the inspection action', () => {
  const app = setup();
  const controls = ['zoom-in', 'zoom-out', 'rotate-left', 'rotate-right'].map(action => ({
    dataset: {action}, addEventListener(type, fn) { this.click = fn; },
  }));
  const reset = app.node('#resetBtn');
  reset.addEventListener = (type, fn) => { reset.click = fn; };
  const actions = [];
  app.context.$$ = selector => selector === '.stage__tools [data-action]' ? controls : app.tracks;
  app.context.stage = { zoomBy: value => actions.push(['zoom', value]), rotateBy: value => actions.push(['rotate', value]), resetView: () => actions.push(['reset']) };
  vm.runInContext(source.slice(source.indexOf('function bindStageTools()'), source.indexOf('function updateInsets()')), app.context);
  app.context.bindStageTools();
  for (const control of [...controls, reset]) {
    app.context.togglePresentationPlayback();
    assert.equal(app.timers.size, 1);
    control.click();
    assert.equal(app.timers.size, 0);
    app.tick(10000);
    assert.equal(app.state.chapter, 0);
  }
  assert.deepEqual(actions, [['zoom', .8], ['zoom', 1.25], ['rotate', -45], ['rotate', 45], ['reset']]);
});


test('pause preserves chapter time and resumes without resetting the product camera', () => {
  const app = setup();
  app.context.togglePresentationPlayback();
  app.tick(1700);
  app.context.pausePresentationPlayback();
  assert.equal(app.node('#presentationPlay').attrs['aria-label'], 'Weiterlaufen');
  assert.equal(app.tracks[0].style.transform, 'scaleX(0.425)');
  assert.equal(app.animations.at(-1).cancelled, true);
  app.tick(60000);
  app.context.togglePresentationPlayback();
  assert.deepEqual(app.visits, [0], 'resume must not reselect or reframe the current chapter');
  assert.equal(app.animations.at(-1).options.duration, 2300);
  app.tick(2299);
  assert.equal(app.state.chapter, 0);
  app.tick(1);
  assert.equal(app.state.chapter, 1);
  assert.equal(app.tracks[0].style.transform, 'scaleX(1)');
  assert.equal(app.node('#presentationPosition').textContent, '02 / 04 · Wasser');
});

test('progress freezes when hidden, and reduced motion leaves a static chapter position', () => {
  const app = setup();
  app.context.togglePresentationPlayback();
  app.tick(800);
  app.context.document.hidden = true;
  app.context.pausePresentationPlayback();
  assert.equal(app.tracks[0].style.transform, 'scaleX(0.2)');
  assert.equal(app.animations.at(-1).cancelled, true);
  app.context.reducedQuery.matches = true;
  const count = app.animations.length;
  app.context.updatePresentationPlayback();
  app.context.togglePresentationPlayback();
  app.tick(12000);
  assert.equal(app.animations.length, count);
  assert.equal(app.timers.size, 0);
  assert.equal(app.node('#presentationPlay').disabled, true);
  assert.equal(app.node('#presentationPosition').textContent, '01 / 04 · Form');
});
