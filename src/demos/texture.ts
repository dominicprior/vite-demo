// A texture.
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer, LoadingManager,
    PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, SRGBColorSpace,
    // RepeatWrapping,
    // MirroredRepeatWrapping,
    NearestFilter,
} from '../../three/threebuild/three_module.js';
const container = document.querySelector('canvas.webgl');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
const loadingManager = new LoadingManager();
loadingManager.onStart = () => {
    console.log('Loading started');
};
loadingManager.onLoad = () => {
    console.log('Loading complete');
    renderer.render(scene, camera);
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loading file: ${url}, items loaded: ${itemsLoaded}, total items: ${itemsTotal}`);
};
loadingManager.onError = (url) => {
    console.error(`Error loading file: ${url}`);
};
const textureLoader = new TextureLoader(loadingManager);
const texture  = textureLoader.load('uv-test-col.png');
                 textureLoader.load('uv-test-bw.png');
texture.colorSpace = SRGBColorSpace;
// texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
texture.repeat.set(.05, .05);
texture.minFilter = texture.magFilter = NearestFilter;
// texture.offset.set(0.5, 0.5);
texture.rotation = Math.PI / 14;
texture.center.set(0.05, 0.05);

const groundGeometry = new PlaneGeometry(2, 2);
// let uvArray = groundGeometry.attributes.uv.array;
// for (let i = 0; i < 8; i++) {
//     uvArray[i] *= 2;
// }
const groundMaterial = new MeshBasicMaterial({ map: texture, });
const ground = new Mesh(groundGeometry, groundMaterial);
scene.add(ground);
setTimeout(() => {
    // renderer.render(scene, camera);
}, 500);
// const animate = () => {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// };
// animate();
// console.log('dominic - main2.ts done', texture2);
