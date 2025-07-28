import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial,
    Mesh, 
    BoxGeometry,
} from '../../three/threebuild/three_module.js';
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 0.1, 100);
camera.position.set(0, 0, 2);
const geom = new BoxGeometry();
const Material = new MeshBasicMaterial({ color: 'pink', });

const cube = new Mesh(geom, Material);
const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(cube);
renderer.render(scene, camera);
