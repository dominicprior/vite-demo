import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial,
    Mesh, DataTexture,
    BoxGeometry, RGBAFormat, LinearFilter,
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

const width = 2;
const height = 2;
const size = width * height;
const data = new Uint8Array( size * 4 );

// Fill with 4 colors (R, G, B, White)
data.set([
    255, 0, 0, 255,    // Red
    0, 255, 0, 255,    // Green
    0, 0, 255, 255,    // Blue
    255, 255, 255, 255, // White
]);

const texture = new DataTexture(data, width, height, RGBAFormat);
texture.magFilter = LinearFilter;
texture.needsUpdate = true;

const material = new MeshBasicMaterial({ map: texture, });

const cube = new Mesh(geom, material);
const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(cube);
renderer.render(scene, camera);
