import { createCamera } from './systems/camera.js';
// import { createCube } from './components/cube.js';
// import { createSquare } from './components/square.js';
import { createSquare2 } from './components/square2.js';
import { createSunlight } from './systems/sunlight.js';
import { createAmbientLight } from './systems/ambient.js';
import { createScene } from './scene.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/resizer.js';
import { Loop } from './systems/loop.js';
import type { PerspectiveCamera, Scene } from '../three/src/three_core.js';
import type { WebGLRenderer } from '../three/src/Three.js';
// import { createHexagon } from './components/hexagon.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let scene: Scene;
let loop: Loop;

class World {
    constructor(container: Element) {
        scene = createScene();
        renderer = createRenderer();
        camera = createCamera();
        const controls = createControls(camera, renderer.domElement);
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        const mesh = createSquare2();
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
        scene.add(mesh, sunlight, ambient);
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
