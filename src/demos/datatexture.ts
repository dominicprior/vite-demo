import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial,
    Mesh, DataTexture,
    PlaneGeometry, RGBAFormat, LinearFilter,
} from '../../three/threebuild/three_module.js';
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(90, w / h, 0.1, 100);
camera.position.set(0, 0, .25);
const geom = new PlaneGeometry();

const width = 1;
const height = 2;
const size = width * height;
const data = new Uint8Array( size * 4 );

// Fill with 2 colors (R, G, B, A)
data.set([
    55, 155, 255, 255, // pale sky blue
    0, 0, 255, 255,    // Blue
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
