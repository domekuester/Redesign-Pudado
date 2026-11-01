// Cached scene refraction: water animation itself never triggers an extra scene pass.
// The CSS studio wall is composited once per resize; only scene changes refresh the capture.
import * as THREE from 'three';

export class WaterBackdrop {
  constructor(renderer, onReady) {
    this.renderer = renderer;
    this.size = new THREE.Vector2();
    this.valid = false;
    this.captures = 0;
    this.canvas = document.createElement('canvas');
    this.background = new THREE.CanvasTexture(this.canvas);
    this.background.colorSpace = THREE.SRGBColorSpace;
    this.background.generateMipmaps = false;
    this.background.minFilter = THREE.LinearFilter;
    this.image = new Image();
    this.image.onload = () => { this.paint(); this.valid = false; onReady?.(); };
    this.image.src = 'assets/atmosphere/mineral-soft.jpg';
  }
  resize(width, height) {
    if (this.size.x === width && this.size.y === height) return;
    this.size.set(width, height);
    // At most 0.75 MP, allocated only while the water is actually used.
    const scale = Math.min(1, Math.sqrt(750000 / (width * height)));
    const w = Math.max(1, Math.floor(width * scale)), h = Math.max(1, Math.floor(height * scale));
    if (!this.target) this.target = new THREE.WebGLRenderTarget(w, h, {
      type: this.renderer.extensions.has('EXT_color_buffer_float') ? THREE.HalfFloatType : THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
    });
    else this.target.setSize(w, h);
    this.paint(); this.valid = false;
  }
  paint() {
    const w = 512, h = Math.max(1, Math.round(w * (this.size.y || 1) / (this.size.x || 1)));
    this.canvas.width = w; this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    const ellipse = (cx, cy, rx, ry, stops) => {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(rx, ry);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      stops.forEach(([p,c]) => g.addColorStop(p,c)); ctx.fillStyle = g;
      ctx.fillRect(-cx/rx,-cy/ry,w/rx,h/ry); ctx.restore();
    };
    ellipse(w*.5,h*.4,w*1.4,h*1.1,[[0,'#ECE9E4'],[.4,'#ECE9E4'],[1,'#E0DCD6']]);
    ellipse(w*.24,h*.18,w*.9,h*.8,[[0,'#F3F1ED'],[.7,'rgba(243,241,237,0)'],[1,'rgba(243,241,237,0)']]);
    if (this.image.complete && this.image.naturalWidth) {
      const s = Math.max(w/this.image.naturalWidth,h/this.image.naturalHeight);
      ctx.globalAlpha = .72;
      ctx.drawImage(this.image,(w-this.image.naturalWidth*s)/2,(h-this.image.naturalHeight*s)/2,this.image.naturalWidth*s,this.image.naturalHeight*s);
      ctx.globalAlpha = 1;
    }
    this.background.needsUpdate = true;
  }
  capture(scene, camera, water) {
    const r = this.renderer, previousTarget = r.getRenderTarget(), previousBackground = scene.background;
    const visible = water.group.visible;
    this.valid = false;
    try {
      water.group.visible = false; scene.background = this.background;
      r.setRenderTarget(this.target); r.render(scene,camera);
      this.valid = true; this.captures++;
    } finally {
      scene.background = previousBackground; water.group.visible = visible; r.setRenderTarget(previousTarget);
    }
    water.setBackdrop(this.target.texture,this.size);
  }
  dispose() { this.target?.dispose(); this.background.dispose(); }
}
