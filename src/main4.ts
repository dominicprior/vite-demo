console.log('dominic - main4.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, Mesh,
    RawShaderMaterial,
} from '../three/threebuild/three_module.js';
const container = document.querySelector('#scene-container');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({
    // antialias: true
});
container!.append(renderer.domElement);
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const groundGeometry = new PlaneGeometry(2, 2);

const groundMaterial = new RawShaderMaterial({  });

groundMaterial.vertexShader = /* glsl */ `
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
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
const ground = new Mesh(groundGeometry, groundMaterial);
scene.add(ground);
renderer.render(scene, camera);
