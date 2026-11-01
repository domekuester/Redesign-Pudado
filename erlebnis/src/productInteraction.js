import * as THREE from 'three';

// A drag that returns to its starting point is still a drag. A second finger
// cancels the entire gesture until all fingers are released.
export class ProductTap {
  constructor() { this.pointers = new Set(); this.tap = null; }
  down(e, action) {
    this.pointers.add(e.pointerId);
    if (this.pointers.size !== 1 || e.button !== 0 || !action) { this.tap = null; return; }
    this.tap = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp, action };
  }
  move(e) {
    if (this.tap?.id === e.pointerId && Math.hypot(e.clientX - this.tap.x, e.clientY - this.tap.y) > 7) this.tap = null;
  }
  up(e, action) {
    this.move(e);
    const t = this.tap;
    this.pointers.delete(e.pointerId);
    this.tap = null;
    return t && t.id === e.pointerId && t.action === action && e.timeStamp - t.time < 600 ? action : null;
  }
  cancel() { this.tap = null; this.pointers.clear(); }
}

const ACTIONS = { HB_Button: 'button', HB_Cap: 'mode', HB_CapFace: 'mode', HB_Collar: 'mode', HB_NozzleInsert: 'mode' };

export class ProductInteraction {
  constructor(stage) {
    this.stage = stage;
    this.mode = 'spray';
    this.tap = new ProductTap();
    this.ray = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.meshes = [];
    stage.objects.handbidet.traverse(o => { if (o.isMesh && o.name.startsWith('HB_')) this.meshes.push(o); });
    this.points = ['mode', 'button'].map(action => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'product-point'; el.hidden = true;
      const title = document.createElement('strong'), state = document.createElement('small');
      el.append(title, state);
      el.addEventListener('click', () => { if (this.available()) this.activate(action); });
      const line = document.createElement('div');
      line.className = 'stage-leader product-point__line'; line.hidden = true;
      line.setAttribute('aria-hidden', 'true');
      stage.overlay.append(line, el);
      return { action, el, line, title, state };
    });
    this.status = document.createElement('span');
    this.status.className = 'visually-hidden'; this.status.setAttribute('role', 'status');
    stage.overlay.append(this.status);
    const canvas = stage.canvas;
    // Capture checks eligibility before OrbitControls cancels any camera flight.
    canvas.addEventListener('pointerdown', e => this.tap.down(e, this.available() ? this.hit(e) : null), true);
    window.addEventListener('pointermove', e => this.tap.move(e), { passive: true });
    window.addEventListener('pointerup', e => {
      const action = this.tap.up(e, this.tap.tap && this.available() ? this.hit(e) : null);
      if (action) this.activate(action);
    });
    window.addEventListener('pointercancel', () => this.tap.cancel());
    window.addEventListener('blur', () => this.tap.cancel());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.tap.cancel(); });
  }
  available() {
    const s = this.stage;
    return s.view === 'discover' && !s.paused && !s.overlay.inert &&
      !(s._camTween && s.tweens.list.has(s._camTween)) && !(s._layoutTween && s.tweens.list.has(s._layoutTween));
  }
  hit(e) {
    const s = this.stage, r = s.canvas.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return null;
    this.pointer.set(2 * (e.clientX - r.left) / r.width - 1, 1 - 2 * (e.clientY - r.top) / r.height);
    s.camera.updateMatrixWorld(); s.objects.handbidet.updateWorldMatrix(true, true);
    this.ray.setFromCamera(this.pointer, s.camera);
    // Nearest product surface wins: never activate a button through the head.
    const first = this.ray.intersectObjects(this.meshes, false)[0];
    return first ? ACTIONS[first.object.name] || null : null;
  }
  activate(action) {
    this.stage.dispatchEvent(new CustomEvent('productaction', { detail: action }));
    this.stage.dirty = true;
    this.status.textContent = `${this.mode === 'spray' ? 'Brausestrahl' : 'Gebündelter Strahl'}. Wasser ${this.stage.waterActive ? 'an' : 'aus'}.`;
  }
  update() {
    const s = this.stage, w = s.canvas.clientWidth, h = s.canvas.clientHeight, ins = s.insets;
    const preset = s.currentPreset?.name;
    const visible = this.available() && !s.dragging && ['discover', 'nozzle', 'button'].includes(preset);
    // Water animates continuously; HTML positions only change with the view,
    // camera, size or control state. Avoid layout work on every water frame.
    const key = visible ? [preset, s.waterActive, this.mode, w, h, ...Object.values(ins),
      ...s.camera.position.toArray(), ...s.camera.quaternion.toArray(), ...s.camera.projectionMatrix.elements].join('|') : 'hidden';
    if (key === this.lastKey) return;
    this.lastKey = key;
    if (!visible) this.status.textContent = '';
    const anchors = this.points.map(p => {
      const v = s.objects.handbidet.localToWorld(s.pts[p.action === 'mode' ? 'nozzle' : 'button'].clone()).project(s.camera);
      return { x: (v.x * .5 + .5) * w, y: (.5 - v.y * .5) * h, z: v.z };
    });
    const placed = [];
    this.points.forEach((p, i) => {
      const focused = document.activeElement === p.el;
      const show = visible && (preset === 'discover' || (preset === 'nozzle') === (p.action === 'mode'));
      p.el.hidden = p.line.hidden = !show;
      if (!show) {
        if (focused) s.canvas.focus({ preventScroll: true });
        return;
      }
      p.title.textContent = p.action === 'mode' ? 'Strahl wechseln' : 'Knopf drücken';
      p.state.textContent = p.action === 'mode' ? (this.mode === 'spray' ? 'Brausestrahl' : 'Gebündelt') : (s.waterActive ? 'Wasser an' : 'Wasser aus');
      p.el.setAttribute('aria-label', p.action === 'mode' ? `Strahl wechseln: ${this.mode === 'spray' ? 'zu Gebündelt' : 'zu Brausestrahl'}` : `Knopf drücken: Wasser ${s.waterActive ? 'stoppen' : 'starten'}`);
      if (p.action === 'button') p.el.setAttribute('aria-pressed', String(!!s.waterActive));
      const a = anchors[i], b = anchors[1 - i], lw = p.el.offsetWidth, lh = p.el.offsetHeight;
      const left = a.x < b.x;
      const local = s.pts[p.action === 'mode' ? 'nozzle' : 'button'];
      const rim = [new THREE.Vector3(0, .016, 0), new THREE.Vector3(0, 0, .016)].map(offset => {
        const v = s.objects.handbidet.localToWorld(local.clone().add(offset)).project(s.camera);
        return Math.hypot((v.x * .5 + .5) * w - a.x, (.5 - v.y * .5) * h - a.y);
      });
      const gap = Math.max(28, ...rim.map(radius => radius + 14));
      const x = Math.max(ins.left + 8, Math.min(w - ins.right - lw - 8, left ? a.x - lw - gap : a.x + gap));
      let y = Math.max(ins.top + 8, Math.min(h - ins.bottom - lh - 8, a.y - lh / 2));
      // Narrow overview: place the left label below the nozzle rather than on
      // top of it. The product's centre and the bottom toolbar stay clear.
      if (Math.abs(x + lw / 2 - a.x) < lw / 2 + gap - 1) y = a.y + gap;
      const box = { x, y, right: x + lw, bottom: y + lh };
      const fits = a.z > -1 && a.z < 1 && a.x > ins.left && a.x < w - ins.right && a.y > ins.top && a.y < h - ins.bottom &&
        x + lw <= w - ins.right - 8 && y + lh <= h - ins.bottom - 8 &&
        (Math.abs(x + lw / 2 - a.x) >= lw / 2 + gap - 1 || y >= a.y + gap - 1) &&
        !placed.some(q => box.x < q.right + 8 && box.right > q.x - 8 && box.y < q.bottom + 8 && box.bottom > q.y - 8);
      if (!fits) { p.el.hidden = p.line.hidden = true; if (focused) s.canvas.focus({ preventScroll: true }); return; }
      placed.push(box);
      p.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const tx = Math.max(x, Math.min(x + lw, a.x)), ty = Math.max(y, Math.min(y + lh, a.y));
      p.line.style.width = `${Math.hypot(tx - a.x, ty - a.y).toFixed(1)}px`;
      p.line.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) rotate(${Math.atan2(ty - a.y, tx - a.x)}rad)`;
      p.line.classList.add('is-shown');
    });
  }
}
