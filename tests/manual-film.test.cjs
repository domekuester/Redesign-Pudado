const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');
test('manual film never starts from viewport entry or motion preference changes', () => {
  let intersection, preference, click, plays = 0;
  const label = {setAttribute() {}, textContent: ''};
  const button = {querySelector: () => label, addEventListener: (_, fn) => { click = fn; }, classList: {toggle() {}}};
  const video = {dataset: {manualPlay: ''}, paused: true, ended: false,
    parentElement: {querySelector: () => button}, classList: {contains: () => false},
    addEventListener() {}, removeAttribute() {},
    play() { plays++; return Promise.resolve(); }, pause() {},
    getBoundingClientRect: () => ({top: 0, bottom: 400})};
  const media = {matches: false, addEventListener: (_, fn) => {preference = fn;}};
  const context = {document: {querySelectorAll: () => [video]}, t: k => k,
    window: {innerHeight: 800, matchMedia: () => media, IntersectionObserver: true},
    IntersectionObserver: class {constructor(fn) {intersection = fn;} observe() {}}};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function initBrandVideos()'), source.indexOf('function initHeaderState()')).replace(/\/\*[^]*$/, ''), context);
  context.initBrandVideos();
  intersection([{isIntersecting: true, target: video}]);
  preference({matches: false});
  assert.equal(plays, 0, 'automatic triggers must not play the opt-in film');
  click();
  assert.equal(plays, 1, 'the explicit play button must still work');
});

test('a manual film loaded with reduced motion still pauses offscreen and on preference changes', () => {
  let intersection, preference, click, observed, plays = 0;
  const label = {setAttribute() {}, textContent: ''};
  const button = {querySelector: () => label, addEventListener: (_, fn) => {click = fn;}, classList: {toggle() {}}};
  const video = {dataset: {manualPlay: ''}, paused: true, ended: false,
    parentElement: {querySelector: () => button}, classList: {contains: () => false},
    addEventListener() {}, removeAttribute() {},
    play() { this.paused = false; plays++; return Promise.resolve(); },
    pause() { this.paused = true; },
    getBoundingClientRect: () => ({top: 0, bottom: 400})};
  const reduced = {matches: true, addEventListener: (_, fn) => {preference = fn;}};
  const context = {document: {querySelectorAll: () => [video]}, t: k => k,
    window: {innerHeight: 800, IntersectionObserver: true,
      matchMedia: query => query.includes('prefers-reduced-motion') ? reduced : {matches: false}},
    IntersectionObserver: class {constructor(fn) {intersection = fn;} observe(target) {observed = target;}}};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('function initBrandVideos()'), source.indexOf('function initHeaderState()')).replace(/\/\*[^]*$/, ''), context);
  context.initBrandVideos();
  assert.equal(plays, 0, 'loading with reduced motion must not start playback');
  assert.equal(observed, video, 'offscreen observation must remain active with reduced motion');
  click();
  assert.equal(video.paused, false, 'explicit playback is available');
  intersection([{isIntersecting: false, target: video}]);
  assert.equal(video.paused, true, 'leaving the viewport pauses explicit playback');
  intersection([{isIntersecting: true, target: video}]);
  assert.equal(plays, 1, 'returning onscreen must not restart the manual film');
  reduced.matches = false;
  preference({matches: false});
  assert.equal(plays, 1, 'disabling reduced motion must not restart the manual film');
  click();
  assert.equal(video.paused, false);
  reduced.matches = true;
  preference({matches: true});
  assert.equal(video.paused, true, 'enabling reduced motion pauses the running film');
});
