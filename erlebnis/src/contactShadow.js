// Weicher Kontaktschatten auf dem Bühnenboden (Tiefenbild von unten, zweifach weichgezeichnet).
// Nur Objekte auf Layer 0 werfen Schatten; Effekte, Schemateile und Wand liegen auf Layer 1.
import * as THREE from 'three';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

export class ContactShadow {
  constructor(renderer, { size = 1.4, height = 0.32, resolution = 512, darkness = 1.15, opacity = 0.62, blur = 2.6 } = {}) {
    this.renderer = renderer;
    this.blur = blur;
    this.group = new THREE.Group();
    this.rt = new THREE.WebGLRenderTarget(resolution, resolution);
    this.rt.texture.generateMipmaps = false;
    this.rtBlur = new THREE.WebGLRenderTarget(resolution, resolution);
    this.rtBlur.texture.generateMipmaps = false;

    const planeGeo = new THREE.PlaneGeometry(size, size).rotateX(Math.PI / 2);
    this.plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
      map: this.rt.texture, opacity, transparent: true, depthWrite: false,
    }));
    this.plane.renderOrder = -1;
    this.plane.scale.y = -1;
    this.plane.layers.set(1);
    this.group.add(this.plane);

    this.blurPlane = new THREE.Mesh(planeGeo);
    this.blurPlane.visible = false;
    this.group.add(this.blurPlane);

    this.camera = new THREE.OrthographicCamera(-size / 2, size / 2, size / 2, -size / 2, 0, height);
    this.camera.rotation.x = Math.PI / 2;
    this.group.add(this.camera);

    this.depthMaterial = new THREE.MeshDepthMaterial();
    this.depthMaterial.userData.darkness = { value: darkness };
    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.darkness = this.depthMaterial.userData.darkness;
      shader.fragmentShader = /* glsl */`
        uniform float darkness;
        ${shader.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
        )}`;
    };
    this.depthMaterial.depthTest = false;
    this.depthMaterial.depthWrite = false;

    this.hBlur = new THREE.ShaderMaterial(HorizontalBlurShader);
    this.hBlur.depthTest = false;
    this.vBlur = new THREE.ShaderMaterial(VerticalBlurShader);
    this.vBlur.depthTest = false;
  }

  _blur(amount) {
    const r = this.renderer;
    this.blurPlane.visible = true;
    this.blurPlane.material = this.hBlur;
    this.hBlur.uniforms.tDiffuse.value = this.rt.texture;
    this.hBlur.uniforms.h.value = amount / 256;
    r.setRenderTarget(this.rtBlur);
    r.render(this.blurPlane, this.camera);
    this.blurPlane.material = this.vBlur;
    this.vBlur.uniforms.tDiffuse.value = this.rtBlur.texture;
    this.vBlur.uniforms.v.value = amount / 256;
    r.setRenderTarget(this.rt);
    r.render(this.blurPlane, this.camera);
    this.blurPlane.visible = false;
  }

  render(scene) {
    const r = this.renderer;
    const prevClear = r.getClearAlpha();
    const prevBg = scene.background;
    scene.background = null;
    scene.overrideMaterial = this.depthMaterial;
    r.setClearAlpha(0);
    r.setRenderTarget(this.rt);
    r.clear();
    r.render(scene, this.camera);
    scene.overrideMaterial = null;
    this._blur(this.blur);
    this._blur(this.blur * 0.4);
    r.setRenderTarget(null);
    r.setClearAlpha(prevClear);
    scene.background = prevBg;
  }
}
