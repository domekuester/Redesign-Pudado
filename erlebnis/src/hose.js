// Brauseschlauch: Rohrgeometrie entlang einer Kurve zwischen den beiden Schlauchmuttern.
// Die Kurve wird bei Lageänderungen neu berechnet (Set, Explosionsansicht, Anschluss).
import * as THREE from 'three';

const RIB_PITCH = 0.0026; // Rillenabstand der Darstellung (m), keine Produktangabe

export class Hose {
  constructor(material, radius = 0.0068, pitch = RIB_PITCH, radialRepeat = 1) {
    this.radius = radius;
    this.pitch = pitch;
    this.radialRepeat = radialRepeat;
    this.material = material;
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
    this.mesh.frustumCulled = false;
    this.curve = null;
    this.length = 0;
    this._points = [];
    this._point = new THREE.Vector3();
    this._normal = new THREE.Vector3();
    this._segments = 0;
  }

  // points: Array<Vector3> (Weltkoordinaten), Endtangenten bereits enthalten
  build(points) {
    // Layout-Tweens aktualisieren auch unveränderte Teile: deren GPU-Puffer bleiben unberührt.
    if (points.length === this._points.length && points.every((p, i) => p.distanceToSquared(this._points[i]) < 1e-18)) return this.curve;
    this._points = points.map((p) => p.clone());
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
    const length = curve.getLength();
    // Kapazität wächst in Stufen; weder Indizes noch UVs ändern sich während der Verformung.
    const needed = Math.max(32, Math.min(520, Math.ceil(length / 0.0035 / 32) * 32));
    let geo = this.mesh.geometry;
    if (needed > this._segments) {
      geo.dispose();
      geo = new THREE.TubeGeometry(curve, needed, this.radius, 14, false);
      geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
      geo.attributes.normal.setUsage(THREE.DynamicDrawUsage);
      this.mesh.geometry = geo;
      this._segments = needed;
    } else {
      const frames = curve.computeFrenetFrames(this._segments, false);
      const pos = geo.attributes.position, normals = geo.attributes.normal;
      for (let i = 0; i <= this._segments; i++) {
        curve.getPointAt(i / this._segments, this._point);
        const n = frames.normals[i], b = frames.binormals[i];
        for (let j = 0; j <= 14; j++) {
          const angle = j / 14 * Math.PI * 2;
          this._normal.copy(n).multiplyScalar(-Math.cos(angle)).addScaledVector(b, Math.sin(angle)).normalize();
          const k = i * 15 + j;
          normals.setXYZ(k, this._normal.x, this._normal.y, this._normal.z);
          pos.setXYZ(k, this._point.x + this.radius * this._normal.x,
            this._point.y + this.radius * this._normal.y, this._point.z + this.radius * this._normal.z);
        }
      }
      pos.needsUpdate = normals.needsUpdate = true;
      // Raycasting und spätere Detailfahrten brauchen die neue Ausdehnung.
      geo.boundingSphere = null;
      geo.boundingBox = null;
    }
    this.curve = curve;
    this.length = length;
    for (const map of [this.material.normalMap]) {
      if (map) map.repeat.set(length / this.pitch, this.radialRepeat);
    }
    return curve;
  }

  // Anteil 0..1 sichtbar (Aufbau-Animation vom Handbidet aus)
  setReveal(t) {
    const g = this.mesh.geometry;
    if (!g.index) return;
    g.setDrawRange(0, Math.round(g.index.count * Math.max(0, Math.min(1, t))));
    this.mesh.visible = t > 0.001;
  }

  sphere() {
    if (!this.mesh.geometry.boundingSphere) this.mesh.geometry.computeBoundingSphere();
    return this.mesh.geometry.boundingSphere;
  }
}
