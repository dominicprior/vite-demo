// A shadow demo, including a shadow autoUpdate of false.

// For simplicity, the sunlight is directly overhead.
// The two planes (the ground and the shelf) are rotated to be at
// an angle to demonstrate the shadow granularity.

// Turning on the shelf's receiveShadow property (in addition to
// the castShadow property) causes some stippling unless we introduce
// a small bias.

// The shelf's shadowSide has to be set to DoubleSide (or the material
// itself has to be DoubleSide, or, weirdly, the shelf has to be upside down).

import {
    Scene, Color, PerspectiveCamera, DoubleSide, WebGLRenderer,
    PlaneGeometry, MeshStandardMaterial, Mesh, DirectionalLight,
    // BasicShadowMap,
    PCFSoftShadowMap,
} from '../three/threebuild/three_module.js';

const w = window.innerWidth;
const h = window.innerHeight;
const container = document.querySelector('#scene-container');
const scene = new Scene();
scene.background = new Color('skyblue');
const renderer = new WebGLRenderer({ antialias: true });
container!.append(renderer.domElement);
renderer.setSize(w, h);

renderer.shadowMap.enabled = true;
renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.type = BasicShadowMap;
renderer.shadowMap.type = PCFSoftShadowMap;

const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 0, 5);
camera.lookAt(0, 0, 0);
camera.name = 'perspective-camera';

const sunlight = new DirectionalLight('white', 3);
sunlight.position.set(0, 0, 100);
sunlight.castShadow = true;
sunlight.shadow.camera.top    =  1;
sunlight.shadow.camera.bottom = -1;
sunlight.shadow.camera.left   = -1;
sunlight.shadow.camera.right  =  1;
sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 500;
sunlight.shadow.mapSize.width  = 64;
sunlight.shadow.mapSize.height = 64;
sunlight.shadow.bias = -0.002;
sunlight.shadow.intensity = 0.5;
sunlight.name = 'sunlight';
sunlight.shadow.camera.name = 'sunlight-shadow-camera';

const groundGeometry = new PlaneGeometry(2, 2);
const groundMaterial = new MeshStandardMaterial({ color: 'pink', });
const ground = new Mesh(groundGeometry, groundMaterial);
ground.rotation.z = -Math.PI / 4;
// ground.castShadow = true;
ground.receiveShadow = true;
ground.name = 'ground';

const shelfGeometry = new PlaneGeometry(1, 1);
const shelfMaterial = new MeshStandardMaterial({ color: 'yellow', });
shelfMaterial.shadowSide = DoubleSide;
// shelfMaterial.side = DoubleSide;
// shelfMaterial.transparent = true;
// shelfMaterial.opacity = 0.5;
const shelf = new Mesh(shelfGeometry, shelfMaterial);
shelf.position.set(0, 0, 1);
shelf.rotation.z = -Math.PI / 4;
shelf.castShadow = true;
// shelf.receiveShadow = true;
shelf.name = 'shelf';

scene.add(shelf, ground, sunlight);

renderer.shadowMap.needsUpdate = true;
renderer.render(scene, camera);
// debugger;

camera.position.set(6, 0, 4);
camera.lookAt(0, 0, 0);
renderer.render(scene, camera);
