// Produktbühne: Szene, Licht, Materialien, Anordnung der drei Ansichten und Kameraführung.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { brushedTextures, turnedTextures, ribNormalTexture, braidNormalTexture, grainNormalTexture, logoTexture } from './textures.js';
import { ContactShadow } from './contactShadow.js';
import { WaterSpray } from './water.js';
import { Hose } from './hose.js';
import { buildSchematic, FlowLine, SCENARIOS, WALL_Z } from './schematic.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
// Kamerafahrten aus dem Stand: setzen sofort spürbar ein und laufen lang aus (kein Zögern am Anfang wie bei
// reinem ease-in-out, kein harter Start wie bei reinem ease-out); Charakter der Signaturkurve in DESIGN.md
const easeCam = (t) => 0.35 * easeInOut(t) + 0.65 * easeOut(t);
const Y = V(0, 1, 0);
const DIM = 0.2; // Deckkraft nicht hervorgehobener Teile
// Metallgrundfarbe für die Darstellung: heller als der Farbcode der Bildvorlage (KS-01, #B7B4AE),
// weil das Foto Licht und Schatten bereits enthält. Gleicher Farbton, warmes Silber.
// Abgeglichen mit der Blender-Eröffnung (mittlere Produkthelligkeit 155/255 in beiden Bildern).
const METAL_RENDER_HEX = '#CFCCC6';   // wie blender/opening_scene.py (METAL_HEX)
// Setansicht: Studiohintergrund (Boden, Hohlkehle, Wand). Die Halterung hängt an der Wand wie in
// der Vorlage „Set mit Halterung“; die übrigen Teile liegen davor auf dem Boden.
const SET_WALL_Z = -0.05;
// Nicht gewählte Bauteile treten zurück: deckend, aber zur Hintergrundfarbe hin aufgehellt
// (keine Transparenz, damit Verdeckungen und Formen lesbar bleiben)
const MUTE = 0.34;        // Tonwertrücknahme nicht gewählter Teile: Metall und Form bleiben lesbar
const MUTE_COLOR = new THREE.Color().setRGB(0.9, 0.886, 0.866);   // Ausgaberaum (sRGB), etwas dunkler als der Hintergrund
const SET_PARTS = ['handbidet', 'bracket', 'tvalve', 'hose', 'flexhose'];
const MUTE_CONNECT = 0.5;   // Anschluss: Set-Teile außerhalb des aktuellen Schritts

/* ------------------------------------------------------------------------ */
/* Studiolicht als Umgebungstextur: Verlauf + Softboxen + dunkle Abschatter. */
function studioEnvironment(renderer) {
  const env = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(20, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `varying vec3 vP; void main(){
        float y = vP.y;
        vec3 top = vec3(0.62), hor = vec3(0.44), bot = vec3(0.12);
        vec3 c = y > 0.0 ? mix(hor, top, pow(y, 0.65)) : mix(hor, bot, pow(-y, 0.4));
        gl_FragColor = vec4(c, 1.0); }`,
    })
  );
  env.add(dome);
  // Softbox mit weich auslaufenden Kanten (keine harten Rechteck-Spiegelungen)
  const panel = (w, h, intensity, pos, dark = false, soft = 0.22, tint = [1, 1, 1]) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        uniforms: { uI: { value: intensity }, uDark: { value: dark ? 1 : 0 }, uSoft: { value: soft }, uTint: { value: new THREE.Vector3(...tint) } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: `uniform float uI; uniform float uDark; uniform float uSoft; uniform vec3 uTint; varying vec2 vUv; void main(){
          vec2 e = smoothstep(vec2(0.0), vec2(uSoft), vUv) * smoothstep(vec2(0.0), vec2(uSoft), 1.0 - vUv);
          float a = e.x * e.y;
          gl_FragColor = uDark > 0.5 ? vec4(vec3(0.02), a * 0.92) : vec4(uTint * uI, a); }`,
      })
    );
    m.position.copy(pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(4.5, 9, 1.9, V(-8, 2.5, 5), false, 0.12, [1.04, 1.0, .93]);   // Fenster links vorn (hoch, wie in der Eröffnung), klare Kanten
  // Fenstersprossen: gerichtete, wiedererkennbare Spiegelung statt gleichmäßiger Helligkeit
  panel(0.35, 9.2, 0, V(-7.6, 2.5, 4.75), true, 0.3);
  panel(4.7, 0.3, 0, V(-7.6, 3.4, 4.75), true, 0.3);
  panel(5, 3, 0.9, V(-5, 7, 5));          // Himmel über dem Fenster (weich)
  panel(1.8, 10, 3.0, V(8, 1.5, -3), false, .22, [.94, .98, 1.05]);     // Streiflicht rechts hinten
  panel(9, 3, 0.7, V(0, 10, 0.5));         // Oberlicht (gedämpft: Kopfoberseite nicht überstrahlen)
  panel(4, 5, 1.1, V(6, 1, 7));           // Aufheller rechts vorn
  panel(2.2, 11, 0, V(1.4, 0.6, 9.5), true);  // dunkler Streifen vorn (Formkontrast)
  panel(3, 11, 0, V(-9, 0.6, -2), true);      // dunkler Streifen links hinten
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  return tex;
}

/* ------------------------------------------------------------------------ */
class Tweens {
  constructor() { this.list = new Set(); }
  add({ duration, ease = easeInOut, update, complete }) {
    const t = { duration: Math.max(0, duration), elapsed: 0, ease, update, complete, done: false };
    if (t.duration === 0) {
      update(1);
      complete && complete();
      return t;
    }
    this.list.add(t);
    return t;
  }
  cancel(t) { if (t) this.list.delete(t); }
  update(dt) {
    if (!this.list.size) return false;
    for (const t of [...this.list]) {
      t.elapsed += dt;
      const p = Math.min(1, t.elapsed / t.duration);
      t.update(t.ease(p));
      if (p >= 1) {
        this.list.delete(t);
        t.complete && t.complete();
      }
    }
    return true;
  }
}

/* ------------------------------------------------------------------------ */
export class Stage extends EventTarget {
  constructor(canvas, overlay, { reducedMotion = false, finishHex = '#B7B4AE', content } = {}) {
    super();
    if (!content || !content.components || !content.connectLabels) throw new Error('Stage: Produktdaten fehlen');
    this.content = content;
    this.canvas = canvas;
    this.overlay = overlay;
    this.reduced = reducedMotion;
    this.finishHex = finishHex;
    this.view = 'discover';
    this.exploded = 0;
    this.leverOpen = true;
    this.highlight = null;
    this.scenario = 'wc';
    this.compare = 'after';   // Vorher/Nachher im Schritt „Vorher und nachher“
    this.selected = null;
    this.tweens = new Tweens();
    this.dirty = true;
    this.shadowDirty = true;
    this._last = performance.now();
    this.labels = [];
    this.userMovedCamera = false;
    // Von Bedienelementen belegte Ränder der Bühne (px); Kamera und Labels halten sie frei
    this.insets = { top: 0, right: 0, bottom: 0, left: 0 };
    // Objektiv-Übergang nach der Eröffnung: 0 = Bildausschnitt des Videos (das die ganze
    // Eröffnungsfläche füllt), 1 = normale Bühnenkamera (28°, Versatz für Bedienelemente)
    this._lensMix = 1;
    this._lensVideo = null;
    this.paused = false;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));   // endgültig in resize() (Pixelbudget)
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0xffffff, 0);
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.environment = studioEnvironment(renderer);
    this.scene.environmentIntensity = 1.6;   // an die Blender-Renderings angeglichen (Messung in docs/qa/eroeffnung)

    this.camera = new THREE.PerspectiveCamera(28, 1, 0.005, 6);
    this.camera.layers.enable(1);
    this.camera.position.set(-0.3, 0.2, 0.45);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = !this.reduced;
    this.controls.dampingFactor = 0.12;
    this.controls.rotateSpeed = 0.7;
    this.controls.zoomSpeed = 0.8;
    this.controls.addEventListener('start', () => {
      // Hand schlägt Automatik: laufende Kamerafahrt an der aktuellen Stelle beenden
      if (this._camTween && this.tweens.list.has(this._camTween)) this._endFlight(this.currentPreset || this._preset(this.view), true);
      this.dragging = true;
      this.userMovedCamera = true;
      this.dispatchEvent(new Event('interaction'));
    });
    this.controls.addEventListener('end', () => { this.dragging = false; });
    this.controls.addEventListener('change', () => { this.dirty = true; });

    this.shadow = new ContactShadow(renderer, { size: 1.3, height: 0.3 });
    this.shadow.group.position.set(-0.08, 0, 0.05);
    this.scene.add(this.shadow.group);

    this._bindKeys();
    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(canvas.parentElement);
    this._resizeObserver.observe(canvas);   // während der Übergabe breiter als die Bühne (styles.css)
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('contextlost'));
    });
    this.resize();
  }

  /* ---------------------------------------------------------------- Laden */
  // Fehlerarten: 'load' (Datei nicht geladen/gelesen), 'model' (Bestandteil fehlt), 'setup' (Szenenaufbau)
  async load(url, onProgress) {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('vendor/three/addons/libs/draco/gltf/');   // lokal, kein CDN
    loader.setDRACOLoader(draco);
    let gltf;
    try {
      gltf = await new Promise((resolve, reject) => {
        loader.load(url, resolve, (e) => {
          if (onProgress && e.total) onProgress(e.loaded / e.total);
        }, reject);
      });
    } catch (cause) {
      throw stageError('load', 'Modelldatei konnte nicht geladen oder gelesen werden', cause);
    }
    if (document.fonts && document.fonts.load) {
      try { await document.fonts.load('500 40px "Cabinet Grotesk"'); } catch (_) { /* Fallbackschrift reicht */ }
    }
    try {
      this._setup(gltf.scene);
      this._start();
    } catch (err) {
      throw err.kind ? err : stageError('setup', 'Szene konnte nicht aufgebaut werden', err);
    }
  }

  _material(name) {
    if (!this._tex) {
      const brushed = brushedTextures();
      brushed.rough.repeat.set(3, 1);
      brushed.normal.repeat.set(3, 1);
      this._tex = { brushed: brushed.rough, brushedNormal: brushed.normal, rib: ribNormalTexture() };
    }
    switch (name) {
      case 'Metal_Brushed':
        // Längsbürstung: Anisotropie entlang der exportierten Tangenten, Rauheitsbahnen und feine Linien im
        // sichtbaren Maßstab. Mehr Anisotropie (0,5) brennt den Kopf zu einer gleichmäßig hellen Fläche aus
        // (Vergleich docs/qa/qualitaet/produkt/varianten/); 0,25 bei Rauheit 0,28 zeigt gerichtete Glanzbänder
        const m = new THREE.MeshPhysicalMaterial({
          name, color: METAL_RENDER_HEX, metalness: 1, roughness: 0.28,
          roughnessMap: this._tex.brushed, anisotropy: 0.25, anisotropyRotation: 0,
          normalMap: this._tex.brushedNormal, normalScale: new THREE.Vector2(0.09, 0.09),
        });
        addEdgeCalm(m);
        return m;
      case 'Metal_Satin':
        // Stirnfläche: konzentrische Struktur, keine Rauheitskarte
        return new THREE.MeshPhysicalMaterial({ name, color: METAL_RENDER_HEX, metalness: 1, roughness: 0.27, anisotropy: 0.25 });
      case 'Metal_Thread':
        // Gewinde und Schlauchmuttern: gedreht und glatt, glänzender als die gebürstete Oberfläche
        return new THREE.MeshPhysicalMaterial({ name, color: '#DAD8D4', metalness: 1, roughness: 0.17 });
      case 'Rubber_Dark':
        // Düseneinsatz: im Eröffnungsfilm mittel- bis dunkelgrau mit lesbaren Noppen, nicht blauschwarz
        // (Abgleich docs/qa/qualitaet/bewegung/details/)
        return new THREE.MeshPhysicalMaterial({ name, color: '#4A4C50', metalness: 0, roughness: 0.62, clearcoat: 0.08, clearcoatRoughness: 0.5 });
      case 'Nozzle_Hole':
        return new THREE.MeshStandardMaterial({ name, color: '#050506', metalness: 0, roughness: 0.95 });
      case 'Bracket_Matte':
        // Matter Kunststoff mit weichem Streiflicht an den Kanten (Vorlage: „soft-touch“, matt schwarz). Etwas
        // glatter als zuvor (0,74) und mit schwachem, rauem Klarlack: Fase und Arme fangen Licht, die Fläche
        // bleibt schwarz (Vergleich docs/qa/qualitaet/produkt/varianten/tafel-halterung.png, H2)
        if (!this._tex.grain) this._tex.grain = grainNormalTexture();
        return new THREE.MeshPhysicalMaterial({
          name, color: '#26282C', metalness: 0, roughness: 0.58,
          clearcoat: 0.25, clearcoatRoughness: 0.45,
          sheen: 0.55, sheenColor: '#6E7178', sheenRoughness: 0.7,
          normalMap: this._tex.grain, normalScale: new THREE.Vector2(0.18, 0.18),
        });
      default:
        return new THREE.MeshStandardMaterial({ name, color: '#999', roughness: 0.5 });
    }
  }

  _applyMaterials(obj, list) {
    obj.traverse((o) => {
      if (o.isMesh) {
        o.material = this._material(o.material && o.material.name);
        if (o.name === 'HB_CapFace') {
          this._tex.turned ||= turnedTextures();
          o.material.normalMap = this._tex.turned.normal;
          o.material.normalScale.set(.055, .055);
          o.material.roughnessMap = this._tex.turned.rough;
          o.material.roughness = .3;
          addEdgeCalm(o.material);
        }
        if (!o.geometry.attributes.uv) { o.material.roughnessMap = null; o.material.normalMap = null; }
        // Anisotropie nur mit exportierten Tangenten; sonst entstehen Dreiecksfacetten
        if (!o.geometry.attributes.tangent && o.material.anisotropy) o.material.anisotropy = 0;
        list.push(o.material);
      }
    });
  }

  _decal(mesh, anchor, size, color, metal, list, parent) {
    const pos = anchor.getWorldPosition(new THREE.Vector3());
    const normal = V(1, 0, 0).applyQuaternion(anchor.getWorldQuaternion(new THREE.Quaternion())).normalize();
    const m = new THREE.Matrix4().lookAt(pos.clone().add(normal), pos, Y);
    const euler = new THREE.Euler().setFromRotationMatrix(m);
    const { texture, aspect } = logoTexture({ color, layout: 'stack' });
    const geo = new DecalGeometry(mesh, pos, euler, V(size, size / aspect, size * 1.2));
    const mat = new THREE.MeshPhysicalMaterial({
      map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4,
      metalness: metal ? 0.7 : 0, roughness: metal ? 0.55 : 0.7,
    });
    mat.userData.decal = true;
    list.push(mat);
    const d = new THREE.Mesh(geo, mat);
    d.renderOrder = 2;
    parent.add(d);
    return d;
  }

  // Logo auf ebener Fläche (Halterung): einfache Fläche statt projiziertem Decal
  _flatLogo(anchor, size, color, list, parent, normal = V(0, 0, 1)) {
    const { texture, aspect } = logoTexture({ color, layout: 'stack' });
    const mat = new THREE.MeshPhysicalMaterial({
      map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4,
      metalness: 0, roughness: 0.7,
    });
    mat.userData.decal = true;
    list.push(mat);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size / aspect), mat);
    m.position.copy(anchor.getWorldPosition(new THREE.Vector3())).addScaledVector(normal, 0.0002);
    m.lookAt(m.position.clone().add(normal));
    m.renderOrder = 2;
    parent.add(m);
    return m;
  }

  _setup(root) {
    const REQUIRED = ['Handbidet', 'Bracket', 'TValve', 'HoseNut', 'HB_Handle', 'HB_Button', 'HB_ButtonAxis', 'HB_LogoAnchor',
      'HB_NozzleCenter', 'HB_Port', 'BR_Plate', 'BR_Seat', 'BR_LogoAnchor', 'TV_ValveBody', 'TV_LeverPivot', 'TV_LogoAnchor',
      'TV_PortIn', 'TV_PortOut', 'TV_PortBranch', 'HN_HoseStart'];
    const present = new Set();
    root.traverse((o) => { if (o.name) present.add(o.name); });
    const missing = REQUIRED.filter((n) => !present.has(n));
    if (missing.length) throw stageError('model', `Im Modell fehlen Bestandteile: ${missing.join(', ')}`);
    const named = {};
    root.traverse((o) => { if (o.name) named[o.name] = o; });
    const get = (n) => named[n];
    const comp = (id, roots, materials) => ({ id, roots, materials, opacity: 1 });

    const hb = get('Handbidet');
    const br = get('Bracket');
    const tv = get('TValve');
    const nutA = get('HoseNut');
    [hb, br, tv, nutA].forEach((o) => {
      o.removeFromParent();
      o.position.set(0, 0, 0);
      o.quaternion.identity();
      o.updateMatrixWorld(true);
    });
    const nutB = nutA.clone(true);
    // Zusätzlicher Anschlussschlauch: eigene Muttern (Darstellung verkleinert, Maße noch festzulegen)
    const FLEX_NUT_SCALE = 0.82;
    const nutC = nutA.clone(true);
    const nutD = nutA.clone(true);
    [nutC, nutD].forEach((n) => n.scale.setScalar(FLEX_NUT_SCALE));
    this.flexNutLen = 0.0306 * FLEX_NUT_SCALE;

    const mats = { handbidet: [], bracket: [], tvalve: [], hose: [], flexhose: [] };
    this._applyMaterials(hb, mats.handbidet);
    this._applyMaterials(br, mats.bracket);
    this._applyMaterials(tv, mats.tvalve);
    this._applyMaterials(nutA, mats.hose);
    this._applyMaterials(nutB, mats.hose);
    this._applyMaterials(nutC, mats.flexhose);
    this._applyMaterials(nutD, mats.flexhose);

    // Bedienknopf: satinierte Kuppel ohne Bürststruktur (auf der kleinen Wölbung wirkte sie wie Kratzer)
    const btnMesh = get('HB_Button');
    if (btnMesh.isMesh) {
      const old = btnMesh.material;
      btnMesh.material = this._material('Metal_Satin');
      mats.handbidet[mats.handbidet.indexOf(old)] = btnMesh.material;
    }
    // Außengewinde als durchgehender Gewindegang statt einzelner Ringe (Maße aus dem Modell)
    for (const n of ['HB_Thread', 'TV_ThreadOut']) helicalThread(get(n));

    // Logos als Decals (Lage aus Blender-Ankern)
    this._decal(get('HB_Handle'), get('HB_LogoAnchor'), 0.0118, '#3B3A38', false, mats.handbidet, hb);   // matte Gravur wie im Rendering
    this._flatLogo(get('BR_LogoAnchor'), 0.019, '#C7CCD4', mats.bracket, br);
    const tvAnchor = get('TV_LogoAnchor');
    tvAnchor.rotation.set(0, 0, 0);
    this._decal(get('TV_ValveBody'), tvAnchor, 0.0095, '#4C4B48', true, mats.tvalve, tv);

    // Merkpunkte
    const p = (n) => get(n).position.clone();
    this.pts = {
      nozzle: p('HB_NozzleCenter'),
      port: p('HB_Port'),
      seat: p('BR_Seat'),
      tvIn: p('TV_PortIn'),
      tvOut: p('TV_PortOut'),
      tvBranch: p('TV_PortBranch'),
      hoseStart: get('HN_HoseStart').position.clone(),
    };
    this.button = get('HB_Button');
    const axis = get('HB_ButtonAxis');
    this.buttonRest = this.button.position.clone();
    this.buttonDir = V(1, 0, 0).applyQuaternion(axis.quaternion).normalize();
    this.lever = get('TV_LeverPivot');

    // Schlauchmuttern hängen am jeweiligen Gegenstück (folgen dessen Lage)
    hb.add(nutA);
    nutA.quaternion.setFromAxisAngle(V(0, 0, 1), Math.PI);   // Öffnung nach oben, Schlauch nach unten
    tv.add(nutB);
    nutB.quaternion.setFromUnitVectors(Y, V(-1, 0, 0));        // Schlauch zeigt vom Abzweig weg
    this.nutA = nutA;
    this.nutB = nutB;
    this.nutAHome = V(this.pts.port.x, 0.0104, 0);
    this.nutBHome = this.pts.tvBranch.clone().add(V(0.011, 0, 0));

    // Schlauch
    // Brauseschlauch: blanke, gewickelte Metallspirale (glänzend, kräftige Rillen)
    const hoseMat = new THREE.MeshPhysicalMaterial({
      name: 'Hose', color: '#DCDAD6', metalness: 1, roughness: 0.15,
      normalMap: this._tex.rib, normalScale: new THREE.Vector2(1.05, 1.05),
    });
    mats.hose.push(hoseMat);
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this._tex.rib.anisotropy = maxAniso;
    addDetailFade(hoseMat);
    this.hose = new Hose(hoseMat);
    // Anschlussschlauch: dünner, mit feinem Edelstahlgeflecht und Pressmuffen an beiden Enden –
    // seidenmatt statt blank, dadurch klar vom gewickelten Brauseschlauch unterschieden
    const flexMat = new THREE.MeshPhysicalMaterial({
      name: 'FlexHose', color: '#CAC8C3', metalness: 1, roughness: 0.36,
      normalMap: braidNormalTexture(), normalScale: new THREE.Vector2(0.95, 0.95),
    });
    flexMat.normalMap.anisotropy = maxAniso;
    addDetailFade(flexMat);
    mats.flexhose.push(flexMat);
    this.flex = new Hose(flexMat, 0.0045, 0.0062, 4);
    // Pressmuffe zwischen Mutter und Geflecht (gedrehte Hülse mit zwei Presssicken; Darstellung)
    const k = FLEX_NUT_SCALE;
    const sleeveProfile = [[0.0046, 0], [0.0057, 0.0006], [0.0057, 0.003], [0.00535, 0.0036], [0.00535, 0.0046], [0.0057, 0.0052],
      [0.0057, 0.0084], [0.00535, 0.009], [0.00535, 0.01], [0.0057, 0.0106], [0.0057, 0.0116], [0.0047, 0.0124]]
      .map(([r, y]) => new THREE.Vector2(r / k, y / k));
    const sleeveGeo = new THREE.LatheGeometry(sleeveProfile, 36);
    const sleeveMat = this._material('Metal_Thread');
    mats.flexhose.push(sleeveMat);
    [nutC, nutD].forEach((nut) => {
      const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
      sleeve.position.y = 0.0306;
      nut.add(sleeve);
    });
    this.nutC = nutC;
    this.nutD = nutD;

    // Übergabe aus der Eröffnung: Schlauchmutter und hängender Brauseschlauch wie im Film (eigene
    // Materialkopien, damit die Deckkraft unabhängig vom Set-Schlauch bleibt)
    const hangMat = hoseMat.clone();
    hangMat.normalMap = hoseMat.normalMap.clone();
    hangMat.normalMap.needsUpdate = true;
    addDetailFade(hangMat);
    const nutH = nutA.clone(true);
    const hangMats = [hangMat];
    nutH.traverse((o) => {
      if (!o.material) return;
      o.material = o.material.clone();
      hangMats.push(o.material);
    });
    hb.add(nutH);
    nutH.position.copy(this.nutAHome);
    this.hangHose = new Hose(hangMat);
    this.hang = comp('hang', [this.hangHose.mesh, nutH], hangMats);
    this.hang.nut = nutH;
    for (const m of hangMats) {
      m.userData.baseOpacity = m.opacity;
      m.userData.baseTransparent = m.transparent;
      m.userData.baseDepthWrite = m.depthWrite;
    }

    // Wasser (am Handbidet befestigt)
    const jets = [];
    [[0.0032, 7, 0], [0.0066, 13, 0.2]].forEach(([r, n, off]) => {
      for (let k = 0; k < n; k++) {
        const a = (Math.PI * 2 * k) / n + off;
        jets.push({ offset: new THREE.Vector2(r * Math.cos(a), r * Math.sin(a)), spread: 9 });
      }
    });
    this.water = new WaterSpray({ origin: this.pts.nozzle.clone().add(V(-0.0006, 0, 0)), direction: V(-1, 0, 0), jets });
    this.water.setReducedMotion(this.reduced);
    hb.add(this.water.group);

    // Schematische Umgebung
    const schem = buildSchematic();
    this.schematic = schem;
    const ghostMats = (g) => {
      const list = [];
      g.traverse((o) => { if (o.material) list.push(o.material); });
      return list;
    };

    this.objects = { handbidet: hb, bracket: br, tvalve: tv };
    this.comps = {
      handbidet: comp('handbidet', [hb], mats.handbidet),
      bracket: comp('bracket', [br], mats.bracket),
      tvalve: comp('tvalve', [tv], mats.tvalve),
      hose: comp('hose', [this.hose.mesh, nutA, nutB], mats.hose),
      flexhose: comp('flexhose', [this.flex.mesh, nutC, nutD], mats.flexhose),
      ...Object.fromEntries(Object.entries(schem.groups).map(([k, g]) => [k, comp(k, [g], ghostMats(g))])),
    };
    for (const c of Object.values(this.comps)) {
      for (const m of c.materials) {
        m.userData.baseOpacity = m.opacity;
        m.userData.baseTransparent = m.transparent;
        m.userData.baseDepthWrite = m.depthWrite;
      }
    }
    this.scene.add(hb, br, tv, this.hose.mesh, this.flex.mesh, this.hangHose.mesh, nutC, nutD, ...Object.values(schem.groups));
    this._setOpacity(this.hang, 0);

    // Zurücktreten nicht gewählter Teile (Setansicht): je Bauteil ein gemeinsamer Wert
    for (const id of SET_PARTS) {
      const c = this.comps[id];
      c.mute = { value: 0 };
      for (const m of c.materials) addMute(m, c.mute);
    }

    // Studiohintergrund der Setansicht und weicher Wandschatten hinter Halterung und Handbidet
    this.backdrop = buildBackdrop(() => { this.dirty = true; });
    this.scene.add(this.backdrop);
    this.comps.backdrop = comp('backdrop', [this.backdrop], [this.backdrop.material]);
    this.backdrop.material.userData.baseOpacity = 1;
    this.backdrop.material.userData.baseTransparent = false;
    this.backdrop.material.userData.baseDepthWrite = true;
    this.wallShadow = new ContactShadow(this.renderer, { size: 0.44, height: 0.075, opacity: 0.42, darkness: 1.2, blur: 2.2 });
    this.wallShadow.group.rotation.x = Math.PI / 2;   // blickt von der Wand in den Raum
    this.wallShadow.group.position.set(0, 0.2, SET_WALL_Z + 0.0004);
    this.scene.add(this.wallShadow.group);
    this.comps.backdrop.roots.push(this.wallShadow.group);
    this.comps.backdrop.materials.push(this.wallShadow.plane.material);
    this.wallShadow.plane.material.userData.baseOpacity = this.wallShadow.plane.material.opacity;
    this.wallShadow.plane.material.userData.baseTransparent = true;
    this.wallShadow.plane.material.userData.baseDepthWrite = false;

    // Führungslinien der Explosionsansicht (was steckt worauf)
    this.guides = [0, 1, 2, 3].map(() => {
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(), V()]),
        new THREE.LineDashedMaterial({ color: '#235FD0', dashSize: 0.004, gapSize: 0.003, transparent: true, opacity: 0, depthTest: false }));
      line.layers.set(1);
      line.renderOrder = 10;
      line.frustumCulled = false;
      this.scene.add(line);
      return line;
    });

    // Wasserwege
    this.flows = { supply: new FlowLine(), consumer: new FlowLine(), branch: new FlowLine() };
    Object.values(this.flows).forEach((f) => this.scene.add(f.mesh));

    this._buildLabels();
    // Jedes Bauteil aus den Produktdaten braucht ein Gegenstück in der Szene und umgekehrt
    const missingComps = this.content.components.map((c) => c.id).filter((id) => !this.comps[id]);
    if (missingComps.length) throw stageError('setup', `Bauteile ohne Darstellung: ${missingComps.join(', ')}`);
    // Anfangszustand: Entdecken
    this._layoutState = this._layout('discover', 0);
    this._applyLayout(this._layoutState);
    this._applyOpacities(this._opacityTargets(), true);
    this.hose.setReveal(0);
    const preset = this._preset('discover');
    this._setCamera(preset);
    this._applyControlLimits('discover', preset);
  }

  /* ------------------------------------------------------------- Anordnung */
  // Liefert Ziel-Lage aller Teile für eine Ansicht.
  _layout(view, exploded) {
    const L = {};
    const q = (yaw) => new THREE.Quaternion().setFromAxisAngle(Y, yaw);
    if (view === 'discover') {
      L.handbidet = { pos: V(0, 0.022, 0), quat: q(0) };
      L.bracket = { pos: V(0.09, 0.07, -0.08), quat: q(-0.25) };
      L.tvalve = { pos: V(-0.14, 0, 0.06), quat: q(Math.PI + 0.6) };
      L.waypoints = this._setWaypoints(0);
      L.reveal = 0;
    } else if (view === 'set') {
      Object.assign(L, this._setLayout(exploded, this.selected));
    } else {
      // Badsituation: T-Ventil am dargestellten Eckventil, Halterung neben dem WC
      const sc = SCENARIOS[this.scenario];
      const brQuat = q(0);
      L.bracket = { pos: sc.bracket.clone(), quat: brQuat };
      L.handbidet = { pos: this.pts.seat.clone().add(sc.bracket), quat: brQuat.clone() };
      L.tvalve = { pos: this._teeInlet(sc).sub(this.pts.tvIn), quat: q(sc.teeYaw) };
      L.waypoints = sc.hose.map((v) => v.clone());
      L.reveal = 1;
    }
    L.exploded = view === 'set' ? exploded : 0;
    L.flex = this._flexLayout(view, L);
    return L;
  }

  // Anschlussschlauch: a/b = Mutteröffnung + Richtung, in der der Schlauch die Mutter verlässt
  _flexLayout(view, L) {
    const n = (x, y, z) => V(x, y, z).normalize();
    const tvTop = L.tvalve.pos.clone().add(V(0, 0.0525, 0).applyQuaternion(L.tvalve.quat));
    const floor = {
      a: { pos: V(0.095, 0.0101, 0.255), dir: n(1, 0, -0.35) },
      b: { pos: V(0.18, 0.0101, 0.13), dir: n(0, 0, 1) },
      wp: [V(0.13, 0.0046, 0.242), V(0.16, 0.0046, 0.215), V(0.177, 0.0046, 0.185)],
    };
    if (view === 'discover') return floor;
    if (view === 'set') return L.flex;
    const sc = SCENARIOS[this.scenario];
    if (this.scenario === 'wc') {
      return {
        a: { pos: tvTop, dir: V(0, 1, 0) },
        b: { pos: sc.cisternInlet.clone(), dir: V(0, -1, 0) },
        wp: sc.flexWaypoints.map((v) => v.clone()),
      };
    }
    // Waschtisch: Einsatz des Anschlussschlauchs offen, daher ausgeblendet (Lage nur für Übergänge)
    return {
      a: { pos: tvTop, dir: V(0, 1, 0) },
      b: { pos: tvTop.clone().add(V(0.06, 0.12, 0)), dir: V(0, -1, 0) },
      wp: [0.3, 0.55, 0.8].map((t) => tvTop.clone().add(V(0.06 * t, 0.12 * t + 0.03, 0))),
    };
  }

  // Weiter Weg (z. B. vom Boden über das T-Ventil beim Zerlegen): Der Schlauch nimmt einen Bogen nach vorn
  // oben, statt geradlinig durch die Bodenschlaufe des Brauseschlauchs zu ziehen
  _lerpFlex(A, B, t) {
    const far = Math.min(1, A.a.pos.distanceTo(B.a.pos) / 0.25);
    const bow = V(0, 0.045, 0.09).multiplyScalar(far * Math.sin(Math.PI * t));
    const lp = (x, y) => ({ pos: x.pos.clone().lerp(y.pos, t).add(bow), dir: x.dir.clone().lerp(y.dir, t).normalize() });
    return { a: lp(A.a, B.a), b: lp(A.b, B.b), wp: A.wp.map((p, i) => p.clone().lerp(B.wp[i], t).add(bow)) };
  }

  _buildFlex(F) {
    this.nutC.position.copy(F.a.pos);
    this.nutC.quaternion.setFromUnitVectors(Y, F.a.dir);
    this.nutD.position.copy(F.b.pos);
    this.nutD.quaternion.setFromUnitVectors(Y, F.b.dir);
    const a0 = F.a.pos.clone().addScaledVector(F.a.dir, this.flexNutLen);
    const b0 = F.b.pos.clone().addScaledVector(F.b.dir, this.flexNutLen);
    this.flex.build([a0, a0.clone().addScaledVector(F.a.dir, 0.017), ...F.wp, b0.clone().addScaledVector(F.b.dir, 0.017), b0]);   // gerade durch die Pressmuffe
    this._flexMid = this.flex.curve.getPointAt(0.5);
  }

  _teeInlet(sc) {
    return sc.angleValve.clone().add(V(0, 0.022, 0));
  }

  _setWaypoints(e) {
    // Lose Schlaufe am Boden zwischen Halterung und T-Ventil (Länge nicht maßstäblich)
    const r = 0.0069;
    const tvx = -0.13 - 0.05 * e;
    return [
      V(0.05 + 0.03 * e, 0.02 + 0.03 * e, 0.035 + 0.06 * e),
      V(0.075, r, 0.125),
      V(0.03, r, 0.205),
      V(-0.04, r, 0.215),
      V(tvx + 0.115 + 0.03 * e, r, 0.165),
      V(tvx + 0.1 + 0.03 * e, 0.018, 0.105),
    ];
  }

  /* Setansicht: komponierte Gesamtansicht. Zwei eigene Anordnungen: breit (Desktop) und schmal
   * (Smartphone, mehr Tiefe statt Breite). Halterung an der Wand, Handbidet darin (Anker BR_Seat);
   * der Brauseschlauch fällt senkrecht, legt sich in einem ruhigen Bogen nach vorn und endet am
   * Abzweig des T-Ventils; der Anschlussschlauch liegt getrennt in einem flachen Bogen daneben.
   * Schlauchlängen sind verkürzt und nicht maßstäblich. */
  _setConfig() {
    const r = 0.0069;   // Schlauchradius: Wegpunkte auf dem Boden
    const f = 0.0046;   // Anschlussschlauch auf dem Boden
    const nut = 0.0101; // liegende Mutter
    const n = (x, y, z) => V(x, y, z).normalize();
    // Brauseschlauch: fällt von der Mutter, setzt auf und läuft in einem einzigen Bogen (Ellipse um c,
    // Halbachsen rx/rz) zum Abzweig des T-Ventils. Der Abzweig zeigt dem ankommenden Schlauch entgegen.
    const arc = (c, rx, rz, deg, y = r) => {
      const t = THREE.MathUtils.degToRad(deg);
      return V(c.x + rx * Math.cos(t), y, c.z + rz * Math.sin(t));
    };
    const tee = (c, rx, rz, deg) => {
      const t = THREE.MathUtils.degToRad(deg);
      const tan = V(-rx * Math.sin(t), 0, rz * Math.cos(t)).normalize();   // Laufrichtung des Schlauchs
      const yaw = Math.atan2(-tan.z, tan.x);   // Abzweig (lokal -X) zeigt gegen die Laufrichtung
      const q = new THREE.Quaternion().setFromAxisAngle(Y, yaw);
      const approach = arc(c, rx, rz, deg, 0.036);
      const end = approach.clone().addScaledVector(tan, 0.018);   // Schlauchbeginn an der Mutter
      return { pos: end.sub(V(-0.0474, 0, 0).applyQuaternion(q)).setY(0), yaw };
    };
    if (this.compact) {
      const c = V(-0.058, 0, 0.05);
      const rx = 0.058, rz = 0.118;
      const tv = tee(c, rx, rz, 82);
      return {
        bracket: V(0.0, 0.082, SET_WALL_Z + 0.007),
        tvalve: tv.pos, tvYaw: tv.yaw,
        hose: [V(0.001, 0.042, -0.012), V(0.002, r, 0.035), arc(c, rx, rz, 22), arc(c, rx, rz, 42), arc(c, rx, rz, 60), arc(c, rx, rz, 73, 0.014)],
        flex: {
          a: { pos: V(0.012, nut, 0.3), dir: n(1, 0, -0.12) },
          b: { pos: V(0.022, nut, 0.205), dir: n(1, 0, 0.5) },
          wp: [V(0.062, f, 0.292), V(0.088, f, 0.258), V(0.08, f, 0.225)],
        },
        dir: V(-0.12, 0.44, 0.89),
      };
    }
    const c = V(-0.075, 0, 0.05);
    const rx = 0.105, rz = 0.105;
    const tv = tee(c, rx, rz, 80);
    return {
      bracket: V(0.03, 0.085, SET_WALL_Z + 0.007),
      tvalve: tv.pos, tvYaw: tv.yaw,
      hose: [V(0.031, 0.045, -0.012), V(0.033, r, 0.035), arc(c, rx, rz, 15), arc(c, rx, rz, 35), arc(c, rx, rz, 55), arc(c, rx, rz, 70, 0.013)],
      flex: {
        a: { pos: V(0.068, nut, 0.232), dir: n(1, 0, -0.1) },
        b: { pos: V(0.078, nut, 0.112), dir: n(1, 0, 0.4) },
        wp: [V(0.128, f, 0.222), V(0.153, f, 0.176), V(0.138, f, 0.132)],
      },
      dir: V(-0.17, 0.3, 0.94),
    };
  }

  _setLayout(e, sel) {
    const C = this._setConfig();
    const q = (yaw) => new THREE.Quaternion().setFromAxisAngle(Y, yaw);
    const brPos = C.bracket.clone();
    // Explosionsansicht: Handbidet hebt sich ganz aus der Aufnahme (nach oben und nach vorn)
    const hbPos = this.pts.seat.clone().add(brPos).add(V(0, 0.1 * e, 0.045 * e));
    const hose = C.hose.map((v) => v.clone());
    hose[0].add(V(0, 0.07 * e, 0.035 * e));
    hose[1].add(V(0, 0.02 * e, 0.015 * e));
    let tvPos = C.tvalve.clone();
    let tvYaw = C.tvYaw;
    // Auswahl: das gewählte Teil bewegt sich verständlich (Handbidet hebt sich aus der Halterung,
    // für die Halterung weiter; das T-Ventil dreht die Seite mit dem Logo zur Kamera)
    if (sel === 'handbidet') { hbPos.add(V(0, 0.03, 0.035)); hose[0].add(V(0, 0.015, 0.02)); }
    if (sel === 'bracket') { hbPos.add(V(-0.03, 0.09, 0.06)); hose[0].add(V(-0.03, 0.05, 0.04)); }
    if (sel === 'tvalve') { tvPos = tvPos.add(V(0, 0.012, 0.018)); tvYaw += 0.75; }   // Logokappe zur Kamera
    // Explosionsansicht: Anschlussschlauch steht über dem oberen Abgang des T-Ventils und führt in einem
    // ruhigen S nach oben – dorthin, wo der bestehende Anschluss (z. B. Spülkasten) liegt
    const top = tvPos.clone().add(V(0, 0.064, 0));
    const up = {
      a: { pos: top.clone().add(V(0, 0.03, 0)), dir: V(0, 1, 0) },
      b: { pos: top.clone().add(V(0.04, 0.2, 0.01)), dir: V(0, -1, 0) },
      wp: [top.clone().add(V(0.003, 0.095, 0.003)), top.clone().add(V(0.02, 0.116, 0.006)), top.clone().add(V(0.037, 0.137, 0.009))],
    };
    return {
      bracket: { pos: brPos, quat: q(0) },
      handbidet: { pos: hbPos, quat: q(0) },
      tvalve: { pos: tvPos, quat: q(tvYaw) },
      waypoints: hose,
      flex: e > 0 ? this._lerpFlex(C.flex, up, e) : this._lerpFlex(C.flex, C.flex, 0),
      reveal: 1,
    };
  }

  // Ausdehnung der starren Teile im eigenen Koordinatensystem (einmalig, nach dem ersten Aufbau)
  _boxes() {
    if (this._localBoxes) return this._localBoxes;
    this.scene.updateMatrixWorld(true);
    const out = {};
    for (const id of ['handbidet', 'bracket', 'tvalve']) {
      const o = this.objects[id];
      const inv = new THREE.Matrix4().copy(o.matrixWorld).invert();
      const b = new THREE.Box3();
      o.traverse((m) => {
        if (!m.isMesh || m === this.water.group || m.layers.mask !== 1) return;   // nur Bauteile (Layer 0)
        if (m.parent === this.nutA || m.parent === this.nutB || m.parent?.parent === this.nutA || m.parent?.parent === this.nutB) return;
        if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
        b.union(m.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld)));
      });
      out[id] = b;
    }
    this._localBoxes = out;
    return out;
  }

  // Punkte, die ein Bauteil in einer Anordnung L einnimmt (Ecken bzw. Schlauchverlauf)
  _layoutPoints(L, ids = SET_PARTS) {
    const boxes = this._boxes();
    const pts = [];
    const corners = (box, pos, quat) => {
      for (let i = 0; i < 8; i++) {
        pts.push(V(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).applyQuaternion(quat).add(pos));
      }
    };
    for (const id of ids) {
      if (L[id] && boxes[id]) corners(boxes[id], L[id].pos, L[id].quat);
    }
    const pad = (p, r) => { pts.push(p.clone().add(V(0, r, 0)), p.clone().add(V(0, -r, 0)), p.clone().add(V(r, 0, 0)), p.clone().add(V(-r, 0, 0)), p.clone().add(V(0, 0, r)), p.clone().add(V(0, 0, -r))); };
    if (ids.includes('hose')) {
      const hb = L.handbidet;
      pad(V(this.pts.port.x, -0.02, 0).applyQuaternion(hb.quat).add(hb.pos), 0.012);
      L.waypoints.forEach((p) => pad(p, 0.008));
      pad(V(-0.047, 0.036, 0).applyQuaternion(L.tvalve.quat).add(L.tvalve.pos), 0.012);
    }
    if (ids.includes('flexhose')) {
      [L.flex.a.pos, L.flex.b.pos].forEach((p) => pad(p, 0.012));
      L.flex.wp.forEach((p) => pad(p, 0.006));
    }
    return pts;
  }

  // Kamera so ausrichten, dass alle Punkte den Anteil fill des freien Bereichs füllen und mittig liegen
  _fitView(points, dir, fill = 0.88) {
    const f = dir.clone().normalize();
    const xa = new THREE.Vector3().crossVectors(Y, f).normalize();
    const ya = new THREE.Vector3().crossVectors(f, xa);
    const w = this._frameWidth();
    const h = Math.max(1, this.canvas.clientHeight);
    const i = this.insets;
    const effH = Math.max(80, h - i.top - i.bottom) / h;
    const effW = Math.max(80, w - i.left - i.right) / w;
    const T = Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2);
    const ty = T * effH * fill;
    const tx = T * this.camera.aspect * effW * fill;
    const c = new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
    let d = 0.3;
    for (let k = 0; k < 6; k++) {
      d = 0;
      for (const p of points) {
        const rel = p.clone().sub(c);
        const zr = rel.dot(f);
        d = Math.max(d, zr + Math.abs(rel.dot(xa)) / tx, zr + Math.abs(rel.dot(ya)) / ty);
      }
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of points) {
        const rel = p.clone().sub(c);
        const z = d - rel.dot(f);
        const sx = rel.dot(xa) / z;
        const sy = rel.dot(ya) / z;
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      c.addScaledVector(xa, ((x0 + x1) / 2) * d).addScaledVector(ya, ((y0 + y1) / 2) * d);
    }
    return { target: c, dir: f, distance: d };
  }

  _setPreset(name) {
    const e = name === 'setExploded' ? 1 : 0;
    const L = this._setLayout(e, null);
    const C = this._setConfig();
    const v = this._fitView(this._layoutPoints(L), C.dir, this.compact ? 0.9 : 0.9);
    return { name, ...v };
  }

  _applyLayout(L) {
    for (const id of ['handbidet', 'bracket', 'tvalve']) {
      this.objects[id].position.copy(L[id].pos);
      this.objects[id].quaternion.copy(L[id].quat);
    }
    const e = L.exploded || 0;
    this.nutA.position.copy(this.nutAHome).add(V(0, -0.035 * e, 0));
    this.nutB.position.copy(this.nutBHome).add(V(-0.035 * e, 0, 0));
    this.scene.updateMatrixWorld(true);
    this._buildHose(L.waypoints);
    this.hose.setReveal(L.reveal);
    this._buildFlex(L.flex);
    this._updateGuides(e);
    this._layoutVersion = (this._layoutVersion || 0) + 1;
    this.shadowDirty = true;
    this.dirty = true;
  }

  _updateGuides(e) {
    if (!this.guides) return;
    const hb = this.objects.handbidet;
    const tv = this.objects.tvalve;
    const pairs = [
      [hb.localToWorld(this.pts.port.clone()), this.nutA.localToWorld(V(0, 0, 0))],
      [tv.localToWorld(this.pts.tvBranch.clone()), this.nutB.localToWorld(V(0, 0, 0))],
      [hb.localToWorld(V(this.pts.port.x, 0.014, 0)), this.objects.bracket.localToWorld(this.pts.seat.clone().add(V(this.pts.port.x, 0.014, 0)))],
      [tv.localToWorld(V(0, 0.064, 0)), this.nutC.position.clone()],
    ];
    pairs.forEach(([a, b], i) => {
      const g = this.guides[i];
      g.geometry.setFromPoints([a, b]);
      g.computeLineDistances();
      g.material.opacity = Math.max(0, (e - 0.35) / 0.65) * 0.9;
      g.visible = g.material.opacity > 0.01 && a.distanceTo(b) > 0.006;
    });
  }

  _buildHose(waypoints) {
    const a0 = this.nutA.localToWorld(this.pts.hoseStart.clone());
    const aDir = Y.clone().applyQuaternion(this.nutA.getWorldQuaternion(new THREE.Quaternion()));
    const b0 = this.nutB.localToWorld(this.pts.hoseStart.clone());
    const bDir = Y.clone().applyQuaternion(this.nutB.getWorldQuaternion(new THREE.Quaternion()));
    const pts = [a0, a0.clone().addScaledVector(aDir, 0.018), ...waypoints, b0.clone().addScaledVector(bDir, 0.018), b0];
    this.hose.build(pts);
    this._hoseMid = this.hose.curve.getPointAt(0.45);
  }

  // t: gemeinsamer Fortschritt oder je Teil (Funktion id → Fortschritt; „nuts“ = Muttern und Führungslinien)
  _lerpLayout(A, B, t) {
    const k = typeof t === 'function' ? t : () => t;
    const L = {};
    for (const id of ['handbidet', 'bracket', 'tvalve']) {
      L[id] = { pos: A[id].pos.clone().lerp(B[id].pos, k(id)), quat: A[id].quat.clone().slerp(B[id].quat, k(id)) };
    }
    L.waypoints = A.waypoints.map((p, i) => p.clone().lerp(B.waypoints[i], k('hose')));
    L.reveal = A.reveal + (B.reveal - A.reveal) * k('hose');
    L.exploded = A.exploded + (B.exploded - A.exploded) * k('nuts');
    L.flex = this._lerpFlex(A.flex, B.flex, k('flexhose'));
    return L;
  }

  // order: Startversatz je Teil (Anteil der Dauer); jedes Teil bewegt sich ruhig an und aus (ohne Überschwingen)
  _transitionLayout(target, duration = 1.1, order = null) {
    const from = this._layoutState;
    this.tweens.cancel(this._layoutTween);
    const span = order ? 1 - Math.max(...Object.values(order)) : 1;
    const part = order ? (t) => (id) => easeInOut(THREE.MathUtils.clamp((t - (order[id] || 0)) / span, 0, 1)) : null;
    this._layoutTween = this.tweens.add({
      duration: this.reduced ? 0 : duration,
      ease: order ? (t) => t : easeInOut,
      update: (t) => {
        const L = this._lerpLayout(from, target, part ? part(t) : t);
        this._applyLayout(L);
        this._layoutState = L;
      },
      complete: () => {
        this._layoutState = target;
        this._applyLayout(target);
        this._updateFlows();
      },
    });
  }

  /* --------------------------------------------------------------- Deckkraft */
  _setOpacity(c, v) {
    c.opacity = v;
    const fading = v < 0.999;
    for (const m of c.materials) {
      const wasT = m.transparent;
      m.opacity = (m.userData.baseOpacity ?? 1) * v;
      m.transparent = fading || m.userData.baseTransparent;
      m.depthWrite = m.userData.decal ? false : (v > 0.5 ? m.userData.baseDepthWrite !== false : false);
      if (wasT !== m.transparent) m.needsUpdate = true;
    }
    for (const r of c.roots) r.visible = v > 0.01;
  }

  _applyOpacities(targets, instant = false) {
    const from = {};
    for (const id of Object.keys(targets)) {
      if (!this.comps[id]) throw stageError('setup', `Unbekanntes Bauteil in der Darstellung: ${id}`);
      from[id] = this.comps[id].opacity;
    }
    const mute = this._muteTargets();
    const muteFrom = Object.fromEntries(SET_PARTS.map((id) => [id, this.comps[id].mute ? this.comps[id].mute.value : 0]));
    this.tweens.cancel(this._opacityTween);
    this.tweens.cancel(this._holderTween);
    this._opacityTween = this.tweens.add({
      duration: instant || this.reduced ? 0 : 0.6,
      ease: easeOut,
      update: (t) => {
        for (const [id, v] of Object.entries(targets)) this._setOpacity(this.comps[id], from[id] + (v - from[id]) * t);
        for (const id of SET_PARTS) {
          if (this.comps[id].mute) this.comps[id].mute.value = muteFrom[id] + (mute[id] - muteFrom[id]) * t;
        }
        this.shadowDirty = true;
        this.dirty = true;
      },
    });
  }

  // Setansicht mit Auswahl: übrige Teile treten zurück (bleiben als räumliche Orientierung sichtbar)
  // Anschluss: nicht hervorgehobene Set-Teile bleiben deckend und treten über den Tonwert zurück
  _muteTargets() {
    const t = {};
    const hl = (id) => !this.highlight || this.highlight.includes(id) || (id === 'flexhose' && this.highlight.includes('consumer'));
    for (const id of SET_PARTS) {
      if (this.view === 'set') t[id] = this.selected && this.selected !== id ? MUTE : 0;
      else if (this.view === 'connect') t[id] = hl(id) ? 0 : MUTE_CONNECT;
      else t[id] = 0;
    }
    return t;
  }

  _opacityTargets() {
    const ghosts = ['wall', 'wcBody', 'wcValve', 'wcRigid', 'basinBody', 'basinValve', 'basinLine', 'basinBefore', 'basinWarm', 'basinDrain'];
    const parts = ['handbidet', 'bracket', 'tvalve', 'hose', 'flexhose'];
    const t = { handbidet: 1, bracket: 0, tvalve: 0, hose: 0, flexhose: 0, backdrop: 0 };
    ghosts.forEach((g) => { t[g] = 0; });
    if (this.view === 'set') {
      // alle Teile deckend; die Auswahl wirkt über _muteTargets, nicht über Transparenz
      for (const id of parts) t[id] = 1;
      t.backdrop = 1;
    } else if (this.view === 'connect') {
      const before = this.compare === 'before';
      const wc = this.scenario === 'wc';
      // Rollen je Badsituation: Eckventil mit T-Ventil, bestehender Zulauf, Umgebung
      const roles = wc
        ? { angle: ['wcValve'], consumer: before ? ['wcRigid'] : [], context: ['wcBody'] }
        : { angle: ['basinValve'], consumer: [before ? 'basinBefore' : 'basinLine'], context: ['basinBody', 'basinWarm', 'basinDrain', 'wcBody', 'wcValve', 'wcRigid'] };
      const hl = (id) => !this.highlight || this.highlight.includes(id);
      t.wall = 1;
      for (const id of ['handbidet', 'bracket', 'tvalve', 'hose']) t[id] = before ? 0 : 1;
      // Anschlussschlauch nur am WC (Waschtisch: Einsatz zu prüfen) und nur im Zustand „nachher“
      t.flexhose = !wc || before ? 0 : 1;
      roles.angle.forEach((g) => { t[g] = hl('angle') ? 1 : DIM; });
      roles.consumer.forEach((g) => { t[g] = hl('consumer') ? 1 : DIM; });
      roles.context.forEach((g) => { t[g] = 1; });   // deckend, tritt über die ruhige Keramik zurück
    }
    return t;
  }

  /* ----------------------------------------------------------------- Kamera */
  _fitDistance(radius) {
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    // nur der freie Bereich zwischen den Bedienelementen zählt
    const w = this._frameWidth();
    const h = Math.max(1, this.canvas.clientHeight);
    const i = this.insets;
    const effH = Math.max(80, h - i.top - i.bottom) / h;
    const effW = Math.max(80, w - i.left - i.right) / w;
    const tv = Math.tan(vFov / 2);
    const v = 2 * Math.atan(tv * effH);
    const hz = 2 * Math.atan(tv * this.camera.aspect * effW);
    return (radius * 1.08) / Math.sin(Math.min(v, hz) / 2);
  }

  _preset(name) {
    const hbPos = this._layout('discover', 0).handbidet.pos;
    const hb = (v) => v.clone().add(hbPos);
    const presets = {
      discover: { target: hb(V(0.0, 0.088, 0)), dir: V(-0.57, 0.16, 0.82), radius: 0.098 },
      nozzle: { target: hb(this.pts.nozzle.clone().add(V(0.004, 0, 0))), dir: V(-0.86, 0.14, 0.5), radius: 0.027 },
      grip: { target: hb(V(0.004, 0.078, 0)), dir: V(0.32, 0.1, 0.94), radius: 0.05 },
      port: { target: hb(this.pts.port.clone().add(V(0, 0.01, 0))), dir: V(-0.5, -0.32, 0.8), radius: 0.024 },
      ...this._connectPresets(),
    };
    presets.overview = presets.connect; // Schritt „Überblick“ der Anschlussansicht
    if (name === 'set' || name === 'setExploded') return this._setPreset(name);
    const p = presets[name] || presets.discover;
    return { name, target: p.target, dir: p.dir.clone().normalize(), distance: this._fitDistance(p.radius) };
  }

  // Kamerapunkte der Anschlussansicht, abgeleitet aus der gewählten Badsituation
  _connectPresets() {
    const sc = SCENARIOS[this.scenario];
    const yaw = new THREE.Quaternion().setFromAxisAngle(Y, sc.teeYaw);
    const inlet = this._teeInlet(sc);
    const tv = (v) => v.clone().applyQuaternion(yaw).add(inlet);
    const side = V(1, 0, 0).applyQuaternion(yaw).x > 0 ? 1 : -1;   // Seite des Ventilkörpers
    const cp = sc.consumerPoints || [inlet.clone().add(V(0, 0.064, 0)), sc.cisternInlet.clone()];
    const cMid = cp[0].clone().lerp(cp[cp.length - 1], 0.5);
    const hoseBox = new THREE.Box3().setFromPoints([...sc.hose, tv(V(-0.03, 0.036, 0)), sc.bracket.clone().add(V(0, 0.01, 0.02))]);
    const hoseS = hoseBox.getBoundingSphere(new THREE.Sphere());
    return {
      connect: sc.overview,
      angle: this.scenario === 'wc'
        ? { target: sc.angleValve.clone().add(V(0, 0.014, 0.008)), dir: V(0.3 * side, 0.2, 0.93), radius: 0.06 }
        : { target: V(-0.9, 0.6, 0.02), dir: V(0.1, 0.25, 1), radius: 0.17 },   // Kalt, Warm und Abfluss zusammen
      tvalve: { target: tv(V(0, 0.034, 0)), dir: V(0.32 * side, 0.16, 0.94), radius: 0.058 },
      consumer: { target: cMid, dir: this.scenario === 'wc' ? V(-0.6, 0.12, 0.8) : V(0.3 * side, 0.05, 0.95), radius: Math.max(0.09, cp[0].distanceTo(cp[cp.length - 1]) * 0.75) },
      lever: { target: tv(V(0.024, 0.05, 0)), dir: V(0.55 * side, 0.42, 0.72), radius: 0.042 },
      hose: { target: hoseS.center, dir: V(0.05, 0.22, 1), radius: hoseS.radius * 1.05 },
      holder: { target: sc.bracket.clone().add(V(-0.004, 0.09, 0.02)), dir: V(0.25, 0.08, 1), radius: 0.12 },
      swap: this.scenario === 'wc'
        ? { target: sc.angleValve.clone().lerp(sc.cisternInlet, 0.5).add(V(0, 0.01, 0.01)), dir: V(-0.6, 0.12, 0.8), radius: 0.15 }
        : { target: sc.angleValve.clone().lerp(sc.beforePoints[sc.beforePoints.length - 1], 0.5), dir: V(-0.25, 0.1, 1), radius: 0.12 },
    };
  }

  // Bauteilauswahl: Kamera nach der Ziel-Anordnung (nicht nach dem Zwischenstand einer laufenden
  // Bewegung). Das Teil füllt gut die Hälfte des freien Bereichs, die übrigen bleiben als Umgebung sichtbar.
  _componentPreset(id) {
    const L = this._setLayout(this.exploded, id);
    const k = this.compact;
    const views = {
      handbidet: { dir: V(-0.34, 0.16, 0.93), fill: 0.62 },
      bracket: { dir: V(0.62, 0.22, 0.75), fill: 0.56 },
      tvalve: { dir: V(-0.42, 0.3, 0.86), fill: k ? 0.66 : 0.62 },
      hose: { dir: V(0.06, 0.66, 0.75), fill: 0.64 },
      flexhose: { dir: V(0.22, 0.6, 0.77), fill: k ? 0.5 : 0.42 },
    };
    const v = views[id];
    return { name: id, ...this._fitView(this._layoutPoints(L, [id]), v.dir, v.fill) };
  }

  _setCamera(p) {
    this.controls.target.copy(p.target);
    this.camera.position.copy(p.target).addScaledVector(p.dir, p.distance);
    this.camera.lookAt(p.target);
    this.controls.update();
    this.dirty = true;
  }

  _flyTo(p, duration = 1.1, hold = 0) {
    this.currentPreset = p;
    this.userMovedCamera = false;
    const fromTarget = this.controls.target.clone();
    const fromOffset = this.camera.position.clone().sub(fromTarget);
    const lensFrom = this._lensMix;
    const s0 = new THREE.Spherical().setFromVector3(fromOffset);
    const s1 = new THREE.Spherical();
    let dTheta = 0;
    // Weiter Weg zwischen zwei Zielen (z. B. vom T-Ventil zum Handbidet): Kamera tritt in der Mitte zurück,
    // statt dicht durch die Anordnung zu fahren; Übergabe aus dem Film (hold) bleibt eine reine Fahrt
    const travel = fromTarget.distanceTo(p.target);
    const arc = hold > 0 ? 0 : THREE.MathUtils.clamp((travel / Math.max(s0.radius, p.distance)) * 0.9 - 0.05, 0, 0.75);
    duration *= 1 + arc * 0.35;
    // Läuft schon eine Fahrt, setzt die neue aus der aktuellen Bewegung fort (weich auslaufend statt
    // aus dem Stand); Ziehen bricht jede Fahrt sofort ab (Listener „start“)
    const moving = !!(this._camTween && this.tweens.list.has(this._camTween));
    this.tweens.cancel(this._camTween);
    this.controls.enabled = !this.waterActive;
    this.controls.enableDamping = false;   // keine Restträgheit eines vorigen Ziehens während der Fahrt
    // Begrenzungen während des Flugs lösen
    Object.assign(this.controls, { minDistance: 0.01, maxDistance: 10, minPolarAngle: 0, maxPolarAngle: Math.PI, minAzimuthAngle: -Infinity, maxAzimuthAngle: Infinity });
    this._camTween = this.tweens.add({
      duration: this.reduced ? 0 : duration,
      // hold: Anteil am Anfang, in dem die Kamera noch steht (Übergabe: Video blendet erst aus)
      ease: hold > 0 ? (t) => (t <= hold ? 0 : easeInOut((t - hold) / (1 - hold))) : (moving ? easeOut : easeCam),
      update: (t) => {
        // Ziel je Bild neu: eine Größenänderung während der Fahrt passt p an, ohne neu anzusetzen
        s1.setFromVector3(p.dir.clone().multiplyScalar(p.distance));
        dTheta = s1.theta - s0.theta;
        if (dTheta > Math.PI) dTheta -= Math.PI * 2;
        if (dTheta < -Math.PI) dTheta += Math.PI * 2;
        const tgt = fromTarget.clone().lerp(p.target, t);
        // Abstand logarithmisch: gleichmäßig wirkender Zoom statt Beschleunigung kurz vor dem Ziel
        const s = new THREE.Spherical(
          Math.exp(Math.log(s0.radius) + (Math.log(s1.radius) - Math.log(s0.radius)) * t) * (1 + arc * Math.sin(Math.PI * t)),
          s0.phi + (s1.phi - s0.phi) * t,
          s0.theta + dTheta * t
        );
        this.controls.target.copy(tgt);
        this.camera.position.copy(tgt).add(new THREE.Vector3().setFromSpherical(s));
        this.camera.lookAt(tgt);
        if (lensFrom < 1) {
          this._lensMix = lensFrom + (1 - lensFrom) * t;
          this._applyLens();
        }
        this.dirty = true;
      },
      complete: () => this._endFlight(p),
    });
  }

  // Fahrt beendet oder durch Ziehen abgebrochen: Steuerung mit den Grenzen der Zielansicht übergeben.
  // Beim Abbruch liegen die Grenzen so, dass die aktuelle Lage erlaubt ist (kein Springen).
  _endFlight(p, interrupted = false) {
    this._rotGoal = null;
    this.tweens.cancel(this._camTween);
    this._camTween = null;
    if (this._lensMix !== 1) {
      if (interrupted && !this.reduced) {
        const from = this._lensMix;
        this.tweens.add({ duration: 0.35, ease: easeOut, update: (t) => { this._lensMix = from + (1 - from) * t; this._applyLens(); }, complete: () => { this._lensMix = 1; this._lensVideo = null; this._applyLens(); } });
      } else { this._lensMix = 1; this._lensVideo = null; this._applyLens(); }
    }
    this.controls.enabled = !this.waterActive;
    this.controls.enableDamping = !this.reduced;
    this._applyControlLimits(this.view, p);
    if (interrupted) {
      const c = this.controls;
      const s = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(c.target));
      c.minDistance = Math.min(c.minDistance, s.radius);
      c.maxDistance = Math.max(c.maxDistance, s.radius);
      c.minPolarAngle = Math.min(c.minPolarAngle, s.phi);
      c.maxPolarAngle = Math.max(c.maxPolarAngle, s.phi);
      if (Number.isFinite(c.minAzimuthAngle)) {
        c.minAzimuthAngle = Math.min(c.minAzimuthAngle, s.theta);
        c.maxAzimuthAngle = Math.max(c.maxAzimuthAngle, s.theta);
      }
    }
    this.controls.update();
  }

  // Dreh- und Neigungsgrenzen der aktuellen Ansicht, unabhängig vom Zustand der Steuerung
  _viewLimits() {
    const lim = {};
    const ref = this.view === 'set' ? (this.selected ? this._componentPreset(this.selected) : this._preset(this.exploded ? 'setExploded' : 'set'))
      : this.view === 'connect' ? this._preset(this.step ? this.step.focus : 'overview') : this._preset('discover');
    this._applyControlLimits(this.view, ref, lim);
    return lim;
  }

  _applyControlLimits(view, p, c = this.controls) {
    c.minDistance = p.distance * 0.5;
    c.maxDistance = p.distance * 1.5;
    c.minAzimuthAngle = -Infinity;
    c.maxAzimuthAngle = Infinity;
    if (view === 'discover') {
      c.minPolarAngle = THREE.MathUtils.degToRad(18);
      c.maxPolarAngle = THREE.MathUtils.degToRad(122);
    } else if (view === 'set') {
      // Wand hinter dem Set: nur von vorn betrachten. Bezug ist die Setansicht selbst, nicht eine per Knopf
      // oder Pfeiltaste erreichte Zwischenlage (sonst ließe sich die Grenze schrittweise verschieben)
      const ref = p.name === 'custom' ? (this.selected ? this._componentPreset(this.selected) : this._preset(this.exploded ? 'setExploded' : 'set')) : p;
      const th = new THREE.Spherical().setFromVector3(ref.dir).theta;
      c.minPolarAngle = THREE.MathUtils.degToRad(24);
      c.maxPolarAngle = THREE.MathUtils.degToRad(84);
      c.minAzimuthAngle = th - 0.85;
      c.maxAzimuthAngle = th + 0.85;
    } else {
      c.minPolarAngle = THREE.MathUtils.degToRad(35);
      c.maxPolarAngle = THREE.MathUtils.degToRad(100);
      c.minAzimuthAngle = THREE.MathUtils.degToRad(-60);
      c.maxAzimuthAngle = THREE.MathUtils.degToRad(60);
    }
  }

  /* ------------------------------------------------------------ Öffentlich */
  setReducedMotion(on) {
    this.reduced = on;
    this.controls.enableDamping = !on;
    if (this.water) this.water.setReducedMotion(on);
  }

  _placeShadow() {
    if (this.view === 'connect') this.shadow.group.position.copy(SCENARIOS[this.scenario].shadowCenter);
    else if (this.view === 'set') this.shadow.group.position.set(0.02, 0, 0.1);
    else this.shadow.group.position.set(-0.08, 0, 0.05);
    if (this.wallShadow) this.wallShadow.group.position.x = this._setConfig().bracket.x;
    this.shadowDirty = true;
  }

  // Badsituation der Anschlussansicht wechseln (WC oder Waschtisch)
  setScenario(id) {
    if (!SCENARIOS[id] || id === this.scenario) return;
    this.scenario = id;
    for (const l of this.labels) {
      if (typeof l.text === 'function') l.el.lastChild.textContent = l.text();
    }
    if (!this.objects || this.view !== 'connect') return;
    this._placeShadow();
    Object.values(this.flows).forEach((f) => { f.target = 0; });  // Wasserwege erst nach dem Umbau
    this._transitionLayout(this._layout('connect', 0), 1.3);
    this._applyOpacities(this._opacityTargets());
    this._flyTo(this._preset(this.step ? this.step.focus : 'overview'), 1.3);
  }

  setView(view) {
    if (!this.objects) return;
    this.stopWater();
    this.view = view;
    this._placeShadow();
    this.selected = null;
    this.highlight = view === 'connect' ? this.highlight : null;
    if (view !== 'set') this.exploded = 0;
    this._transitionLayout(this._layout(view, this.exploded), 1.1);
    this._applyOpacities(this._opacityTargets());
    if (view !== 'connect') this.setLever(true, true);
    this._flyTo(this._preset(view === 'set' && this.exploded ? 'setExploded' : view), 1.1);
    this._updateFlows();
    this._updateLabels(true);
  }

  setDetail(id) {
    if (this.view !== 'discover') return;
    this._flyTo(this._preset(id === 'overview' ? 'discover' : id), 1.0);
  }

  /* Auswahl und Rückkehr: Beschriftung blendet aus, die übrigen Teile treten zurück, das gewählte
   * Teil bewegt sich (Anordnung mit Auswahl) und die Kamera fährt gleichzeitig auf das Ziel der
   * Bewegung; die Beschriftung erscheint erst, wenn Kamera und Teil ruhen. Die Rückkehr verwendet
   * dieselbe Anordnung und denselben Bildausschnitt wie die Gesamtansicht. */
  selectComponent(id) {
    if (this.view !== 'set') return;
    this.selected = id || null;
    this._applyOpacities(this._opacityTargets());
    this._transitionLayout(this._layout('set', this.exploded), 0.85);
    this._flyTo(id ? this._componentPreset(id) : this._preset(this.exploded ? 'setExploded' : 'set'), 1.1);
    this._updateLabels(true);
  }

  setExploded(on) {
    if (this.view !== 'set') return;
    this.exploded = on ? 1 : 0;
    // Reihenfolge entlang des Wasserwegs (Anteil der Gesamtdauer, ab dem sich ein Teil bewegt): Beim Lösen hebt
    // sich zuerst das Handbidet aus der Halterung, dann trennen sich Muttern und Schlauch, zuletzt T-Ventil und
    // Anschlussschlauch; beim Zusammensetzen umgekehrt, das Handbidet setzt als Letztes in die Halterung ein
    const order = on
      ? { handbidet: 0, bracket: 0.04, nuts: 0.1, hose: 0.16, tvalve: 0.24, flexhose: 0.3 }
      : { flexhose: 0, tvalve: 0.06, hose: 0.12, nuts: 0.18, bracket: 0.24, handbidet: 0.28 };
    this._transitionLayout(this._layout('set', this.exploded), 1.15, order);
    this._flyTo(this.selected ? this._componentPreset(this.selected) : this._preset(on ? 'setExploded' : 'set'), 1.05);
  }

  setStep(step) {
    if (this.view !== 'connect') return;
    this.step = step;
    this.highlight = step.highlight;
    if (!step.compare) this.compare = 'after';
    this._applyOpacities(this._opacityTargets());
    this._flyTo(this._preset(step.focus), 1.0);
    this._updateFlows();
    this._updateLabels(true);
  }

  // Vorher (bestehende Installation) / Nachher (mit Set) im Vergleichsschritt
  setCompare(mode) {
    this.compare = mode === 'before' ? 'before' : 'after';
    if (this.view !== 'connect') return;
    this._applyOpacities(this._opacityTargets());
    this._updateFlows();
    this.dirty = true;
  }

  setLever(open, instant = false) {
    if (!this.lever) return;
    this.leverOpen = open;
    const from = this.lever.rotation.x;
    const to = open ? 0 : Math.PI / 2;
    this.tweens.cancel(this._leverTween);
    // Der dargestellte Zweig folgt dem Hebel: Er wechselt erst, wenn der Hebel gut die Hälfte gedreht hat
    let switched = false;
    this._leverTween = this.tweens.add({
      duration: instant || this.reduced ? 0 : 0.5,
      update: (t) => {
        this.lever.rotation.x = from + (to - from) * t;
        if (!switched && t >= 0.55) { switched = true; this._flowLeverOpen = open; this._updateFlows(); }
        this.dirty = true;
        this.shadowDirty = true;
      },
    });
    this._updateFlows();
  }

  resetView() {
    if (!this.objects) return;
    let p;
    if (this.view === 'set' && this.selected) p = this._componentPreset(this.selected);
    else if (this.view === 'connect' && this.step) p = this._preset(this.step.focus);
    else if (this.view === 'set') p = this._preset(this.exploded ? 'setExploded' : 'set');
    else p = this._preset(this.view);
    this._flyTo(p, 0.8);
  }

  rotateBy(deg) {
    if (!this.objects || this.waterActive) return;
    const tgt = this.controls.target.clone();
    const off = this.camera.position.clone().sub(tgt);
    const s = new THREE.Spherical().setFromVector3(off);
    // Schnell wiederholte Tasten/Knöpfe addieren sich zum Ziel der laufenden Drehung, nicht zur Zwischenlage
    const flying = this._camTween && this.tweens.list.has(this._camTween);
    const base = flying && this._rotGoal != null ? this._rotGoal : s.theta;
    let theta = base + THREE.MathUtils.degToRad(deg);
    // Grenzen der Ansicht (nicht der laufenden Fahrt, während der sie gelöst sind)
    const lim = this._viewLimits();
    if (Number.isFinite(lim.minAzimuthAngle)) theta = THREE.MathUtils.clamp(theta, lim.minAzimuthAngle, lim.maxAzimuthAngle);
    const dir = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, s.phi, theta));
    this._flyTo({ name: 'custom', target: tgt, dir, distance: s.radius }, 0.55);
    this._rotGoal = theta;
    this.currentPreset = { ...this.currentPreset, distance: this.currentPreset?.distance ?? s.radius };
    this.userMovedCamera = true;
  }

  tiltBy(deg) {
    if (!this.objects || this.waterActive) return;
    const tgt = this.controls.target.clone();
    const s = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(tgt));
    const lim = this._viewLimits();
    const phi = THREE.MathUtils.clamp(s.phi - THREE.MathUtils.degToRad(deg), lim.minPolarAngle, lim.maxPolarAngle);
    const dir = new THREE.Vector3().setFromSpherical(new THREE.Spherical(1, phi, s.theta));
    const keep = this.currentPreset;
    this._flyTo({ name: 'custom', target: tgt, dir, distance: s.radius }, 0.4);
    this.currentPreset = keep;
  }

  zoomBy(factor) {
    if (!this.objects || this.waterActive) return;
    const tgt = this.controls.target.clone();
    const off = this.camera.position.clone().sub(tgt);
    const keep = this.currentPreset;
    const base = keep ? keep.distance : off.length();
    const d = THREE.MathUtils.clamp(off.length() * factor, base * 0.5, base * 1.5);
    this._flyTo({ name: 'custom', target: tgt, dir: off.normalize(), distance: d }, 0.35);
    this.currentPreset = keep;
  }

  /* ------------------------------------------------------------------ Wasser */
  startWater() {
    if (!this.objects || this.view !== 'discover' || this.dragging || this.waterActive) return false;
    this.waterActive = true;
    this.controls.enabled = false;
    this.water.start();
    this._pressButton(true);
    this.dispatchEvent(new CustomEvent('water', { detail: true }));
    return true;
  }

  stopWater() {
    if (!this.waterActive) return;
    this.waterActive = false;
    this.water.stop();
    this._pressButton(false);
    this.controls.enabled = true;
    this.dispatchEvent(new CustomEvent('water', { detail: false }));
  }

  _pressButton(down) {
    const from = this.button.position.clone();
    const to = this.buttonRest.clone().addScaledVector(this.buttonDir, down ? -0.0014 : 0);
    this.tweens.cancel(this._btnTween);
    this._btnTween = this.tweens.add({
      duration: this.reduced ? 0 : down ? 0.07 : 0.16,
      ease: easeOut,
      update: (t) => { this.button.position.lerpVectors(from, to, t); this.dirty = true; },
    });
  }

  /* -------------------------------------------------------------- Wasserwege */
  _updateFlows() {
    if (!this.flows) return;
    if (this._layoutTween && this.tweens.list.has(this._layoutTween)) {
      // während eines Umbaus keine Wasserwege an alten Positionen zeigen
      Object.values(this.flows).forEach((f) => { f.target = 0; });
      return;
    }
    const active = this.view === 'connect' && this.step ? this.step.flows : [];
    const tv = this.objects.tvalve;
    tv.updateMatrixWorld(true);
    const w = (v) => tv.localToWorld(v.clone());
    const sc = SCENARIOS[this.scenario];
    const a = sc.angleValve;
    const center = w(V(0, 0.036, 0));
    const before = this.compare === 'before';
    if (before) {
      // bestehende Installation ohne Set: Eckventil → starre Leitung bzw. Armaturzuleitung
      const top = V(a.x, a.y + 0.022, a.z);
      this.flows.supply.setPoints([V(a.x, a.y, WALL_Z + 0.004), V(a.x, a.y, a.z - 0.004), V(a.x, a.y + 0.004, a.z), top]);
      const curve = this.scenario === 'wc' ? this.schematic.curves.wcRigid : this.schematic.curves.basinBefore;
      this.flows.consumer.setPoints(curve.getSpacedPoints(48));
    } else {
      this.flows.supply.setPoints([V(a.x, a.y, WALL_Z + 0.004), V(a.x, a.y, a.z - 0.004), V(a.x, a.y + 0.004, a.z), w(V(0, 0.002, 0)), center]);
      const onward = this.scenario === 'wc' && this.flex.curve
        ? [...this.flex.curve.getPoints(24), sc.cisternInlet.clone().add(V(0, 0.012, 0))]
        : this.schematic.curves.basin.getPoints(16).slice(1);
      this.flows.consumer.setPoints([center, w(V(0, 0.064, 0)), ...onward]);
    }
    if (this.hose.curve) {
      const hosePts = this.hose.curve.getPoints(40);
      const nutEnd = this.nutB.localToWorld(V(0, 0, 0));
      this.flows.branch.setPoints([center, w(V(-0.02, 0.036, 0)), nutEnd, ...hosePts.reverse().slice(1), this.objects.handbidet.localToWorld(this.pts.port.clone().add(V(0, 0.03, 0)))]);
    }
    this.flows.supply.target = active.includes('supply') ? 1 : 0;
    this.flows.consumer.target = active.includes('consumer') ? 1 : 0;
    const leverOpen = this._flowLeverOpen ?? this.leverOpen;
    this.flows.branch.target = active.includes('branch') && leverOpen && this.compare !== 'before' ? 1 : 0;
    this.dirty = true;
  }

  /* ------------------------------------------------------------------ Labels */
  _buildLabels() {
    // Texte kommen aus den Produktdaten (Bauteilnamen bzw. CONNECTION.labels)
    const name = (id) => (this.content.components.find((c) => c.id === id) || {}).name;
    const num = (id) => (this.content.components.find((c) => c.id === id) || {}).number;
    const cl = this.content.connectLabels;
    const ctext = (id) => () => (typeof cl[id] === 'object' ? cl[id][this.scenario] : cl[id]);
    const set = (id, at) => ({ id, text: name(id), n: num(id), view: 'set', at });
    // align: Lage des Labels zum Ankerpunkt ('right' = rechts davon, 'left' = links davon, 'center')
    const con = (id, at, align = () => 'right') => ({ id, text: ctext(id), view: 'connect', at, align });
    const SC = () => SCENARIOS[this.scenario];
    const defs = [
      // Ankerpunkte auf der sichtbaren Oberfläche; die Beschriftung selbst liegt daneben im Freien
      set('handbidet', () => this.objects.handbidet.localToWorld(V(-0.012, 0.162, 0.012))),
      set('hose', () => (this.hose.curve ? this.hose.curve.getPointAt(0.62).add(V(0, 0.006, 0)) : V())),
      set('bracket', () => this.objects.bracket.localToWorld(V(0.0225, 0.042, 0.0345))),   // rechter Arm der Aufnahme
      set('tvalve', () => this.objects.tvalve.localToWorld(V(0, 0.046, 0.0105))),
      set('flexhose', () => (this.flex.curve ? this.flex.curve.getPointAt(0.5).add(V(0, 0.004, 0)) : V())),
      con('angle', () => (this.scenario === 'wc' ? SC().angleValve.clone().add(V(0.03, -0.02, 0.02)) : SC().angleValve.clone().add(V(0, -0.03, 0.02))),
        () => (this.scenario === 'wc' ? 'right' : 'left')),
      con('rigid', () => this.schematic.curves.wcRigid.getPointAt(0.55).add(V(0, 0.006, 0))),
      con('drain', () => V(-0.9, 0.668, 0.12), () => 'center'),   // am senkrechten Siphonrohr
      con('tvalve', () => this.objects.tvalve.localToWorld(V(0.03, 0.07, 0)), () => (this.scenario === 'wc' ? 'right' : 'left')),
      con('flexhose', () => (this._flexMid || V()).clone().add(V(0.012, 0, 0))),
      con('consumer', () => (this.scenario === 'wc' ? SCENARIOS.wc.cisternInlet.clone().add(V(0.035, -0.012, 0.02)) : SCENARIOS.basin.consumerPoints[2].clone().add(V(0.02, 0, 0.02)))),
      con('hose', () => this._hoseMid || V()),
      con('handbidet', () => this.objects.bracket.localToWorld(V(0.03, 0.17, 0))),
      con('warm', () => SCENARIOS.basin.warmValve.clone().add(V(0, 0.03, 0.02))),
    ];
    for (const d of defs) {
      if (!d.text || (typeof d.text === 'function' && !d.text())) throw new Error(`Beschriftung fehlt: ${d.view}/${d.id}`);
    }
    this.labels = defs.map((d) => {
      const el = document.createElement(d.view === 'set' ? 'button' : 'div');
      el.className = d.view === 'set' ? 'stage-label stage-label--set' : 'stage-label';
      let leader = null;
      if (d.view === 'set') {
        leader = document.createElement('div');
        leader.className = 'stage-leader';
        leader.setAttribute('aria-hidden', 'true');
        leader.hidden = true;
        this.overlay.appendChild(leader);
        el.type = 'button';
        el.tabIndex = -1; // Tastatur nutzt die gleichwertige Liste im Panel
        el.addEventListener('click', () => this.dispatchEvent(new CustomEvent('labelselect', { detail: d.id })));
      }
      if (d.n) {
        const n = document.createElement('span');
        n.className = 'stage-label__n';
        n.textContent = String(d.n);
        el.appendChild(n);
      }
      const t = document.createElement('span');
      t.textContent = typeof d.text === 'function' ? d.text() : d.text;
      el.appendChild(t);
      el.hidden = true;
      this.overlay.appendChild(el);
      return { ...d, el, leader };
    });
  }

  // Beschriftungen je Schritt (CONNECTION.steps[].labels), gefiltert nach Variante und Zustand
  _connectLabelVisible(id) {
    if (!this.step) return false;
    const before = this.step.compare && this.compare === 'before';
    const list = (before ? this.step.labelsBefore : this.step.labels) || [];
    if (!list.includes(id)) return false;
    const wc = this.scenario === 'wc';
    if ((id === 'flexhose' || id === 'rigid') && !wc) return false;
    if ((id === 'warm' || id === 'drain') && wc) return false;
    return true;
  }

  _updateLabels() {
    if (!this.labels.length) return;
    if (this.view === 'set') {
      for (const l of this.labels) if (l.view !== 'set') l.el.hidden = true;
      this._updateSetLabels();
      return;
    }
    for (const l of this.labels) if (l.leader) { l.leader.hidden = true; l.leader.classList.remove('is-shown'); l.el.classList.remove('is-shown'); }
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const busy = this._camTween && this.tweens.list.has(this._camTween);
    const ins = this.insets;
    const placed = [];   // bereits gesetzte Labels (Überlappungen vermeiden)
    let order = this.labels;
    if (this.view === 'connect' && this.step) {
      const before = this.step.compare && this.compare === 'before';
      const list = (before ? this.step.labelsBefore : this.step.labels) || [];
      const rank = (l) => (l.view === 'connect' && list.includes(l.id) ? list.indexOf(l.id) : 99);
      order = [...this.labels].sort((a, b) => rank(a) - rank(b));
    }
    for (const l of order) {
      let show = l.view === this.view && !busy;
      if (show && this.view === 'set') show = !this.selected || this.selected === l.id;
      if (show && this.view === 'connect') show = this._connectLabelVisible(l.id);
      if (!show) { l.el.hidden = true; continue; }
      const p = l.at().project(this.camera);
      const x = (p.x * 0.5 + 0.5) * w;
      const y = (-p.y * 0.5 + 0.5) * h;
      const inside = p.z < 1 && x > ins.left && x < w - ins.right && y > ins.top && y < h - ins.bottom;
      l.el.hidden = !inside;
      if (inside) {
        // im freien Bereich halten (Label beginnt 12 px links vom Ankerpunkt)
        const lw = l.el.offsetWidth || 120;
        const lh = l.el.offsetHeight || 30;
        // Passt das Schild nicht in die freie Bühnenbreite (sehr schmale Bühne), entfällt es statt überzustehen
        if (lw > w - ins.left - ins.right - 14) { l.el.hidden = true; continue; }
        const align = l.align ? l.align() : 'right';
        const ax = align === 'left' ? x - lw + 24 : align === 'center' ? x - lw / 2 + 12 : x;
        const cx = Math.min(Math.max(ax, ins.left + 20), w - ins.right - lw - 6 + 12);
        const cy = Math.min(Math.max(y, ins.top + 20), h - ins.bottom - 18);
        const box = { x0: cx - 12, y0: cy - 16, x1: cx - 12 + lw, y1: cy - 16 + lh };
        if (placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) {
          l.el.hidden = true;   // spätere (weniger wichtige) Labels weichen
          continue;
        }
        placed.push(box);
        l.el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
      }
      l.el.classList.toggle('is-selected', this.selected === l.id);
    }
  }

  /* Beschriftung der Setansicht: blendet während jeder Bewegung aus und wird erst platziert, wenn
   * Kamera und Teile ruhen. Platzierung über eine Belegungsmaske der Bauteile (Bühnenbild in
   * Viertelauflösung): Beschriftungen liegen im freien Raum und verdecken keine Teile; eine feine
   * Linie führt zum Ankerpunkt. */
  _updateSetLabels() {
    const list = this.labels.filter((l) => l.view === 'set');
    const tweening = (this._camTween && this.tweens.list.has(this._camTween)) || (this._layoutTween && this.tweens.list.has(this._layoutTween));
    const c = this.camera;
    const key = [...c.position.toArray(), ...c.quaternion.toArray(), c.projectionMatrix.elements[8], c.projectionMatrix.elements[9],
      this.canvas.clientWidth, this.canvas.clientHeight].map((v) => v.toFixed(5)).join() + `|${this.selected}|${this._layoutVersion}`;
    const now = performance.now();
    if (tweening || this.dragging || key !== this._labelKey) {
      if (key !== this._labelKey) { this._labelKey = key; this._labelStill = now; }
      if (tweening || this.dragging) this._labelStill = now;
      this._placedKey = null;
      for (const l of list) { l.el.classList.remove('is-shown'); l.leader.classList.remove('is-shown'); }
      return;
    }
    if (this._placedKey === key || now - this._labelStill < 120) return;
    this._placedKey = key;
    const shown = list.filter((l) => !this.selected || this.selected === l.id);
    for (const l of list) {
      const on = shown.includes(l);
      l.el.hidden = !on;
      l.leader.hidden = !on;
      l.el.classList.toggle('is-selected', this.selected === l.id);
    }
    this._placeSetLabels(shown);
  }

  _occupancy() {
    const w = Math.max(1, Math.ceil(this.canvas.clientWidth / 4));
    const h = Math.max(1, Math.ceil(this.canvas.clientHeight / 4));
    if (!this._maskRT) {
      this._maskRT = new THREE.WebGLRenderTarget(w, h);
      this._maskMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
    this._maskRT.setSize(w, h);
    const r = this.renderer;
    const prevMask = this.camera.layers.mask;
    const prevClear = r.getClearColor(new THREE.Color());
    const prevAlpha = r.getClearAlpha();
    this.camera.layers.set(0);
    this.scene.overrideMaterial = this._maskMat;
    r.setRenderTarget(this._maskRT);
    r.setClearColor(0x000000, 1);
    r.clear();
    r.render(this.scene, this.camera);
    const data = new Uint8Array(w * h * 4);
    r.readRenderTargetPixels(this._maskRT, 0, 0, w, h, data);
    r.setRenderTarget(null);
    r.setClearColor(prevClear, prevAlpha);
    this.scene.overrideMaterial = null;
    this.camera.layers.mask = prevMask;
    return { w, h, s: this.canvas.clientWidth / w, data };
  }

  _placeSetLabels(list) {
    if (!list.length) return;
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    const ins = this.insets;
    const m = this._occupancy();
    const occ = (x0, y0, x1, y1) => {
      let n = 0;
      const a0 = Math.max(0, Math.floor(x0 / m.s)), a1 = Math.min(m.w - 1, Math.ceil(x1 / m.s));
      const b0 = Math.max(0, Math.floor(y0 / m.s)), b1 = Math.min(m.h - 1, Math.ceil(y1 / m.s));
      for (let y = b0; y <= b1; y++) {
        const row = (m.h - 1 - y) * m.w;   // Bildzeilen liegen von unten nach oben
        for (let x = a0; x <= a1; x++) if (m.data[(row + x) * 4] > 40) n++;
      }
      return n;
    };
    const proj = (l) => {
      const p = l.at().project(this.camera);
      return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, ok: p.z < 1 };
    };
    const anchors = list.map(proj);
    const mid = anchors.reduce((a, p) => ({ x: a.x + p.x / anchors.length, y: a.y + p.y / anchors.length }), { x: 0, y: 0 });
    const placed = [];
    const GAP = 7;   // Abstand zu Bauteilen (px)
    list.forEach((l, k) => {
      const a = anchors[k];
      const lw = l.el.offsetWidth || 110;
      const lh = l.el.offsetHeight || 26;
      let best = null;
      if (a.ok) {
        const out = Math.hypot(a.x - mid.x, a.y - mid.y) > 1 ? { x: (a.x - mid.x), y: (a.y - mid.y) } : { x: 1, y: 0 };
        const ol = Math.hypot(out.x, out.y);
        for (const dist of [26, 40, 58, 80, 106, 136]) {
          for (let i = 0; i < 24; i++) {
            const ang = (i / 24) * Math.PI * 2;
            const cx = Math.cos(ang);
            const cy = Math.sin(ang);
            const x0 = a.x + cx * dist - lw / 2 + cx * lw / 2;
            const y0 = a.y + cy * dist - lh / 2 + cy * lh / 2;
            const x1 = x0 + lw;
            const y1 = y0 + lh;
            if (x0 < ins.left + 8 || x1 > W - ins.right - 8 || y0 < ins.top + 6 || y1 > H - ins.bottom - 8) continue;
            if (placed.some((b) => x0 < b.x1 + 6 && x1 > b.x0 - 6 && y0 < b.y1 + 6 && y1 > b.y0 - 6)) continue;
            const o = occ(x0 - GAP, y0 - GAP, x1 + GAP, y1 + GAP);
            // Linie zum Anker soll keine anderen Teile kreuzen (die ersten 10 px liegen am eigenen Teil)
            const ex = Math.min(Math.max(a.x, x0), x1);
            const ey = Math.min(Math.max(a.y, y0), y1);
            const len = Math.hypot(ex - a.x, ey - a.y);
            let cross = 0;
            for (let d = 14; d < len; d += 4) {
              const px = a.x + ((ex - a.x) * d) / len;
              const py = a.y + ((ey - a.y) * d) / len;
              cross += occ(px, py, px, py) ? 1 : 0;
            }
            // Linien anderer Beschriftungen nicht schneiden
            const hit = placed.some((b) => segmentsCross(a.x, a.y, ex, ey, b.ax, b.ay, b.ex, b.ey));
            const score = o * 400 + cross * 30 + (hit ? 300 : 0) + dist - 18 * ((cx * out.x + cy * out.y) / ol) + (cy > 0.7 ? 6 : 0);
            if (!best || score < best.score) best = { x0, y0, x1, y1, o, score, ax: a.x, ay: a.y, ex, ey };
          }
          if (best && best.o === 0) break;
        }
      }
      if (!best) {
        l.el.classList.remove('is-shown');
        l.leader.classList.remove('is-shown');
        l.el.hidden = true;
        l.leader.hidden = true;
        return;
      }
      placed.push(best);
      l.el.style.transform = `translate(${best.x0.toFixed(1)}px, ${best.y0.toFixed(1)}px)`;
      // Linie vom Ankerpunkt zum nächsten Punkt des Beschriftungsrahmens
      const tx = Math.min(Math.max(a.x, best.x0 + 4), best.x1 - 4);
      const ty = Math.min(Math.max(a.y, best.y0 + 4), best.y1 - 4);
      const len = Math.max(0, Math.hypot(tx - a.x, ty - a.y));
      const ang = Math.atan2(ty - a.y, tx - a.x);
      l.leader.style.width = `${len.toFixed(1)}px`;
      l.leader.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) rotate(${ang.toFixed(4)}rad)`;
      l.el.classList.add('is-shown');
      l.leader.classList.add('is-shown');
    });
  }

  /* -------------------------------------------------------------- Tastatur */
  _bindKeys() {
    this.canvas.addEventListener('keydown', (e) => {
      const map = {
        ArrowLeft: () => this.rotateBy(-20),
        ArrowRight: () => this.rotateBy(20),
        ArrowUp: () => this.tiltBy(10),
        ArrowDown: () => this.tiltBy(-10),
        '+': () => this.zoomBy(0.8),
        '=': () => this.zoomBy(0.8),
        '-': () => this.zoomBy(1.25),
        '0': () => this.resetView(),
        Home: () => this.resetView(),
      };
      const fn = map[e.key];
      if (fn) {
        e.preventDefault();
        this.dispatchEvent(new Event('interaction'));
        fn();
      }
    });
  }

  /* ------------------------------------------------------------ Rendering */
  resize() {
    // Bildaufbau richtet sich nach der Bühne; die Zeichenfläche kann während der Übergabe aus dem Film nach
    // rechts unter die noch unsichtbare Seitenleiste reichen und zeigt dort die Fortsetzung desselben Bildes
    const fw = this._frameWidth();
    const w = Math.max(fw, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.parentElement.clientHeight);
    // Schärfe: volle Gerätepixeldichte (auch 3× auf Smartphones), begrenzt durch ein Pixelbudget von
    // rund 4,2 Megapixeln, damit große Desktop-Bühnen flüssig bleiben
    const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 3, Math.sqrt(4.2e6 / (fw * h))));
    if (Math.abs(ratio - this.renderer.getPixelRatio()) > 0.01) this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = fw / h;
    this._applyLens();
    // Schmale Bühne (freier Bereich hochkant oder quadratisch): eigene Set-Anordnung
    const i = this.insets;
    const compact = (fw - i.left - i.right) / Math.max(1, h - i.top - i.bottom) < 1.2;
    if (compact !== this.compact) {
      this.compact = compact;
      if (this.objects && this.view === 'set') {
        this.tweens.cancel(this._layoutTween);
        this._layoutState = this._layout('set', this.exploded);
        this._applyLayout(this._layoutState);
        this._placeShadow();
      }
    }
    if (this.objects && this.currentPreset && !this.userMovedCamera && this.currentPreset.name !== 'custom') {
      const p = this.view === 'set' && this.selected ? this._componentPreset(this.selected) : this._preset(this.currentPreset.name);
      if (this._camTween && this.tweens.list.has(this._camTween)) {
        if (this.currentPreset.name === p.name) Object.assign(this.currentPreset, { target: p.target, dir: p.dir, distance: p.distance });
        else this._flyTo(p, 0.6);   // laufenden Kameraflug auf den neuen Ausschnitt umlenken
      } else {
        this._setCamera(p);
        this.currentPreset = p;
        this._applyControlLimits(this.view, p);
      }
    }
    this.dirty = true;
    // setSize leert die Zeichenfläche (auch bei gleicher Größe); sofort neu zeichnen, sonst blitzt bei
    // gleitender Bühnenhöhe (Übergabe) oder neu gemessenen Rändern eine leere Fläche auf
    if (this.objects && !this.paused) this.renderer.render(this.scene, this.camera);
  }

  // Bildmitte in die Mitte des freien Bereichs legen (weg von den Bedienelementen);
  // während der Übergabe aus der Eröffnung stufenlos aus dem Videobildausschnitt überblenden
  _applyLens() {
    const fw = this._frameWidth();
    const w = Math.max(fw, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.parentElement.clientHeight);
    const k = this._lensMix;
    const i = this.insets;
    const ox = (i.right - i.left) / 2;
    const oy = (i.bottom - i.top) / 2;
    const cam = this.camera;
    cam.fov = 28;
    // Bildfeld der Bühne (fw); eine breitere Zeichenfläche setzt es nach rechts fort
    if (ox || oy || w !== fw) cam.setViewOffset(fw, h, ox, oy, w, h);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
    const v = this._lensVideo;
    if (k < 1 && v) {
      // Sichtpyramide als Rand in Höhe der Nahebene: Bühne (normal) und Video (Teilausschnitt)
      const n = cam.near;
      const T = n * Math.tan(THREE.MathUtils.degToRad(14));
      const H = 2 * T;
      const W = cam.aspect * H;
      const nl = -W / 2 + (ox * W) / fw;
      const nt = T - (oy * H) / h;
      const c = this.canvas.getBoundingClientRect();
      const Tv = n * Math.tan(v.fovY / 2);
      const s = (2 * Tv) / v.h;                       // Nahebene je CSS-Pixel des Videos
      const vl = -Tv * v.aspect + (c.left - v.x) * s;
      const vt = Tv - (c.top - v.y) * s;
      const lerp = (x, y) => x + (y - x) * k;
      const l = lerp(vl, nl);
      const r = lerp(vl + c.width * s, nl + (W * w) / fw);
      const t = lerp(vt, nt);
      const bt = lerp(vt - c.height * s, nt - H);
      cam.projectionMatrix.makePerspective(l, r, t, bt, n, cam.far, cam.coordinateSystem);
      cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    }
    this.dirty = true;
  }

  _frameWidth() { return Math.max(1, this.canvas.parentElement.clientWidth); }

  // Bildbereich (CSS-Pixel) der sichtbaren Geometriepunkte (jeder 7.) der übergebenen Teile; Hüllquader
  // wären zu grob (ihre Ecken ragen über die Silhouette hinaus)
  screenBox(roots = [this.objects.handbidet]) {
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld();   // Kamera hängt nicht in der Szene: Lage für die Projektion aktualisieren
    const c = this.canvas.getBoundingClientRect();
    const r = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
    const v = new THREE.Vector3();
    for (const root of roots) {
      root.traverseVisible((o) => {   // nur Sichtbares (z. B. nicht die ausgeblendete Wassergruppe)
        if (!o.isMesh) return;
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 7) {
          v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).project(this.camera);
          if (v.z < -1 || v.z > 1) continue;
          const x = c.left + (v.x * 0.5 + 0.5) * c.width;
          const y = c.top + (0.5 - v.y * 0.5) * c.height;
          r.left = Math.min(r.left, x); r.right = Math.max(r.right, x); r.top = Math.min(r.top, y); r.bottom = Math.max(r.bottom, y);
        }
      });
    }
    return r;
  }

  // Während das Eröffnungsvideo läuft, wird die 3D-Szene nicht gezeichnet
  setPaused(on) {
    this.paused = !!on;
    if (!on) { this.dirty = true; this.shadowDirty = true; }
  }

  /* Übergabe aus der Eröffnung: Die Kamera übernimmt exakt die Einstellung des Videobilds. Das Video
   * füllt die Eröffnungsfläche (object-fit: cover), die Bühne ist ein Teil davon; gezeigt wird genau
   * dieser Teilausschnitt. Danach ruhige Fahrt in die Entdecken-Ansicht.
   * pose: { position, quaternion } in Bühnenkoordinaten; fovY: senkrechter Bildwinkel des Videos;
   * videoAspect: Breite/Höhe des Videos; media: Rechteck der Eröffnungsfläche (CSS-Pixel). */
  handoff(pose, fovY, videoAspect, media, { end = false, then = null } = {}) {
    if (!this.objects || this.view !== 'discover') return false;
    const vw = Math.max(media.width, media.height * videoAspect);
    const vh = vw / videoAspect;
    this._lensVideo = {
      fovY, aspect: videoAspect, h: vh,
      x: media.left + (media.width - vw) / 2,
      y: media.top + (media.height - vh) * (media.posY ?? 0.5),
    };
    // Phasen: Das Video blendet aus, während das 3D-Bild exakt dasselbe zeigt (Produkt in der Halterung,
    // Schlauchmutter, hängender Schlauch; 0–0,45 s, Bild steht). Danach geben Halterung und Schlauch frei
    // und die Kamera fährt in „Entdecken“ (am Filmende bis 2,4 s, sonst 2,0 s) – oder in die gewählte
    // Ansicht (then), die ab diesem Moment selbst fährt.
    const HOLD = 0.45;
    this._releaseFromHolder(HOLD);
    this.tweens.cancel(this._camTween);
    this._lensMix = 0;
    this.camera.position.fromArray(pose.position);
    this.camera.quaternion.fromArray(pose.quaternion);
    // Zielpunkt auf der Blickachse in Produktentfernung (Bildaufbau bleibt unverändert)
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const center = this._layout('discover', 0).handbidet.pos.clone().add(V(0, 0.088, 0));
    const d = center.clone().sub(this.camera.position).dot(fwd);
    this.controls.target.copy(this.camera.position).addScaledVector(fwd, d);
    this._applyLens();
    // Bodenschatten erst nach dem stehenden Bild: Im Videobild gibt es ihn nicht (Licht von links, Wand)
    const sm = this.shadow.plane.material;
    this._shadowBase = this._shadowBase ?? sm.opacity;
    this.tweens.cancel(this._shadowTween);
    sm.opacity = 0;
    this._shadowTween = this.tweens.add({
      duration: this.reduced ? 0 : HOLD + 0.9,
      ease: (t) => t,
      update: (t) => { sm.opacity = this._shadowBase * easeInOut(THREE.MathUtils.clamp((t * (HOLD + 0.9) - HOLD) / 0.9, 0, 1)); this.dirty = true; },
    });
    // Bildbereich von Handbidet und Halterung (CSS-Pixel): Ragt das Produkt über die Zeichenfläche hinaus,
    // entscheidet die Eröffnung auf einen kurzen Schnitt statt einer Überblendung
    this.handoffBox = this.screenBox([this.objects.handbidet, this.objects.bracket]);
    this.renderer.render(this.scene, this.camera);
    if (then) {
      this.currentPreset = { name: 'custom' };
      this._camTween = this.tweens.add({
        duration: this.reduced ? 0 : HOLD,
        update: () => {},
        complete: () => {
          this._camTween = null;
          then();
          // Wurde inzwischen wieder „Entdecken“ gewählt, wechselt die Ansicht nicht – dann fährt die Bühne
          // selbst dorthin (sonst bliebe sie auf dem Filmbild stehen)
          if (!(this._camTween && this.tweens.list.has(this._camTween))) this._flyTo(this._preset(this.view === 'set' && this.exploded ? 'setExploded' : this.view), 1.6);
        },
      });
    } else {
      const dur = end ? 2.4 : 2.0;
      this._flyTo(this._preset('discover'), dur, HOLD / dur);
    }
    // Während des stehenden Bildes keine Bedienung; danach darf Ziehen die Fahrt übernehmen
    this.controls.enabled = false;
    this.tweens.add({ duration: this.reduced ? 0 : HOLD, update: () => {}, complete: () => { this.controls.enabled = !this.waterActive; } });
    return true;
  }

  /* Übergabe: Das Handbidet sitzt wie im Videobild in der Halterung, Mutter und Schlauch hängen daran.
   * Nach hold Sekunden gibt die Halterung es frei (weicht zur Wand zurück und blendet aus), der Schlauch
   * blendet aus. fade = false: Die Halterung bleibt, die folgende Ansicht übernimmt sie in ihre Anordnung. */
  _releaseFromHolder(hold, { fade = true } = {}) {
    const br = this.objects.bracket;
    const hb = this.objects.handbidet;
    const home = hb.position.clone().sub(this.pts.seat);
    br.position.copy(home);
    br.quaternion.identity();
    this._layoutState = { ...this._layoutState, bracket: { pos: home.clone(), quat: new THREE.Quaternion() } };
    this.scene.updateMatrixWorld(true);
    // Hängender Schlauch aus denselben Kurvenpunkten wie im Film (blender/opening_scene.py, build_hose;
    // Blender x, y, z → three x, z, −y)
    const s0 = this.hang.nut.localToWorld(this.pts.hoseStart.clone());
    this.hangHose.build([[0, 0.004, 0], [0, 0, 0], [0.001, -0.06, 0.002], [0.006, -0.16, 0.012],
      [0.004, -0.3, 0.03], [-0.012, -0.48, 0.05], [-0.03, -0.7, 0.06]].map((v) => s0.clone().add(V(...v))));
    this.tweens.cancel(this._opacityTween);
    this.tweens.cancel(this._holderTween);
    this.tweens.cancel(this._hangTween);
    this._setOpacity(this.comps.bracket, 1);
    this._setOpacity(this.hang, 1);
    const ease = (t, a, b) => easeInOut(THREE.MathUtils.clamp((t - a) / (b - a), 0, 1));
    // Schlauch und Mutter: eigene Überblendung (nicht von Ansichtswechseln abgebrochen)
    this._hangTween = this.tweens.add({
      duration: this.reduced ? 0 : hold + 0.5,
      ease: (t) => t,
      update: (t) => {
        this._setOpacity(this.hang, 1 - ease(t, hold / (hold + 0.5), 1));
        this.shadowDirty = true;
        this.dirty = true;
      },
      complete: () => this._setOpacity(this.hang, 0),
    });
    if (!fade) return;
    const duration = hold + 0.7;
    this._holderTween = this.tweens.add({
      duration: this.reduced ? 0 : duration,
      ease: (t) => t,
      update: (t) => {
        const k = ease(t, hold / duration, 1);
        br.position.copy(home).add(V(0, -0.01 * k, -0.026 * k));
        this._layoutState.bracket.pos.copy(br.position);   // ein Ansichtswechsel setzt hier an
        this._setOpacity(this.comps.bracket, 1 - THREE.MathUtils.clamp(k * 1.25, 0, 1));
        this.shadowDirty = true;
        this.dirty = true;
      },
      complete: () => {
        this._setOpacity(this.comps.bracket, 0);
        this._layoutState = this._layout('discover', 0);
        this._applyLayout(this._layoutState);   // Halterung zurück an ihren Platz im Layout
      },
    });
  }

  setInsets(ins) {
    this.insets = { top: 0, right: 0, bottom: 0, left: 0, ...ins };
    this.resize();   // gleicht auch eine geänderte Bühnengröße ab
  }

  _start() {
    this.currentPreset = this._preset('discover');
    // Shader aller Teile vorab übersetzen (auch der noch unsichtbaren Set- und Anschlussteile),
    // sonst stockt der erste Wechsel in eine andere Ansicht
    const hidden = [];
    this.scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
    try { this.renderer.compile(this.scene, this.camera); } finally { hidden.forEach((o) => { o.visible = false; }); }
    const tick = () => {
      this._raf = requestAnimationFrame(tick);
      try {
        this._frame();
      } catch (err) {
        cancelAnimationFrame(this._raf);
        console.error(err);
        this.dispatchEvent(new CustomEvent('runtimeerror', { detail: err }));
      }
    };
    this._frame = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - this._last) / 1000);
      this._last = now;
      if (this.paused) return;
      let active = this.tweens.update(dt);
      if (this.controls.enabled) active = this.controls.update() || active;
      active = this.water.update(dt) || active;
      for (const f of Object.values(this.flows)) active = f.update(dt, this.reduced) || active;
      if (active || this.dirty) {
        if (this.shadowDirty) {
          this.shadow.render(this.scene);
          if (this.backdrop && this.backdrop.visible) this.wallShadow.render(this.scene);
          this.shadowDirty = false;
        }
        this.renderer.render(this.scene, this.camera);
        this._updateLabels();
        this.dirty = false;
      } else if (this.view === 'set') {
        this._updateSetLabels();   // Beschriftung erscheint, sobald alles ruht
      }
    };
    tick();
    this.dispatchEvent(new Event('ready'));
  }
}

function segmentsCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const o = (px, py, qx, qy, rx, ry) => Math.sign((qx - px) * (ry - py) - (qy - py) * (rx - px));
  return o(ax, ay, bx, by, cx, cy) !== o(ax, ay, bx, by, dx, dy) && o(cx, cy, dx, dy, ax, ay) !== o(cx, cy, dx, dy, bx, by);
}

// Zurücktreten: Ausgabefarbe zum Hintergrund hin mischen (Werte je Bauteil über uni.value)
const MUTE_UNIFORM = { value: MUTE_COLOR };
/* Rillen und Geflecht: Sobald eine Rille im Bild schmaler als etwa zwei Pixel wird, blendet die
 * Normalmap pixelgenau aus und die Fläche wird etwas rauer (gemittelter Glanz). Verhindert Moiré und
 * Flimmern bei Bewegung und Entfernung; in der Nahansicht bleibt die Struktur voll erhalten. */
function addDetailFade(m) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (shader, r) => {
    prev.call(m, shader, r);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
#ifdef USE_NORMALMAP
  {
    vec2 ribD = fwidth( vNormalMapUv );
    float ribK = 1.0 - smoothstep( 0.22, 0.6, max( ribD.x, ribD.y ) );
    normal = normalize( mix( nonPerturbedNormal, normal, ribK ) );
    roughnessFactor = mix( min( roughnessFactor + 0.16, 1.0 ), roughnessFactor, ribK );
  }
#endif`);
  };
  const key = m.customProgramCacheKey.bind(m);
  m.customProgramCacheKey = () => key() + '|detailfade';
  m.needsUpdate = true;
}

// Gewinde: Die Vorlage bildet das Außengewinde als einzelne Ringe ab. Daraus wird ein durchgehender Gewindegang
// mit denselben Maßen (Spitzen- und Kernradius, Steigung = Ringabstand, alles aus der Geometrie gelesen): Ringe auf
// den Kernradius zurücknehmen, darüber eine schraubenförmige Fläche mit gerundetem Profil, auslaufend an den Enden.
function helicalThread(mesh) {
  if (!mesh || !mesh.isMesh) return false;
  const g = mesh.geometry;
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const cx = (bb.min.x + bb.max.x) / 2;
  const cz = (bb.min.z + bb.max.z) / 2;
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  const lv = new Map();   // größter Radius je Höhe
  for (let i = 0; i < pos.count; i++) {
    const y = Math.round(pos.getY(i) * 1e5);
    lv.set(y, Math.max(lv.get(y) || 0, Math.hypot(pos.getX(i) - cx, pos.getZ(i) - cz)));
  }
  const counts = new Map();
  for (const r of lv.values()) { const k = Math.round(r * 1e5); counts.set(k, (counts.get(k) || 0) + 1); }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k / 1e5);
  const crest = ranked[0];
  const root = ranked.find((r) => r < crest - 2e-4 && r > crest - 0.0015);
  if (!root) return false;
  const crestYs = [...lv.entries()].filter(([, r]) => Math.abs(r - crest) < 2e-5).map(([y]) => y / 1e5).sort((a, b) => a - b);
  const groups = [];
  for (const y of crestYs) {
    const q = groups[groups.length - 1];
    if (q && y - q[q.length - 1] < 4e-4) q.push(y); else groups.push([y]);
  }
  if (groups.length < 3) return false;
  const centers = groups.map((q) => (q[0] + q[q.length - 1]) / 2);
  const pitch = (centers[centers.length - 1] - centers[0]) / (centers.length - 1);
  const y0 = centers[0] - pitch / 2;
  const y1 = centers[centers.length - 1] + pitch / 2;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < y0 - 1e-5 || y > y1 + 1e-5) continue;
    const dx = pos.getX(i) - cx;
    const dz = pos.getZ(i) - cz;
    const r = Math.hypot(dx, dz);
    if (r > root + 1e-6 && r <= crest + 1e-5) {
      const k = (root - 1e-4) / r;   // Abstand zur Schraubenfläche: kein Durchscheinen in den Tälern
      pos.setXYZ(i, cx + dx * k, y, cz + dz * k);
      if (nor) nor.setXYZ(i, dx / r, 0, dz / r);
    }
  }
  pos.needsUpdate = true;
  if (nor) nor.needsUpdate = true;
  // Schraubenfläche r(θ, y), periodisch in θ (keine Naht)
  const depth = crest - root;
  const smooth = (x) => x * x * (3 - 2 * x);
  const radius = (th, y) => {
    let f = (y - y0) / pitch - th / (Math.PI * 2);
    f -= Math.floor(f);
    const fade = smooth(THREE.MathUtils.clamp((y - y0) / (pitch * 0.6), 0, 1)) * smooth(THREE.MathUtils.clamp((y1 - y) / (pitch * 0.6), 0, 1));
    return root + 2e-5 + (depth - 2e-5) * smooth(1 - Math.abs(2 * f - 1)) * fade;
  };
  const point = (th, y, out) => { const r = radius(th, y); return out.set(cx + r * Math.cos(th), y, cz - r * Math.sin(th)); };
  const nT = 64;
  const nY = Math.max(8, Math.ceil(((y1 - y0) / pitch) * 14));
  const P = [];
  const N = [];
  const a = new THREE.Vector3(); const b = new THREE.Vector3(); const c = new THREE.Vector3(); const d = new THREE.Vector3();
  const e = 1e-4;
  for (let j = 0; j <= nY; j++) {
    const y = y0 + ((y1 - y0) * j) / nY;
    for (let i = 0; i <= nT; i++) {
      const th = (Math.PI * 2 * i) / nT;
      point(th, y, a); P.push(a.x, a.y, a.z);
      point(th + e, y, b); point(th - e, y, c); b.sub(c);            // ∂P/∂θ
      point(th, y + e * 0.01, c); point(th, y - e * 0.01, d); c.sub(d);   // ∂P/∂y
      const n = new THREE.Vector3().crossVectors(b, c).normalize();
      if (n.x * (a.x - cx) + n.z * (a.z - cz) < 0) n.negate();
      N.push(n.x, n.y, n.z);
    }
  }
  const idx = [];
  for (let j = 0; j < nY; j++) for (let i = 0; i < nT; i++) {
    const p0 = j * (nT + 1) + i; const p1 = p0 + 1; const p2 = p0 + nT + 1; const p3 = p2 + 1;
    idx.push(p0, p2, p1, p1, p2, p3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  geo.setIndex(idx);
  const helix = new THREE.Mesh(geo, mesh.material);
  helix.name = mesh.name + '_Gang';
  helix.castShadow = mesh.castShadow;
  helix.receiveShadow = mesh.receiveShadow;
  helix.layers.mask = mesh.layers.mask;
  mesh.add(helix);
  return { crest, root, pitch, turns: (y1 - y0) / pitch };
}

// Bürststruktur an schmalen Rundungen zurücknehmen: Ändert sich die Flächennormale innerhalb eines Bildpixels
// stark (Fasen, Kantenradien), zerlegten Normalen- und Rauheitsstreuung dort die Glanzlinie in helle und dunkle
// Stücke; große Flächen behalten die Struktur
function addEdgeCalm(m) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (shader, r) => {
    prev.call(m, shader, r);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
#ifdef USE_NORMALMAP
  {
    float edgeK = 1.0 - smoothstep( 0.008, 0.03, length( fwidth( nonPerturbedNormal ) ) );
    normal = normalize( mix( nonPerturbedNormal, normal, edgeK ) );
    roughnessFactor = mix( roughness, roughnessFactor, edgeK );
  }
#endif`);
  };
  const key = m.customProgramCacheKey.bind(m);
  m.customProgramCacheKey = () => key() + '|edgecalm';
  m.needsUpdate = true;
}

function addMute(m, uni) {
  const prev = m.onBeforeCompile;
  const prevKey = m.customProgramCacheKey.bind(m);
  m.onBeforeCompile = (shader, r) => {
    prev.call(m, shader, r);
    shader.uniforms.uMute = uni;
    shader.uniforms.uMuteColor = MUTE_UNIFORM;
    shader.fragmentShader = 'uniform float uMute;\nuniform vec3 uMuteColor;\n' + shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      '#include <dithering_fragment>\n\tgl_FragColor.rgb = mix(gl_FragColor.rgb, uMuteColor, uMute);'
    );
  };
  m.customProgramCacheKey = () => prevKey() + '|mute';
  m.needsUpdate = true;
}

// Boden, Hohlkehle (r 0,14 m) und Wand als eine Fläche; nur in der Setansicht sichtbar.
function buildBackdrop(onReady) {
  const R = 0.14;
  const prof = [];   // (y, z)
  for (let z = 1.6; z > SET_WALL_Z + R + 1e-6; z -= 0.1) prof.push([0, z]);
  for (let i = 0; i <= 16; i++) {
    const a = (Math.PI / 2) * (i / 16);
    prof.push([R - R * Math.cos(a), SET_WALL_Z + R - R * Math.sin(a)]);
  }
  for (let y = R + 0.1; y < 1.6; y += 0.1) prof.push([y, SET_WALL_Z]);
  const xs = [-2, -1, -0.5, 0, 0.5, 1, 2];
  const pos = [];
  const idx = [];
  const colors = [];
  const uvs = [];
  const floor = new THREE.Color('#F5EFE5');
  const wall = new THREE.Color('#FFFFFF');
  for (const [y, z] of prof) for (const x of xs) {
    pos.push(x, y - 0.0006, z);
    uvs.push((x + .9) / 1.8, (y + .35 - Math.max(0, z - SET_WALL_Z) * .25) / 1.8);
    // Das gebackene Tageslicht bleibt an der Wand neutral, die Ablage bekommt eine warme Tönung.
    const tint = floor.clone().lerp(wall, THREE.MathUtils.smoothstep(y, 0.015, 0.26));
    colors.push(tint.r, tint.g, tint.b);
  }
  const n = xs.length;
  for (let i = 0; i < prof.length - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      const a = i * n + j;
      idx.push(a, a + 1, a + n, a + 1, a + n + 1, a + n);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  // Blender hat Tageslicht und Putz bereits berechnet. Keine zweite Beleuchtung im Browser.
  // Bei Ladefehler bleibt die ruhige Grundfarbe; das Produkt bleibt bedienbar.
  const mat = new THREE.MeshBasicMaterial({ color: '#DAD8D2', vertexColors: true, toneMapped: false });
  new THREE.TextureLoader().load('assets/atmosphere/mineral-daylight.jpg', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    mat.map = texture; mat.color.set('#FFFFFF'); mat.needsUpdate = true;
    onReady?.();
  }, undefined, () => onReady?.());
  const mesh = new THREE.Mesh(geo, mat);
  mesh.layers.set(1);   // wirft keinen Kontaktschatten
  mesh.renderOrder = -2;
  mesh.visible = false;
  return mesh;
}

function stageError(kind, message, cause) {
  const err = new Error(message);
  err.kind = kind;
  if (cause) err.cause = cause;
  return err;
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (_) {
    return false;
  }
}
