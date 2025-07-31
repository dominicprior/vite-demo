// applyQuaternion and rotateOnAxis chain their rotations onto the current rotation.

// setRotationFromAxisAngle, on the other hand, sets the rotation.

// applyQuaternion and rotateOnWorldAxis are similar.

// rotateX is just shorthand for rotateOnAxis about the x-axis.

// rotateX then rotateY agrees with an Euler order 'XYZ'.

import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    MeshBasicMaterial,
    Mesh, Quaternion,
    BoxGeometry,
    Vector3,
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
// camera.position.set(0, 0, 2);

//pr(camera.matrix);
// pr(camera.matrixWorld);
// pr(camera.modelViewMatrix);
// pr(camera.quaternion);
// pr(camera.rotation);
const θ = 0.2;
const s = Math.sin(θ/2);
const cc = Math.cos(θ/2);

camera.applyQuaternion(new Quaternion(0, 0, s, cc));
// pr(camera.quaternion);
// pr(camera.rotation);
camera.applyQuaternion(new Quaternion(0, 0, s, cc));
// pr(camera.quaternion);
// pr(camera.rotation);
camera.rotateOnWorldAxis(new Vector3(0,0,1), -0.4);  // to get back to where we were
// pr(camera.quaternion);
pr(camera.rotation);
pr('---');

camera.rotateOnAxis(new Vector3(1,0,0), 0.2);
camera.rotateOnAxis(new Vector3(0,1,0), 0.2);
// pr(camera.rotation);
pr(camera.rotation);
camera.rotateY(-0.2);
camera.rotateX(-0.2);
pr(camera.rotation);  // back to where we were
pr('---');

camera.applyQuaternion(new Quaternion(0, s, 0, cc));
camera.applyQuaternion(new Quaternion(s, 0, 0, cc));
camera.rotateY(-0.2);
camera.rotateX(-0.2);
pr(camera.rotation);  // back to where we were
pr('---');


camera.rotateOnWorldAxis(new Vector3(1,0,0), 0.2);
camera.rotateOnWorldAxis(new Vector3(0,1,0), 0.2);
// pr(camera.rotation);
// pr(camera.rotation);
camera.rotateX(-0.2);  // note the reverse order
camera.rotateY(-0.2);
pr(camera.rotation);  // back to where we were
pr('---');




// camera.setRotationFromAxisAngle(new Vector3(1,0,0), 0.3);
// camera.setRotationFromAxisAngle(new Vector3(1,0,0), 0.3);
// pr(camera.rotation);
// pr('---');



const geom = new BoxGeometry().translate(0,0,-2);
const Material = new MeshBasicMaterial({ color: 'pink', });

const cube = new Mesh(geom, Material);
const scene = new Scene();
scene.background = new Color('skyblue');
scene.add(cube);
renderer.render(scene, camera);
