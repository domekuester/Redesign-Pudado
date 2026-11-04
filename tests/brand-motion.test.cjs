const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../motion.js'), 'utf8');

function setup(reduce = false, missingLogo = false) {
  const triggers = [], tweens = [], timelines = [], listeners = new Map(), docListeners = new Map();
  let reverted = 0;
  const mirror = {}, light = {};
  const handlers = new Map(), attributes = new Map();
  const replay = { hidden: true, setAttribute: (key, value) => attributes.set(key, value),
    addEventListener: (key, fn) => handlers.set(key, fn), removeEventListener: key => handlers.delete(key) };
  const word = { querySelector: () => mirror };
  const stage = { querySelector: selector => selector === '.brand-stage-word' ? (missingLogo ? null : word) : selector === '.brand-stage-light' ? light : replay };
  const media = { matches: reduce, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const gsap = {
    registerPlugin() {}, utils: { toArray: () => [] },
    context(fn) { const context = { add: callback => callback(), revert: () => reverted++ }; fn?.(context); return context; },
    timeline(options) {
      const timeline = {
        options,
        from(target, vars, position) { tweens.push({ target, vars, position }); return timeline; },
        fromTo(target, from, vars, position) { tweens.push({ target, from, vars, position }); return timeline; },
        to(target, vars, position) { tweens.push({ target, vars, position }); return timeline; }, kill() {}
      };
      timelines.push(timeline); return timeline;
    }
  };
  const document = { body: { dataset: { page: 'home' } }, documentElement: { classList: { add() {} } }, hidden: false,
    querySelector: selector => selector === '#warum .brand-stage' ? stage : null,
    querySelectorAll: () => [], getElementById: () => null,
    addEventListener: (name, fn) => docListeners.set(name, fn), removeEventListener: name => docListeners.delete(name) };
  const window = { matchMedia: () => media, gsap, innerWidth: 375,
    ScrollTrigger: { create(config) { const trigger = { config, kill() {} }; triggers.push(trigger); return trigger; }, refresh() {} },
    addEventListener: (name, fn) => listeners.set(name, fn) };
  vm.runInNewContext(source, { window, document });
  return { triggers, tweens, timelines, listeners, docListeners, handlers, attributes, replay, media, word, mirror, light, document,
    enter() { triggers.find(t => typeof t.config.trigger === 'object').config.onEnter(); },
    get reverted() { return reverted; } };
}

test('signature enters once, resolves within two seconds and leaves mirror inversion to CSS', () => {
  const app = setup();
  app.enter(); app.enter();
  assert.equal(app.timelines.length, 1);
  const reflection = app.tweens.find(t => t.target === app.mirror);
  assert.ok(reflection);
  assert.equal(reflection.vars.scaleY, undefined);
  assert.equal(reflection.vars.y, undefined);
  assert.ok(reflection.vars.clearProps.includes('clipPath'));
  assert.ok(!reflection.vars.clearProps.includes('transform'));
  assert.ok(Math.max(...app.tweens.map(t => t.position + t.vars.duration)) < 2);
  assert.equal(app.timelines[0].options.repeat, undefined, 'no looping signature');
});

test('replay is available, cannot overlap playback, and re-enables after completion', () => {
  const app = setup();
  assert.equal(app.replay.hidden, false);
  app.enter();
  assert.equal(app.attributes.get('aria-disabled'), 'true');
  app.handlers.get('click')();
  assert.equal(app.timelines.length, 1, 'repeated click does not stack timelines');
  app.timelines[0].options.onComplete();
  assert.equal(app.attributes.get('aria-disabled'), 'false');
  app.handlers.get('click')();
  assert.equal(app.timelines.length, 2);
  assert.equal(app.reverted, 1, 'previous context restored before replay');
});

test('live reduced motion restores CSS, hides replay, and prevents later playback', () => {
  const app = setup();
  app.enter();
  app.media.matches = true;
  app.listeners.get('change')();
  assert.equal(app.reverted, 1);
  assert.equal(app.replay.hidden, true);
  app.handlers.get('click')(); app.enter();
  assert.equal(app.timelines.length, 1);
  app.media.matches = false;
  app.listeners.get('change')();
  assert.equal(app.replay.hidden, false);
  app.handlers.get('click')();
  assert.equal(app.timelines.length, 2, 'user can replay after restoring motion preference');
});

test('background and pagehide restore logo and remove replay listeners', () => {
  const app = setup();
  app.enter();
  app.document.hidden = true;
  app.docListeners.get('visibilitychange')();
  assert.equal(app.reverted, 1);
  app.handlers.get('click')();
  assert.equal(app.timelines.length, 1, 'hidden tab never restarts the animation');
  app.document.hidden = false;
  app.handlers.get('click')();
  assert.equal(app.timelines.length, 2);
  app.listeners.get('pagehide')();
  assert.equal(app.reverted, 2);
  assert.equal(app.handlers.has('click'), false);
  assert.equal(app.docListeners.has('visibilitychange'), false);
  assert.equal(app.listeners.has('change'), false);
  assert.equal(app.replay.hidden, true);
});

test('reduced motion on load and absent logo need no signature', () => {
  const reduced = setup(true);
  assert.equal(reduced.triggers.length, 0);
  assert.equal(reduced.replay.hidden, true);
  assert.equal(setup(false, true).tweens.length, 0);
});
