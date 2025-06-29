console.log('dominic - tri.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial, Mesh,
    BufferGeometry, BufferAttribute,
} from '../three/threebuild/three_module.js';
const container = document.querySelector('#scene-container');
const renderer = new WebGLRenderer({ antialias: true });
container!.append(renderer.domElement);
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 0, 5);
camera.lookAt(0, 0, 0);

// ----------------------

const geom = new BufferGeometry();
geom.setAttribute('position', new BufferAttribute(new Float32Array([
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
]), 3));

// ----------------------

const groundMaterial = new MeshBasicMaterial({ color: 'pink', });
const ground = new Mesh(geom, groundMaterial);

const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(ground);
renderer.render(scene, camera);
