const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const root = process.env.PUDADO_TEST_ROOT || path.join(__dirname, '..');

// Exercise the actual layout and backdrop geometry without a WebGL renderer.
async function stageFixture() {
  const Three = await import(pathToFileURL(path.join(root, 'erlebnis/vendor/three/three.module.js')).href);
  const THREE = { ...Three, TextureLoader: class { load() {} } };
  const source = fs.readFileSync(path.join(root, 'erlebnis/src/stage.js'), 'utf8')
    .replace(/^import .*;$/gm, '').replace(/export (class|function) /g, '$1 ');
  const context = { THREE, EventTarget };
  vm.runInNewContext(source + '\nthis.fixture = { Stage, buildBackdrop };', context);
  const stage = Object.create(context.fixture.Stage.prototype);

  const backdrop = context.fixture.buildBackdrop(() => {});
  const positions = backdrop.geometry.attributes.position;
  const profile = [];
  for (let i = 0; i < positions.count; i++) {
    if (positions.getX(i) === 0) profile.push([positions.getZ(i), positions.getY(i)]);
  }
  function floorAt(z) {
    for (let i = 0; i < profile.length - 1; i++) {
      const [za, ya] = profile[i], [zb, yb] = profile[i + 1];
      if (z <= za && z >= zb && za !== zb) return ya + (yb - ya) * (za - z) / (za - zb);
    }
    throw new Error(`Point behind studio wall: ${z}`);
  }
  const bytes = fs.readFileSync(path.join(root, 'erlebnis/assets/models/ecobum-home-prototype02-detail.glb'));
  const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const group = new THREE.Group();
  function addNode(index, parent) {
    const node = gltf.nodes[index], object = new THREE.Group();
    if (node.translation) object.position.fromArray(node.translation);
    if (node.rotation) object.quaternion.fromArray(node.rotation);
    if (node.scale) object.scale.fromArray(node.scale);
    if (node.matrix) { object.matrix.fromArray(node.matrix); object.matrix.decompose(object.position, object.quaternion, object.scale); }
    parent.add(object);
    if (node.mesh !== undefined) {
      for (const primitive of gltf.meshes[node.mesh].primitives) {
        const { min, max } = gltf.accessors[primitive.attributes.POSITION];
        const geometry = new THREE.BoxGeometry(max[0]-min[0], max[1]-min[1], max[2]-min[2]);
        const mesh = new THREE.Mesh(geometry);
        mesh.position.set(...min.map((v, i) => (v + max[i])/2));
        object.add(mesh);
      }
    }
    for (const child of node.children || []) addNode(child, object);
  }
  const anchor = name => new THREE.Vector3().fromArray(gltf.nodes.find(n => n.name === name).translation || [0, 0, 0]);
  stage.pts = { seat: anchor('BR_Seat'), port: anchor('HB_Port'), tvBranch: anchor('TV_PortBranch'), hoseStart: anchor('HN_HoseStart') };
  stage.nutBHome = stage.pts.tvBranch.clone().add(new THREE.Vector3(.011, 0, 0));
  stage.nutB = { quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-1, 0, 0)) };
  stage._localBoxes = {};
  for (const [id, name] of [['tvalve', 'TValve'], ['handbidet', 'Handbidet'], ['bracket', 'Bracket']]) {
    group.clear();
    addNode(gltf.nodes.findIndex(n => n.name === name), group);
    stage._localBoxes[id] = new THREE.Box3().setFromObject(group);
  }
  const bounds = stage._localBoxes.tvalve;
  return { THREE, stage, floorAt, bounds };
}

test('whole T-valve clears the actual studio floor in every set arrangement', async () => {
  const { THREE, stage, floorAt, bounds } = await stageFixture();
  for (const compact of [false, true]) {
    stage.compact = compact;
    for (const exploded of [0, .5, 1]) {
      for (const selected of [null, 'tvalve', 'handbidet', 'bracket', 'hose', 'flexhose']) {
        const layout = stage._setLayout(exploded, selected);
        for (let i = 0; i < 8; i++) {
          const p = new THREE.Vector3(i&1 ? bounds.max.x : bounds.min.x, i&2 ? bounds.max.y : bounds.min.y, i&4 ? bounds.max.z : bounds.min.z)
            .applyQuaternion(layout.tvalve.quat).add(layout.tvalve.pos);
          assert.ok(p.y >= floorAt(p.z) - 1e-6, `valve intersects floor: compact=${compact}, exploded=${exploded}, selected=${selected}, y=${p.y}, floor=${floorAt(p.z)}`);
        }
        // The free ends and low hose paths must also remain on the flat studio floor.
        for (const p of [layout.flex.a.pos, layout.flex.b.pos, ...layout.flex.wp, ...layout.waypoints]) {
          assert.ok(p.y >= floorAt(p.z) - 1e-6, 'hose path intersects studio floor');
        }
      }
    }
  }
});


test('set overview separates valve branch and control in camera projection', async () => {
  const { THREE, stage } = await stageFixture();
  for (const [width, height] of [[375, 373], [485, 500], [768, 460], [896, 835], [1280, 720]]) {
    stage.canvas = { clientWidth: width, clientHeight: height, parentElement: { clientWidth: width, clientHeight: height } };
    stage.insets = { top: 48, bottom: 82, left: 20, right: 20 };
    stage.compact = (width - 40) / (height - 130) < 1.2;
    stage.camera = new THREE.PerspectiveCamera(28, width / height, .005, 6);
    stage._lensMix = 1;
    stage._applyLens();
    for (const exploded of [0, 1]) {
      const layout = stage._setLayout(exploded, null);
      const preset = stage._setPreset(exploded ? 'setExploded' : 'set');
      stage.camera.position.copy(preset.target).addScaledVector(preset.dir, preset.distance);
      stage.camera.lookAt(preset.target);
      stage.camera.updateMatrixWorld();
      const project = p => p.applyQuaternion(layout.tvalve.quat).add(layout.tvalve.pos).project(stage.camera);
      const body = project(new THREE.Vector3(0, .036, 0));
      const branch = project(stage.pts.tvBranch.clone());
      const control = project(new THREE.Vector3(.03845, .036, 0));
      const axis = new THREE.Vector3(1, 0, 0).applyQuaternion(layout.tvalve.quat);
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), preset.dir).normalize();
      assert.ok(Math.abs(axis.dot(right)) > .65, 'valve crossbar is presented end-on');
      assert.ok(control.x < body.x && body.x < branch.x, 'control and branch must occupy opposite sides of the body');
      assert.ok(Math.min(body.x - control.x, branch.x - body.x) * width / 2 > 2, 'side ports collapse into center at this viewport');
      for (const p of [body, branch, control]) assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && Math.abs(p.z) < 1, 'valve anchor falls outside camera');
      const selected = stage._setLayout(exploded, 'tvalve');
      assert.ok(selected.tvalve.quat.angleTo(layout.tvalve.quat) < 1e-6, 'selection must preserve the readable valve orientation');
    }
  }
});

test('set labels never cover occupied product pixels and hide when no free area exists', async () => {
  const { THREE, stage } = await stageFixture();
  const width = 375, height = 373;
  stage.canvas = { clientWidth: width, clientHeight: height };
  stage.insets = { top: 30, bottom: 64, left: 8, right: 8 };
  stage.camera = new THREE.PerspectiveCamera(28, width / height, .005, 6);
  stage.camera.position.set(0, 0, 1);
  stage.camera.lookAt(0, 0, 0);
  stage.camera.updateMatrixWorld();
  const element = () => {
    const classes = new Set(['is-shown']);
    return { offsetWidth: 110, offsetHeight: 28, hidden: false, style: {}, classList: { add: s => classes.add(s), remove: s => classes.delete(s), contains: s => classes.has(s) } };
  };
  const label = () => ({ at: () => new THREE.Vector3(), el: element(), leader: element() });
  const mask = blocked => {
    const w = Math.ceil(width / 4), h = Math.ceil(height / 4), s = width / w;
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (blocked(x * s, y * s)) data[((h - 1 - y) * w + x) * 4] = 255;
    }
    return { w, h, s, data };
  };
  stage._occupancy = () => mask(() => true);
  const covered = label();
  stage._placeSetLabels([covered]);
  assert.equal(covered.el.hidden, true, 'a label must hide when every candidate covers the product');
  assert.equal(covered.leader.hidden, true);
  assert.equal(covered.el.classList.contains('is-shown'), false);

  const partialMask = mask((x) => x > 150 && x < 225);
  stage._occupancy = () => partialMask;
  const available = label();
  stage._placeSetLabels([available]);
  assert.equal(available.el.hidden, false, 'keep the label when a clear placement exists');
  assert.equal(available.el.classList.contains('is-shown'), true);
  const [, x, y] = available.el.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/).map(Number);
  for (let row = 0; row < partialMask.h; row++) for (let col = 0; col < partialMask.w; col++) {
    const px = col * partialMask.s, py = row * partialMask.s;
    if (px >= x - 7 && px <= x + 110 + 7 && py >= y - 7 && py <= y + 28 + 7) {
      assert.equal(partialMask.data[((partialMask.h - 1 - row) * partialMask.w + col) * 4], 0, 'placed label including clearance covers product pixels');
    }
  }
});
