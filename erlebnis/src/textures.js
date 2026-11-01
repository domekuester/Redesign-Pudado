// Prozedurale Texturen (Canvas): Bürststruktur, Schlauchrillen, Logo-Decals.
import * as THREE from 'three';

function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Bürststruktur (Bürstrichtung entlang V) als Rauheits- und Normalkarte aus demselben Höhenfeld, 512 × 512.
// Maßstab so gewählt, dass bei normaler Betrachtung etwa ein Texel auf ein Bildpixel fällt: breite Bahnen
// ändern die Rauheit sichtbar, feine Linien mit endlicher, wechselnder Stärke kippen die Normale leicht.
// Vorher (1024 × 32, fünffach wiederholt) mittelten die Mipmaps die Struktur zu gleichmäßigem Grau
// (Vergleich docs/qa/qualitaet/produkt/varianten/).
export function brushedTextures({ size = 512, seed = 11 } = {}) {
  const rand = seeded(seed);
  const W = size, H = size;
  const h = new Float32Array(W * H);
  for (let x = 0; x < W; x++) {
    const amp = 0.4 + rand() * 0.6;
    const ph = rand() * Math.PI * 2;
    const f = 1 + Math.floor(rand() * 3);
    const c = rand();
    for (let y = 0; y < H; y++) h[y * W + x] = c * (0.6 + 0.4 * amp * Math.sin(ph + (y / H) * Math.PI * 2 * f));
  }
  const broad0 = new Float32Array(W);
  for (let x = 0; x < W; x++) broad0[x] = rand();
  const smooth = (src, r) => {
    const out = new Float32Array(W);
    for (let i = 0; i < W; i++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += src[(i + k + W) % W];
      out[i] = sum / (2 * r + 1);
    }
    return out;
  };
  const broad = smooth(smooth(broad0, 6), 6);
  const canvas = (fill) => {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) fill(img.data, (y * W + x) * 4, x, y);
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.NoColorSpace;
    tex.anisotropy = 8;
    return tex;
  };
  const rough = canvas((d, o, x, y) => {
    const v = 0.9 + (h[y * W + x] - 0.5) * 0.16 + (broad[x] - 0.5) * 0.4;
    d[o] = d[o + 1] = d[o + 2] = Math.max(0, Math.min(255, Math.round(v * 255)));
    d[o + 3] = 255;
  });
  const normal = canvas((d, o, x, y) => {
    const dx = h[y * W + ((x + 1) % W)] - h[y * W + ((x - 1 + W) % W)];
    const nx = -dx * 1.2;
    const l = Math.hypot(nx, 1);
    d[o] = Math.round((nx / l * 0.5 + 0.5) * 255);
    d[o + 1] = 128;
    d[o + 2] = Math.round((1 / l * 0.5 + 0.5) * 255);
    d[o + 3] = 255;
  });
  return { rough, normal };
}

// Normalmap für den gewellten Metallschlauch (Rillen quer zur Länge = entlang U).
export function ribNormalTexture() {
  const w = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, 4);
  for (let x = 0; x < w; x++) {
    const t = (x / w) * Math.PI * 2;
    const slope = Math.cos(t) * 0.85; // Ableitung eines Sinusprofils
    const n = new THREE.Vector3(-slope, 0, 1).normalize();
    for (let y = 0; y < 4; y++) {
      const o = (y * w + x) * 4;
      img.data[o] = Math.round((n.x * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round((n.y * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round((n.z * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

// Tropfen + Schriftzug „PUDADO“ als transparentes Decal.
export function logoTexture({ color = '#555', layout = 'stack', withText = true } = {}) {
  const canvas = document.createElement('canvas');
  const W = layout === 'stack' ? 512 : 512;
  const H = layout === 'stack' ? 640 : 512;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Tropfen (Form wie im Pudado-Logo)
  const cx = W / 2;
  const top = layout === 'stack' ? 70 : 90;
  const s = layout === 'stack' ? 6.2 : 8;
  ctx.save();
  ctx.translate(cx - 28 * s, top - 6 * s);
  ctx.scale(s, s);
  ctx.lineWidth = 15 / s;
  ctx.beginPath();
  ctx.moveTo(28, 6);
  ctx.bezierCurveTo(22, 16, 14, 23, 14, 33);
  ctx.arc(28, 33, 14, Math.PI, 0, true);
  ctx.bezierCurveTo(42, 23, 34, 16, 28, 6);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  if (withText) {
    ctx.font = '500 92px "Cabinet Grotesk", "Inter", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const text = 'PUDADO';
    const spacing = 30;
    let total = 0;
    const widths = [...text].map((ch) => {
      const w = ctx.measureText(ch).width;
      total += w;
      return w;
    });
    total += spacing * (text.length - 1);
    let x = cx - total / 2;
    const y = layout === 'stack' ? H - 70 : H - 60;
    ctx.textAlign = 'left';
    [...text].forEach((ch, i) => {
      ctx.fillText(ch, x, y);
      x += widths[i] + spacing;
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { texture: tex, aspect: W / H };
}

// Normalmap für den umflochtenen Anschlussschlauch (Rautenmuster, deutlich anders als die Rillen
// des Brauseschlauchs). Darstellung, keine Produktangabe.
export function braidNormalTexture() {
  // Edelstahlgeflecht: zwei gegenläufige Bänder aus je vier Drähten, abwechselnd oben und unten
  // (Rautenbild wie bei üblichen Anschlussschläuchen; Darstellung, keine Produktangabe)
  const n = 128;
  const canvas = document.createElement('canvas');
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(n, n);
  const WIRES = 4;
  const height = (x, y) => {
    const u = ((x % n) + n) % n / n;
    const v = ((y % n) + n) % n / n;
    const a = (u + v) * 2;       // Band A (Steigung +)
    const b = (u - v + 1) * 2;   // Band B (Steigung −)
    const fa = a - Math.floor(a);
    const fb = b - Math.floor(b);
    const wire = (f) => Math.sqrt(Math.max(0, 1 - Math.pow(((f * WIRES) % 1) * 2 - 1, 2)));   // runder Draht
    const edge = (f) => Math.min(1, Math.min(f, 1 - f) * 10);                              // Bandrand
    const aTop = (Math.floor(a) + Math.floor(b)) % 2 === 0;
    const ha = wire(fa) * edge(fa) * (aTop ? 1 : 0.55);
    const hb = wire(fb) * edge(fb) * (aTop ? 0.55 : 1);
    return Math.max(ha, hb);
  };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const nx = (height(x - 1, y) - height(x + 1, y)) * 1.6;
      const ny = (height(x, y - 1) - height(x, y + 1)) * 1.6;
      const len = Math.hypot(nx, ny, 1);
      const o = (y * n + x) * 4;
      img.data[o] = Math.round((nx / len * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round((1 / len * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Feine, unregelmäßige Körnung für matten Kunststoff (Halterung). Darstellung, keine Produktangabe.
export function grainNormalTexture() {
  const n = 128;
  const rand = seeded(19);
  const hgt = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) hgt[i] = rand();
  const at = (x, y) => hgt[((y + n) % n) * n + ((x + n) % n)];
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = n;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(n, n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const nx = (at(x - 1, y) - at(x + 1, y)) * 0.5;
      const ny = (at(x, y - 1) - at(x, y + 1)) * 0.5;
      const len = Math.hypot(nx, ny, 1);
      const o = (y * n + x) * 4;
      img.data[o] = Math.round((nx / len * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round((1 / len * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 14);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}


// Feine konzentrische Drehspuren: die Profilkoordinate V der Düsenfläche ist radial.
// Endliche Texturfrequenz und Mipmaps halten die Ringe beim Herauszoomen ruhig.
export function turnedTextures() {
  const n = 512, rand = seeded(73), bands = Array.from({ length: n }, () => rand());
  const make = (normal) => {
    const c = document.createElement('canvas'); c.width = 8; c.height = n;
    const ctx = c.getContext('2d'), img = ctx.createImageData(8, n);
    for (let y = 0; y < n; y++) for (let x = 0; x < 8; x++) {
      const i = (y * 8 + x) * 4;
      if (normal) {
        const dy = (bands[(y + 1) % n] - bands[(y + n - 1) % n]) * .65;
        const len = Math.hypot(dy, 1);
        img.data[i] = 128; img.data[i + 1] = Math.round((dy / len * .5 + .5) * 255);
        img.data[i + 2] = Math.round((1 / len * .5 + .5) * 255);
      } else img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(218 + bands[y] * 25);
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.NoColorSpace;
    tex.anisotropy = 8;
    return tex;
  };
  return { normal: make(true), rough: make(false) };
}
