console.log('dominic - main2.ts');
import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, MeshStandardMaterial, Mesh, DirectionalLight, BasicShadowMap,
} from '../three/threebuild/three_module.js';
const container = document.querySelector('#scene-container');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({ antialias: true });
container!.append(renderer.domElement);
const w = window.innerWidth;
const h = window.innerHeight;
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 0, 5);
camera.lookAt(0, 0, 0);

const sunlight = new DirectionalLight('white', 3);
sunlight.position.set(0, 0, 100);
sunlight.castShadow = true;
sunlight.shadow.camera.top = 1;
sunlight.shadow.camera.bottom = -1;
sunlight.shadow.camera.left = -1;
sunlight.shadow.camera.right = 1;
sunlight.shadow.camera.near = 1;
sunlight.shadow.camera.far = 1000;
sunlight.shadow.mapSize.width = 8;
sunlight.shadow.mapSize.height = 8;
sunlight.name = 'sunlight';

const groundGeometry = new PlaneGeometry(2, 2);
const groundMaterial = new MeshStandardMaterial({ color: 'pink', });
const ground = new Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.name = 'ground';

const shelfGeometry = new PlaneGeometry(1, 1);
const shelfMaterial = new MeshStandardMaterial({ color: 'yellow', });
shelfMaterial.shadowSide = 2; // DoubleSide for shadows
const shelf = new Mesh(shelfGeometry, shelfMaterial);
shelf.position.set(0, 0, 1);
shelf.rotation.z = -Math.PI / 4; // Rotate to be horizontal
shelf.castShadow = true;
shelf.name = 'shelf';

scene.add(ground, shelf, sunlight);
renderer.render(scene, camera);
