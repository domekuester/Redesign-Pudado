// Optical illustration of the two observed prototype streams, not a fluid simulation.
// Surface highlights, moving ripples and downstream breakup stay deliberately subtle.
import * as THREE from 'three';

const VERT = /* glsl */`
  attribute float aT;
  attribute float aSeed;
  uniform float uTime;
  uniform float uFlow;
  uniform float uBundle;
  varying float vT;
  varying float vSeed;
  varying float vRing;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  void main() {
    vT = aT; vSeed = aSeed; vRing = uv.y;
    float phase = aT * 110.0 - uTime * 13.0 * uFlow + aSeed * 6.283185;
    float wave = sin(phase + uv.y * 6.283185) * 0.65 + sin(phase * 1.71) * 0.35;
    float amplitude = mix(0.00012, 0.00036, uBundle);
    // Unbroken at the outlet; increasing surface variation downstream.
    vec3 p = position + normal * wave * amplitude * smoothstep(0.0, 0.3, aT);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */`
  uniform float uTime;
  uniform float uHead;
  uniform float uTail;
  uniform float uFlow;
  uniform float uOpacity;
  uniform float uBundle;
  varying float vT;
  varying float vSeed;
  varying float vRing;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  void main() {
    if (vT > uHead || vT < uTail) discard;
    float phase = vT * 110.0 - uTime * 13.0 * uFlow + vSeed * 6.283185;
    vec3 n = normalize(vNormalV);
    vec3 eye = normalize(-vViewPos);
    float facing = abs(dot(n, eye));
    float rim = pow(1.0 - facing, 2.1);
    // Broad softbox reflection and fine traveling filaments. Clear central body,
    // darker optical edge: legible against a light wall without painting it blue.
    vec3 light = normalize(vec3(-0.45, 0.8, 0.65));
    float reflection = pow(max(dot(reflect(-light, n), eye), 0.0), 28.0);
    float ripple = 0.5 + 0.5 * sin(phase + sin(vRing * 18.84956) * 1.1);
    float filaments = pow(0.5 + 0.5 * sin(vRing * 62.83185 + phase * 0.13), 10.0) * uBundle;
    float sparkle = pow(ripple, 7.0) * (0.18 + 0.3 * rim);
    float breakup = mix(1.0, smoothstep(0.13, 0.35, ripple), smoothstep(0.62, 0.96, vT));
    float start = smoothstep(0.0, 0.025, vT - uTail);
    float end = 1.0 - smoothstep(0.78, 1.0, vT);
    float head = uHead > 0.999 ? 1.0 : 1.0 - smoothstep(uHead - 0.045, uHead, vT);
    float highlight = clamp(reflection * 1.4 + sparkle + filaments * 0.28, 0.0, 1.0);
    vec3 color = mix(vec3(0.43, 0.55, 0.59), vec3(0.96, 0.99, 1.0), highlight);
    float alpha = (0.10 + 0.30 * rim + 0.46 * highlight) * start * end * head * breakup * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export class WaterSpray {
  constructor({ origin, direction, jets }) {
    this.group = new THREE.Group();
    this.group.layers.set(1);
    this.uniforms = { uTime: { value: 0 }, uHead: { value: 0 }, uTail: { value: 0 }, uFlow: { value: 1 } };
    this.materials = {};
    for (const mode of ['spray', 'stream']) {
      this.materials[mode] = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG,
        uniforms: { ...this.uniforms, uOpacity: { value: mode === 'spray' ? 1 : 0 }, uBundle: { value: mode === 'stream' ? 1 : 0 } },
        transparent: true, depthWrite: false, side: THREE.FrontSide,
      });
    }
    const dir = direction.clone().normalize();
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const lift = new THREE.Vector3().crossVectors(side, dir).normalize();
    const allJets = [...jets, { offset: new THREE.Vector2(), spread: 0, bundled: true }];
    this.paths = [];
    this.meshes = allJets.map((jet, i) => {
      const start = origin.clone().addScaledVector(side, jet.offset.x).addScaledVector(lift, jet.offset.y);
      const outward = dir.clone().addScaledVector(side, jet.offset.x * jet.spread).addScaledVector(lift, jet.offset.y * jet.spread).normalize();
      this.paths.push({ start, outward, mode: jet.bundled ? 'stream' : 'spray' });
      const pts = [];
      for (let k = 0; k <= 32; k++) {
        const s = k / 32;
        const p = start.clone().addScaledVector(outward, s * 0.22);
        p.y -= 0.062 * s * s;
        pts.push(p);
      }
      const radius = jet.bundled ? 0.0054 : 0.00086 + (i % 3) * 0.00007;
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, radius, 12, false);
      const count = g.attributes.position.count;
      const aT = new Float32Array(count);
      for (let v = 0; v < count; v++) aT[v] = Math.floor(v / 13) / 80;
      g.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
      g.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(count).fill(((i * 37) % 17) / 17), 1));
      const mode = jet.bundled ? 'stream' : 'spray';
      const mesh = new THREE.Mesh(g, this.materials[mode]);
      mesh.layers.set(1); mesh.userData.mode = mode;
      mesh.visible = !jet.bundled; mesh.renderOrder = 5; mesh.frustumCulled = false;
      this.group.add(mesh);
      return mesh;
    });
    // Small downstream droplets finish the stream naturally. Two instanced draws,
    // no particle cloud, no screen-space blur or heavy refraction pass.
    this.drops = [];
    this._dummy = new THREE.Object3D();
    this._dropUp = new THREE.Vector3(0, 1, 0);
    this._dropTangent = new THREE.Vector3();
    const dropGeometry = new THREE.SphereGeometry(1, 8, 6);
    for (const mode of ['spray', 'stream']) {
      const paths = this.paths.filter(p => p.mode === mode);
      const count = paths.length * (mode === 'spray' ? 4 : 16);
      const material = new THREE.MeshPhysicalMaterial({ color: '#CBDADC', metalness: 0, roughness: .09,
        clearcoat: 1, clearcoatRoughness: .04, transparent: true, opacity: .65, depthWrite: false,
        envMapIntensity: 1.6, specularIntensity: 1 });
      const mesh = new THREE.InstancedMesh(dropGeometry, material, count);
      mesh.layers.set(1); mesh.renderOrder = 6; mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.group.add(mesh); this.drops.push({ mesh, mode, paths });
    }
    this.group.visible = false;
    this.active = false; this.reduced = false; this.mode = 'spray'; this.blend = 0; this._changed = false;
  }
  _applyMode() {
    this.materials.spray.uniforms.uOpacity.value = 1 - this.blend;
    this.materials.stream.uniforms.uOpacity.value = this.blend;
    for (const d of this.drops) {
      const opacity = d.mode === 'stream' ? this.blend : 1 - this.blend;
      d.mesh.material.opacity = opacity * .65; d.mesh.visible = opacity > 0;
    }
    for (const mesh of this.meshes) mesh.visible = mesh.userData.mode === 'stream' ? this.blend > 0 : this.blend < 1;
  }
  setMode(mode) {
    this.mode = mode === 'stream' ? 'stream' : 'spray';
    if (this.reduced || !this.group.visible) this.blend = this.mode === 'stream' ? 1 : 0;
    this._applyMode(); this._changed = true;
  }
  setReducedMotion(on) {
    this.reduced = on; this.uniforms.uFlow.value = on ? 0 : 1;
    if (on) { this.setMode(this.mode); if (this.active) { this._head = 1; this._tail = 0; this._apply(); this._updateDrops(); } else this.hide(); }
    this._changed = true;
  }
  _updateDrops() {
    const time = this.reduced ? 0 : this.uniforms.uTime.value;
    for (const d of this.drops) {
      for (let i = 0; i < d.mesh.count; i++) {
        const path = d.paths[i % d.paths.length];
        const seed = (i * .61803398875) % 1;
        const t = .68 + ((time * 1.5 + seed) % 1) * .36;
        const scatter = (t - .68) * (d.mode === 'stream' ? .006 : .003);
        const angle = i * 2.399963;
        this._dummy.position.copy(path.start).addScaledVector(path.outward, t * .22);
        this._dummy.position.y -= .062 * t * t;
        this._dummy.position.y += Math.sin(angle) * scatter;
        this._dummy.position.z += Math.cos(angle) * scatter;
        this._dropTangent.copy(path.outward).multiplyScalar(.22); this._dropTangent.y -= .124 * t;
        this._dummy.quaternion.setFromUnitVectors(this._dropUp, this._dropTangent.normalize());
        const visible = t <= this.uniforms.uHead.value && t >= this.uniforms.uTail.value;
        const fade = Math.min(1, Math.max(0, (1.04 - t) / .07));
        const radius = visible ? (.00045 + seed * .00035) * fade : 0;
        this._dummy.scale.set(radius, radius * (1.5 + seed), radius);
        this._dummy.updateMatrix(); d.mesh.setMatrixAt(i, this._dummy.matrix);
      }
      d.mesh.instanceMatrix.needsUpdate = true;
    }
  }
  start() {
    if (!this.group.visible) this._head = 0;
    this.active = true; this.group.visible = true; this._tail = 0;
    if (this.reduced) this._head = 1;
    this._apply(); this._updateDrops(); this._changed = true;
  }
  _apply() {
    const smooth = x => x * x * (3 - 2 * x);
    this.uniforms.uHead.value = smooth(this._head || 0);
    this.uniforms.uTail.value = smooth(this._tail || 0);
  }
  stop() { this.active = false; if (this.reduced) this.hide(); this._changed = true; }
  hide() {
    this.active = false; this._head = 0; this._tail = 0;
    this._apply(); this.group.visible = false; this._changed = true;
  }
  update(dt) {
    const changed = this._changed; this._changed = false;
    if (!this.group.visible || this.reduced) return changed;
    dt = Math.min(dt, 0.05);
    this.uniforms.uTime.value += dt;
    const target = this.mode === 'stream' ? 1 : 0;
    this.blend += Math.sign(target - this.blend) * Math.min(Math.abs(target - this.blend), dt / 0.24);
    this._applyMode();
    this._head = Math.min(1, (this._head || 0) + dt / 0.36);
    if (this.active) this._tail = 0;
    else {
      this._tail = Math.min(1, (this._tail || 0) + dt / 0.32);
      if (this._tail >= 1) { this.hide(); return true; }
    }
    this._apply(); this._updateDrops(); return true;
  }
}
