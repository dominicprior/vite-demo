console.log('dominic - tri.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    // MeshBasicMaterial,
    Mesh, RawShaderMaterial,
    BufferGeometry, BufferAttribute, Float32BufferAttribute,
} from '../../three/threebuild/three_module.js';
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 0, 5);
camera.lookAt(0, 0, 0);

const geom = new BufferGeometry();

// ----- Three ways of setting the positions -----
geom.setAttribute('position', new BufferAttribute(new Float32Array([
    -1, -1, 0,    1, -1, 0,    1, 1, 0,]), 3));
geom.setAttribute('position', new Float32BufferAttribute([
    -1, -1, 0,    1, -1, 0,    1, 1, 0,], 3));
// The third way is to create a Float32Array directly:
// const f32a = new Float32Array(9);
// // ...set the elements using the [] notation
// geom.setAttribute('position', new BufferAttribute(f32a, 3))
// -----------------------------------------------

const groundMaterial = new RawShaderMaterial({  });

groundMaterial.vertexShader = /* glsl */ `
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
groundMaterial.fragmentShader = /* glsl */ `
precision mediump float;
varying vec2 vUv;
void main() {
    vec2 uv = vUv;
    gl_FragColor = vec4(uv, 1.0, 1.0);
}
`;

const ground = new Mesh(geom, groundMaterial);
const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(ground);
renderer.render(scene, camera);
