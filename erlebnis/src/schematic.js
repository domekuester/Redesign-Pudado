// Schematische Umgebung für „Anschluss verstehen“: Wand, WC, Waschtisch, Eckventile und
// bestehende Zuläufe (bauseits, nicht Teil des Sets) sowie animierte Wasserwege.
import * as THREE from 'three';

// Bauseits (nicht Teil des Sets): ruhige, matte Keramik ohne Licht und Glanz. Nur die Set-Teile
// tragen Metall, Reflexe und Schatten; die Umgebung gibt Orientierung und tritt zurück.
const GHOST = '#F4F2EE';
const EDGE = '#9C958B';
const DRAIN = '#DEDAD4';   // Abfluss bewusst grau abgesetzt

function ghostMaterial(color = GHOST) {
  return new THREE.MeshBasicMaterial({ color, transparent: false, opacity: 1, depthWrite: true });
}

function withEdges(mesh, threshold = 30) {
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, threshold),
    new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.55 })
  );
  lines.layers.set(1);
  mesh.add(lines);
  return mesh;
}

function ghost(geometry, position, rotation, color) {
  const m = withEdges(new THREE.Mesh(geometry, ghostMaterial(color)));
  m.layers.set(1);
  if (position) m.position.copy(position);
  if (rotation) m.rotation.copy(rotation);
  return m;
}

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// Badsituationen in Weltkoordinaten (m, Boden y = 0, Wand z = WALL_Z, WC-Mitte x = 0).
// Abstände orientieren sich an üblichen Badmaßen, sind aber schematisch und keine Planungsvorgabe.
// Die Halterung bleibt in beiden Fällen neben dem WC.
export const WALL_Z = -0.075;
const BRACKET = V3(-0.46, 0.36, WALL_Z + 0.007);   // Plattenrückseite an der Wand

export const SCENARIOS = {
  wc: {
    angleValve: V3(-0.26, 0.17, -0.012),            // Eckventil seitlich am WC
    teeYaw: -0.35,                                  // Abzweig zeigt zur Halterung (links)
    // Nachher: Anschlussschlauch des Sets vom T-Stück zum Spülkasten-Einlass (Länge noch festzulegen)
    cisternInlet: V3(-0.15, 0.419, -0.012),
    flexWaypoints: [V3(-0.258, 0.315, -0.012), V3(-0.228, 0.35, -0.012), V3(-0.172, 0.358, -0.012)],
    bracket: BRACKET,
    // Großzügige hängende U-Schlaufe; illustrative Anordnung, keine bestätigte Schlauchlänge.
    hose: [V3(-0.462, 0.3, -0.035), V3(-0.465, 0.16, -0.01), V3(-0.44, 0.075, 0.018), V3(-0.37, 0.065, 0.025), V3(-0.33, 0.13, 0.008), V3(-0.322, 0.215, -0.012)],
    shadowCenter: V3(-0.2, 0, 0.1),
    // Überblick auf die Verbindungen (Halterung bis Spülkasteneinlass), WC nur angeschnitten als Bezug
    overview: { target: V3(-0.31, 0.33, 0.02), dir: V3(0.22, 0.2, 1), radius: 0.24 },
  },
  basin: {
    angleValve: V3(-0.74, 0.55, -0.012),            // Kaltwasser-Eckventil unter dem Waschtisch (rechts, Richtung WC)
    teeYaw: Math.PI - 0.35,                         // Abzweig zeigt zum WC (rechts)
    consumerPoints: [V3(-0.74, 0.636, -0.012), V3(-0.74, 0.66, -0.012), V3(-0.79, 0.685, 0.01), V3(-0.84, 0.7, 0.05), V3(-0.86, 0.705, 0.07)],
    warmValve: V3(-1.05, 0.55, -0.012),                 // Warmwasser-Eckventil (bleibt unverändert)
    warmPoints: [V3(-1.05, 0.572, -0.012), V3(-1.05, 0.6, -0.012), V3(-1.0, 0.68, 0.01), V3(-0.96, 0.7, 0.05), V3(-0.94, 0.705, 0.07)],
    drainPoint: V3(-0.905, 0.6, 0.11),                  // Siphon (Anker für die Beschriftung)
    // Vorher: Zuleitung der Armatur direkt am Eckventil
    beforePoints: [V3(-0.74, 0.572, -0.012), V3(-0.74, 0.61, -0.012), V3(-0.79, 0.68, 0.01), V3(-0.84, 0.7, 0.05), V3(-0.86, 0.705, 0.07)],
    bracket: BRACKET,
    hose: [V3(-0.47, 0.29, -0.025), V3(-0.48, 0.15, 0.015), V3(-0.55, 0.075, 0.04), V3(-0.63, 0.17, 0.045), V3(-0.66, 0.4, 0.035), V3(-0.67, 0.53, 0.02)],
    shadowCenter: V3(-0.5, 0, 0.1),
    overview: { target: V3(-0.66, 0.47, 0.06), dir: V3(0.12, 0.18, 1), radius: 0.4 },
  },
};

// Eckventil (schematisch, bauseits) an Position a; Ausgang nach oben bis outletY
function angleValveGhost(a, outletY) {
  const g = new THREE.Group();
  const zw = WALL_Z;
  g.add(ghost(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 40).rotateX(Math.PI / 2), V3(a.x, a.y, zw + 0.003)));
  const stubLen = a.z - zw;
  g.add(ghost(new THREE.CylinderGeometry(0.0085, 0.0085, stubLen, 24).rotateX(Math.PI / 2), V3(a.x, a.y, zw + stubLen / 2)));
  g.add(ghost(new THREE.SphereGeometry(0.0135, 28, 16), a.clone()));
  g.add(ghost(new THREE.CylinderGeometry(0.0088, 0.0088, outletY - a.y, 24), V3(a.x, (a.y + outletY) / 2, a.z)));
  g.add(ghost(new THREE.CylinderGeometry(0.006, 0.006, 0.022, 20).rotateX(Math.PI / 2), V3(a.x, a.y, a.z + 0.02)));
  g.add(ghost(new THREE.CylinderGeometry(0.013, 0.013, 0.008, 32).rotateX(Math.PI / 2), V3(a.x, a.y, a.z + 0.034)));
  return g;
}

function lineGhost(points, radius = 0.0052) {
  const curve = new THREE.CatmullRomCurve3(points);
  return { mesh: ghost(new THREE.TubeGeometry(curve, 64, radius, 12, false)), curve };
}

export function buildSchematic() {
  const groups = {};
  ['wall', 'wcBody', 'wcValve', 'wcRigid', 'basinBody', 'basinValve', 'basinLine', 'basinBefore', 'basinWarm', 'basinDrain'].forEach((k) => {
    groups[k] = new THREE.Group();
    groups[k].layers.set(1);
  });

  // Wand (ruhige Fläche, keine Badezimmerwelt)
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.15),
    new THREE.MeshBasicMaterial({ color: '#E9E5DF', transparent: true, opacity: 1, depthWrite: true })
  );
  wall.position.set(-0.45, 0.575, WALL_Z);
  wall.layers.set(1);
  groups.wall.add(wall);

  // WC (stehend, aufgesetzter Spülkasten) – nur Umriss
  // Schüssel als Drehkörper, in der Tiefe gestreckt (ovale Form), Fuß schmal
  const bowlProfile = [[0.0, 0.0], [0.085, 0.0], [0.095, 0.12], [0.12, 0.26], [0.165, 0.36], [0.18, 0.4], [0.17, 0.41], [0.0, 0.41]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const bowl = new THREE.LatheGeometry(bowlProfile, 48).scale(1, 1, 1.42);
  groups.wcBody.add(ghost(bowl, V3(0, 0, 0.27)));
  const seat = new THREE.CylinderGeometry(0.182, 0.182, 0.018, 48).scale(1, 1, 1.42);
  groups.wcBody.add(ghost(seat, V3(0, 0.42, 0.27)));
  groups.wcBody.add(ghost(new THREE.BoxGeometry(0.16, 0.06, 0.12), V3(0, 0.4, 0.02)));   // Übergang zum Spülkasten
  groups.wcBody.add(ghost(new THREE.BoxGeometry(0.38, 0.34, 0.17), V3(0, 0.6, WALL_Z + 0.085)));   // Spülkasten
  const wcSc = SCENARIOS.wc;
  groups.wcValve.add(angleValveGhost(wcSc.angleValve, wcSc.angleValve.y + 0.022));
  const inlet = wcSc.cisternInlet;
  groups.wcBody.add(ghost(new THREE.CylinderGeometry(0.011, 0.011, 0.014, 24), V3(inlet.x, inlet.y + 0.007, inlet.z)));
  // Vorher: zugängliche, austauschbare starre Anschlussleitung Eckventil → Spülkasten (Beispiel)
  const a0 = wcSc.angleValve.clone().setY(wcSc.angleValve.y + 0.022);
  const zc = a0.z;
  const rigid = new THREE.CurvePath();
  rigid.add(new THREE.LineCurve3(a0, V3(a0.x, 0.325, zc)));
  rigid.add(new THREE.QuadraticBezierCurve3(V3(a0.x, 0.325, zc), V3(a0.x, 0.345, zc), V3(a0.x + 0.02, 0.345, zc)));
  rigid.add(new THREE.LineCurve3(V3(a0.x + 0.02, 0.345, zc), V3(inlet.x - 0.02, 0.345, zc)));
  rigid.add(new THREE.QuadraticBezierCurve3(V3(inlet.x - 0.02, 0.345, zc), V3(inlet.x, 0.345, zc), V3(inlet.x, 0.365, zc)));
  rigid.add(new THREE.LineCurve3(V3(inlet.x, 0.365, zc), inlet.clone()));
  groups.wcRigid.add(ghost(new THREE.TubeGeometry(rigid, 120, 0.0045, 12, false)));

  // Waschtisch mit Armatur – nur Umriss
  groups.basinBody.add(ghost(new THREE.BoxGeometry(0.5, 0.15, 0.42), V3(-0.9, 0.775, 0.135)));
  groups.basinBody.add(ghost(new THREE.CylinderGeometry(0.018, 0.018, 0.13, 24), V3(-0.9, 0.915, -0.02)));
  groups.basinBody.add(ghost(new THREE.CylinderGeometry(0.009, 0.009, 0.1, 16).rotateX(Math.PI / 2), V3(-0.9, 0.97, 0.03)));
  const bSc = SCENARIOS.basin;
  groups.basinValve.add(angleValveGhost(bSc.angleValve, bSc.angleValve.y + 0.022));
  const basinLine = lineGhost(bSc.consumerPoints);
  groups.basinLine.add(basinLine.mesh);
  groups.basinLine.add(ghost(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 20), V3(-0.86, 0.703, 0.07)));

  // Warmwasser: eigenes Eckventil mit eigener Zuleitung zur Armatur (unverändert, nicht frei schwebend)
  groups.basinWarm.add(angleValveGhost(bSc.warmValve, bSc.warmValve.y + 0.022));
  groups.basinWarm.add(lineGhost(bSc.warmPoints).mesh);
  // Abfluss: Siphon vom Becken in die Wand – kein Anschlusspunkt für das Set
  const drain = new THREE.CurvePath();
  const d0 = V3(-0.9, 0.7, 0.1);
  drain.add(new THREE.LineCurve3(d0, V3(-0.9, 0.62, 0.1)));
  drain.add(new THREE.QuadraticBezierCurve3(V3(-0.9, 0.62, 0.1), V3(-0.9, 0.585, 0.1), V3(-0.9, 0.59, 0.07)));
  drain.add(new THREE.QuadraticBezierCurve3(V3(-0.9, 0.59, 0.07), V3(-0.9, 0.6, 0.04), V3(-0.9, 0.6, 0.02)));
  drain.add(new THREE.LineCurve3(V3(-0.9, 0.6, 0.02), V3(-0.9, 0.6, WALL_Z)));
  groups.basinDrain.add(ghost(new THREE.TubeGeometry(drain, 80, 0.015, 16, false), null, null, DRAIN));

  const basinBefore = lineGhost(bSc.beforePoints);
  groups.basinBefore.add(basinBefore.mesh);

  return { groups, curves: { wcRigid: rigid, basin: basinLine.curve, basinBefore: basinBefore.curve } };
}

// Animierte Wasserwege als schematische Linien (über allem gezeichnet)
const FLOW_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FLOW_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uLength;
  uniform float uOpacity;
  uniform float uFlow;
  uniform vec3 uColor;
  uniform float uScale;
  varying vec2 vUv;
  void main() {
    float d = vUv.x * uLength / 0.012 - uTime * 1.6 * uFlow;
    float dash = smoothstep(0.15, 0.3, fract(d)) * (1.0 - smoothstep(0.55, 0.7, fract(d)));
    float a = mix(0.3, 0.95, dash) * uOpacity * uScale;
    gl_FragColor = vec4(uColor, a);
  }
`;

export class FlowLine {
  // Zwei Durchgänge mit derselben Geometrie: sichtbare Abschnitte kräftig, von Bauteilen verdeckte
  // Abschnitte nur angedeutet (wie ein Schnitt), statt mit voller Deckkraft durch massive Teile
  constructor(points, color = '#235FD0') {
    this.uniforms = {
      uTime: { value: 0 },
      uLength: { value: 1 },
      uOpacity: { value: 0 },
      uFlow: { value: 1 },
      uColor: { value: new THREE.Color(color) },
    };
    const make = (scale, depthTest) => new THREE.ShaderMaterial({
      vertexShader: FLOW_VERT,
      fragmentShader: FLOW_FRAG,
      uniforms: { ...this.uniforms, uScale: { value: scale } },
      transparent: true,
      depthTest,
      depthWrite: false,
    });
    this.material = make(1, true);
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material);
    this.hidden = new THREE.Mesh(this.mesh.geometry, make(0.32, false));
    for (const m of [this.mesh, this.hidden]) {
      m.layers.set(1);
      m.frustumCulled = false;
    }
    this.mesh.renderOrder = 21;
    this.hidden.renderOrder = 20;
    this.mesh.add(this.hidden);
    this.target = 0;
    if (points) this.setPoints(points);
  }

  setPoints(points) {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.TubeGeometry(curve, Math.max(16, points.length * 16), 0.0012, 8, false);
    this.hidden.geometry = this.mesh.geometry;
    this.uniforms.uLength.value = curve.getLength();
  }

  update(dt, reduced) {
    this.uniforms.uFlow.value = reduced ? 0 : 1;
    this.uniforms.uTime.value += dt;
    const o = this.uniforms.uOpacity;
    const k = reduced ? 1 : Math.min(1, dt * 6);
    o.value += (this.target - o.value) * k;
    this.mesh.visible = o.value > 0.01;
    return this.mesh.visible;
  }
}
