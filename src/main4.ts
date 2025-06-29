console.log('dominic - main4.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, Mesh,
    RawShaderMaterial,
} from '../three/threebuild/three_module.js';
import vert from './vertex.glsl';
import frag from './fragment.glsl';
console.log(vert, frag);
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

groundMaterial.vertexShader = vert;
groundMaterial.fragmentShader = frag;

const ground = new Mesh(groundGeometry, groundMaterial);
scene.add(ground);
renderer.render(scene, camera);
