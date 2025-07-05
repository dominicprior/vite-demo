import { createCamera } from './camera.js';
// import { createCube } from './components/cube.js';
// import { createSquare } from './components/square.js';
import { createDonut } from './donut.js';
import { createSunlight } from './sunlight.js';
import { createAmbientLight } from './ambient.js';
import { createScene } from './scene.js';
import { createControls } from './controls.js';
import { createRenderer } from './renderer.js';
import { Resizer } from './resizer.js';
import { Loop } from './loop.js';
import type { PerspectiveCamera, Scene } from '../../three/src/three_core.js';
import type { WebGLRenderer } from '../../three/src/Three.js';
import { createGround } from './ground.js';

import { createHexagon } from './hexagon.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let scene: Scene;
let loop: Loop;

class World {
    constructor(container: Element) {
        scene = createScene();
        renderer = createRenderer(container);
        camera = createCamera();
        const controls = createControls(camera, renderer.domElement);
        loop = new Loop(camera, scene, renderer);

        const donut = createDonut();
        const ground = createGround();
        const hexagon = createHexagon(10, 25);
        const ambient = createAmbientLight();
        const sunlight = createSunlight();
        // loop.updatables.push(mesh);
        // loop.updatables.push(camera);
        loop.updatables.push(controls);
        //   controls.addEventListener('change', () => {
        //     this.render();
        //  });
        // scene.add(mesh, createCube(),
        //     lights[0], lights[1]);
        scene.add(
            donut,
            ground, sunlight, ambient, hexagon
        );
        new Resizer(container, camera, renderer);
    }

    render() {
        renderer.render(scene, camera);
    }
    start() {
        loop.start();
    }

    stop() {
        loop.stop();
    }
}

export { World };
