console.log('dominic - main2.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, SRGBColorSpace,
} from '../three/threebuild/three_module.js';
const container = document.querySelector('#scene-container');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({ antialias: true });
container!.append(renderer.domElement);
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
const textureLoader = new TextureLoader();
const texture = await textureLoader.loadAsync('/assets/uv-test-col.png');
texture.colorSpace = SRGBColorSpace;
const groundGeometry = new PlaneGeometry(2, 2);
const groundMaterial = new MeshBasicMaterial({ map: texture, });
const ground = new Mesh(groundGeometry, groundMaterial);
scene.add(ground);
setTimeout(() => {
    renderer.render(scene, camera);
}, 1);
// const animate = () => {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// };
// animate();
console.log('dominic - main2.ts done');
