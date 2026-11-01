// Illustrative Wasserdarstellung: feine Strahlen aus den Düsennoppen.
// Bewusst einfache Annäherung (Shader-Streifen auf Bahnkurven), keine Simulation
// und kein gemessenes Sprühbild.
import * as THREE from 'three';

const VERT = /* glsl */`
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  void main() {
    vT = aT;
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */`
  uniform float uTime;
  uniform float uHead;   // 0..1: wie weit der Strahl bereits reicht
  uniform float uTail;   // 0..1: abgerissener Anfang nach dem Loslassen
  uniform float uFlow;   // 0 = statisch (reduzierte Bewegung)
  uniform vec3 uColor;
  varying float vT;
  varying float vSeed;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  void main() {
    if (vT > uHead || vT < uTail) discard;
    float streak = 0.62 + 0.38 * sin((vT * 38.0 - uTime * 9.0 * uFlow) + vSeed * 6.2831);
    float edge = abs(dot(normalize(vNormalV), normalize(-vViewPos)));
    float rim = pow(1.0 - edge, 1.6);
    float fadeIn = smoothstep(0.0, 0.05, vT - uTail);
    float fadeOut = 1.0 - smoothstep(0.55, 1.0, vT);
    float headSoft = 1.0 - smoothstep(uHead - 0.08, uHead, vT);
    float a = (0.22 + 0.5 * rim) * streak * fadeIn * fadeOut * max(headSoft, step(0.999, uHead));
    vec3 col = mix(uColor, vec3(1.0), 0.35 * (1.0 - rim));
    gl_FragColor = vec4(col, a);
  }
`;

export class WaterSpray {
  constructor({ origin, direction, jets }) {
    this.group = new THREE.Group();
    this.group.layers.set(1);
    this.uniforms = {
      uTime: { value: 0 },
      uHead: { value: 0 },
      uTail: { value: 0 },
      uFlow: { value: 1 },
      uColor: { value: new THREE.Color('#4F8FD6') },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const dir = direction.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(dir, up).normalize();
    const lift = new THREE.Vector3().crossVectors(side, dir).normalize();
    const geos = [];
    jets.forEach((jet, i) => {
      // jet: { offset: Vector2 (seitlich, hoch) in m, spread }
      const start = origin.clone().addScaledVector(side, jet.offset.x).addScaledVector(lift, jet.offset.y);
      const outward = dir.clone()
        .addScaledVector(side, jet.offset.x * jet.spread)
        .addScaledVector(lift, jet.offset.y * jet.spread)
        .normalize();
      const pts = [];
      const L = 0.2;
      for (let k = 0; k <= 24; k++) {
        const s = k / 24;
        const p = start.clone().addScaledVector(outward, s * L);
        p.y -= 0.06 * s * s; // sanfte Schwerkraftkurve
        pts.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const r = 0.00042 + (i % 3) * 0.00008;
      const g = new THREE.TubeGeometry(curve, 48, r, 5, false);
      const n = g.attributes.position.count;
      const aT = new Float32Array(n);
      const aSeed = new Float32Array(n).fill(((i * 37) % 17) / 17);
      const ring = 6; // radialSegments + 1
      for (let v = 0; v < n; v++) aT[v] = Math.floor(v / ring) / 48;
      g.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
      g.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
      geos.push(g);
    });
    this.meshes = geos.map((g) => {
      const m = new THREE.Mesh(g, material);
      m.layers.set(1);
      m.renderOrder = 5;
      m.frustumCulled = false;
      this.group.add(m);
      return m;
    });
    this.group.visible = false;
    this.active = false;
    this.reduced = false;
  }

  setReducedMotion(on) {
    this.reduced = on;
    this.uniforms.uFlow.value = on ? 0 : 1;
  }

  // Strahl tritt ruhig aus (Kopf läuft weich an und aus) und endet sauber (Ende holt den Kopf ein). Ein neuer
  // Druck während des Ausklingens setzt den laufenden Strahl fort, statt neu anzusetzen.
  start() {
    if (!this.group.visible) this._head = 0;
    this.active = true;
    this.group.visible = true;
    this._tail = 0;
    if (this.reduced) this._head = 1;
    this._apply();
  }

  _apply() {
    const s = (x) => x * x * (3 - 2 * x);
    this.uniforms.uHead.value = s(this._head || 0);
    this.uniforms.uTail.value = s(this._tail || 0);
  }

  stop() {
    this.active = false;
    if (this.reduced) this.hide();
  }

  hide() {
    this.active = false;
    this._head = 0;
    this._tail = 0;
    this._apply();
    this.group.visible = false;
  }

  // Gibt true zurück, solange sich etwas bewegt (Renderbedarf).
  update(dt) {
    if (!this.group.visible) return false;
    const u = this.uniforms;
    u.uTime.value += dt;
    this._head = Math.min(1, (this._head || 0) + dt / 0.36);
    if (this.active) {
      this._tail = 0;
    } else {
      this._tail = Math.min(1, (this._tail || 0) + dt / 0.32);
      if (this._tail >= 1) { this.hide(); return true; }
    }
    this._apply();
    return true;
  }
}
