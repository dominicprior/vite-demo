// Some shaders.
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, Mesh,
    ShaderMaterial, TextureLoader,
} from '../../three/threebuild/three_module.js';
// @ts-ignore
import vert from './vertex.glsl';
// @ts-ignore
import frag from './fragment.glsl';
const container = document.querySelector('canvas.webgl');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({
    // antialias: true
    canvas: container!,
});
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
const camera = new PerspectiveCamera(45, w / h, 5.5, 10);
camera.position.set(2, 3, 5);
camera.lookAt(0, 0, 0);

const groundGeometry = new PlaneGeometry(2, 2);

const groundMaterial = new ShaderMaterial({  });

const textureLoader = new TextureLoader();
const uTexture = await textureLoader.loadAsync('uv-test-col.png');

groundMaterial.vertexShader = vert;
groundMaterial.fragmentShader = frag;
groundMaterial.uniforms = {
    uBlue: { value: 0.5 },
    uColor: { value: new Color('orange') },  // not used
    uTexture: { value: uTexture },
    uTime: { value: 0 },  // for animation, not used yet
};

const ground = new Mesh(groundGeometry, groundMaterial);
scene.add(ground);
renderer.render(scene, camera);

// import { Clock } from '../three/threebuild/three_module.js';
// const clock = new Clock();
// const t = clock.getElapsedTime();  // in a tick function
// groundMaterial.uniforms.time.value = t;  // set the time uniform
