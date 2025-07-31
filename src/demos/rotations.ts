import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial,
    Mesh, Quaternion,
    BoxGeometry,
} from '../../three/threebuild/three_module.js';
const pr = console.log;
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 0.1, 100);
// @ts-ignore
window.c = camera;
camera.position.set(0, 0, 2);
pr(camera.matrix);
// pr(camera.matrixWorld);
// pr(camera.modelViewMatrix);
pr(camera.quaternion);
pr(camera.rotation);
const θ = 0.1;
const s = Math.sin(θ/2);
const cc = Math.cos(θ/2);
camera.applyQuaternion(new Quaternion(0, 0, s, cc));
pr(camera.quaternion);
pr(camera.rotation);
camera.applyQuaternion(new Quaternion(0, 0, s, cc));
pr(camera.quaternion);
pr(camera.rotation);
const geom = new BoxGeometry();
const Material = new MeshBasicMaterial({ color: 'pink', });

const cube = new Mesh(geom, Material);
const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(cube);
renderer.render(scene, camera);
