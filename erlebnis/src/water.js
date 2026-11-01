// Optical illustration of the two observed prototype streams, not a fluid simulation.
// Surface highlights, moving ripples and downstream breakup stay deliberately subtle.
import * as THREE from 'three';

const VERT = /* glsl */`
  attribute float aT;
  attribute float aSeed;
  attribute float aRadius;
  attribute vec3 aTangent;
  uniform float uTime;
  uniform float uFlow;
  uniform float uBundle;
  varying float vT;
  varying float vSeed;
  varying float vRing;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vT = aT; vSeed = aSeed; vRing = uv.y;
    float theta = uv.y * 6.283185;
    float travel = aT - uTime * 3.2 * uFlow;
    float p1 = travel * 36.0 + theta * 2.0 + aSeed * 8.3;
    float p2 = travel * 67.0 - theta * 3.0 + aSeed * 17.1;
    float envelope = smoothstep(0.02, 0.34, aT);
    float amplitude = mix(0.000085, 0.00028 + .00024 * smoothstep(.35, 1.0, aT), uBundle) * envelope;
    float wave = sin(p1) * .65 + sin(p2) * .35;
    float axial = amplitude * (36.0 * cos(p1) * .65 + 67.0 * cos(p2) * .35) / .22;
    float around = amplitude * (2.0 * cos(p1) * .65 - 3.0 * cos(p2) * .35) / aRadius;
    vec3 tangent = normalize(aTangent);
    vec3 circumferential = normalize(cross(tangent, normal));
    // Deformed normals travel with the surface, so the studio reflections move
    // with the water instead of looking painted onto rigid tubes.
    vec3 n = normalize(normal - tangent * axial - circumferential * around);
    float neck = 1.0 - .16 * smoothstep(.6, 1.0, aT) * (.5 + .5 * sin(p1 * .43));
    vec3 p = position + normal * (wave * amplitude + (neck - 1.0) * aRadius);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorldPos = world.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const FRAG = /* glsl */`
  uniform float uTime;
  uniform float uHead;
  uniform float uTail;
  uniform float uFlow;
  uniform float uOpacity;
  uniform float uBundle;
  uniform float uEnvironmentIntensity;
  uniform sampler2D uBackdrop;
  uniform vec2 uResolution;
  uniform float uHasBackdrop;
  #ifdef WATER_ENVIRONMENT
    uniform sampler2D uEnvironment;
    #include <cube_uv_reflection_fragment>
  #endif
  varying float vT;
  varying float vSeed;
  varying float vRing;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    if (vT > uHead || vT < uTail) discard;
    vec3 n = normalize(vWorldNormal);
    vec3 eye = normalize(cameraPosition - vWorldPos);
    float facing = clamp(abs(dot(n, eye)), 0.0, 1.0);
    // Water's optical Fresnel response (IOR about 1.333). Refraction below is an
    // environment approximation, not an expensive screen-space fluid simulation.
    float fresnel = .0204 + .9796 * pow(1.0 - facing, 5.0);
    vec3 reflected = vec3(.72);
    vec3 refracted = vec3(.48, .53, .54);
    vec3 diffuse = vec3(.64);
    #ifdef WATER_ENVIRONMENT
      reflected = textureCubeUV(uEnvironment, reflect(-eye, n), .075).rgb * uEnvironmentIntensity;
      refracted = textureCubeUV(uEnvironment, refract(-eye, n, 1.0 / 1.333), .13).rgb * uEnvironmentIntensity;
      diffuse = textureCubeUV(uEnvironment, n, .8).rgb * uEnvironmentIntensity;
    #endif
    float travel = vT - uTime * 3.2 * uFlow;
    float detail = noise(vec2(travel * 78.0 + vSeed * 17.0, vRing * 14.0));
    float slow = noise(vec2(travel * 23.0, vSeed * 7.0 + vRing * 4.0));
    float luma = dot(reflected, vec3(.2126, .7152, .0722));
    vec3 clearWater = mix(refracted * .7, reflected, .3 + .7 * fresnel);
    // The reference's bundled stream has a bright, full core. Preserve that
    // difference without making either mode an opaque white cylinder.
    vec3 fullCore = mix(vec3(.6, .66, .67), vec3(.94), .45 + .45 * detail) * (.55 + diffuse * .65);
    vec3 color = mix(clearWater, fullCore, uBundle * .66 * facing);
    if (uHasBackdrop > .5) {
      vec3 viewNormal = normalize(mat3(viewMatrix) * n);
      vec2 screenUV = gl_FragCoord.xy / uResolution;
      // Short screen-space offset: approximate refraction, not ray-traced fluid optics.
      vec2 offset = viewNormal.xy * mix(2.0, 7.0, uBundle) / uResolution;
      offset *= .55 + .45 * detail;
      vec3 through = texture2D(uBackdrop, clamp(screenUV + offset, vec2(.001), vec2(.999))).rgb;
      vec3 wet = mix(through, reflected, .12 + .7 * fresnel);
      color = mix(wet, fullCore, uBundle * .38 * facing);
    }
    float endBreakup = mix(1.0, smoothstep(.12, .38, slow), smoothstep(.76, 1.0, vT));
    float start = smoothstep(0.0, .018, vT - uTail);
    float end = 1.0 - smoothstep(.82, 1.0, vT);
    float head = uHead > .999 ? 1.0 : 1.0 - smoothstep(uHead - .035, uHead, vT);
    float alpha = .15 + .64 * fresnel + .24 * smoothstep(.45, 1.5, luma) + uBundle * (.37 + detail * .12) * facing;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, .9) * start * end * head * endBreakup * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class WaterSpray {
  constructor({ origin, direction, jets, environment = null, environmentIntensity = 1 }) {
    this.group = new THREE.Group();
    this.group.layers.set(1);
    this.uniforms = { uTime: { value: 0 }, uHead: { value: 0 }, uTail: { value: 0 }, uFlow: { value: 1 } };
    this.materials = {};
    const defines = {};
    if (environment?.image?.height && environment?.image?.width) {
      Object.assign(defines, {
        WATER_ENVIRONMENT: 1, ENVMAP_TYPE_CUBE_UV: 1,
        CUBEUV_MAX_MIP: (Math.log2(environment.image.height) - 2).toFixed(1),
        CUBEUV_TEXEL_WIDTH: (1 / environment.image.width).toPrecision(12),
        CUBEUV_TEXEL_HEIGHT: (1 / environment.image.height).toPrecision(12),
      });
    }
    for (const mode of ['spray', 'stream']) {
      this.materials[mode] = new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG, defines,
        uniforms: { ...this.uniforms, uBackdrop: { value: null }, uResolution: { value: new THREE.Vector2(1,1) }, uHasBackdrop: { value: 0 }, uEnvironment: { value: environment }, uEnvironmentIntensity: { value: environmentIntensity }, uOpacity: { value: mode === 'spray' ? 1 : 0 }, uBundle: { value: mode === 'stream' ? 1 : 0 } },
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
      const radius = jet.bundled ? 0.0064 : 0.00086 + (i % 3) * 0.00007;
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, radius, 12, false);
      const count = g.attributes.position.count;
      const aT = new Float32Array(count);
      for (let v = 0; v < count; v++) aT[v] = Math.floor(v / 13) / 80;
      g.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
      const tangent = new Float32Array(count * 3);
      for (let v = 0; v < count; v++) g.tangents[Math.floor(v / 13)].toArray(tangent, v * 3);
      g.setAttribute('aTangent', new THREE.BufferAttribute(tangent, 3));
      g.setAttribute('aRadius', new THREE.BufferAttribute(new Float32Array(count).fill(radius), 1));
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
      const material = new THREE.MeshPhysicalMaterial({ color: '#F2F6F5', metalness: 0, roughness: .055, ior: 1.333,
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
  setBackdrop(texture, size) {
    for (const m of Object.values(this.materials)) {
      m.uniforms.uBackdrop.value = texture;
      m.uniforms.uResolution.value.copy(size);
      m.uniforms.uHasBackdrop.value = texture ? 1 : 0;
    }
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
        const clock = time * (2.8 + seed * .7) + seed;
        const cycle = Math.floor(clock);
        const variation = Math.sin(i * 91.13 + cycle * 17.71) * .5 + .5;
        const t = .76 + (clock - cycle) * .28;
        const scatter = (t - .76) * (d.mode === 'stream' ? .006 : .003);
        const angle = i * 2.399963 + variation * 1.8;
        this._dummy.position.copy(path.start).addScaledVector(path.outward, t * .22);
        this._dummy.position.y -= .062 * t * t;
        this._dummy.position.y += Math.sin(angle) * scatter;
        this._dummy.position.z += Math.cos(angle) * scatter;
        this._dropTangent.copy(path.outward).multiplyScalar(.22); this._dropTangent.y -= .124 * t;
        this._dummy.quaternion.setFromUnitVectors(this._dropUp, this._dropTangent.normalize());
        const visible = t <= this.uniforms.uHead.value && t >= this.uniforms.uTail.value;
        const fade = Math.min(1, Math.max(0, (1.04 - t) / .07));
        const radius = visible ? (.00032 + variation * .00048) * fade : 0;
        this._dummy.scale.set(radius, radius * (1.3 + variation * .8), radius);
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
    this._head = Math.min(1, (this._head || 0) + dt / 0.24);
    if (this.active) this._tail = 0;
    else {
      this._tail = Math.min(1, (this._tail || 0) + dt / 0.24);
      if (this._tail >= 1) { this.hide(); return true; }
    }
    this._apply(); this._updateDrops(); return true;
  }
}
