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
