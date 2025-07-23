import {
    Scene, Mesh,
} from '../../three/threebuild/three_module.js';
import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Camera from './camera.js';
import Renderer from './renderer.js';
import World from './world/world.js';
import Resources from './utils/resources.js';
import Debug from './utils/debug.js';
import Test from './utils/test.js';
import sources from './sources.js';
import Keyboard from './utils/keyboard.js';
import Player from './player.js';
import Stats from './utils/stats.js';

export default class Game {
    debug: Debug;
    test: Test;
    sizes: Sizes;
    time: Time;
    keyboard: Keyboard
    scene: Scene;
    resources: Resources;
    player: Player;
    camera: Camera;
    camera2: Camera;
    renderer: Renderer;
    renderer2: Renderer;
    stats: any;
    world: World;
    constructor(canvas: HTMLCanvasElement, fullScreen: boolean) {
        Object.defineProperty(window, 'a', { value: this,  writable: true, });
        const canvas2 = document.querySelector('canvas.webgl2') as HTMLCanvasElement;
        this.debug = new Debug();
        this.test = new Test();
        this.sizes = new Sizes(fullScreen, canvas);
        this.time = new Time();
        this.keyboard = new Keyboard();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this.sizes, this.scene, 1.0, 75);
        this.camera2 = new Camera(this.sizes, this.scene, 0.0, 120);
        this.renderer = new Renderer(canvas, this.sizes, this.scene, this.camera);
        this.renderer2 = new Renderer(canvas2, this.sizes, this.scene, this.camera2);
        this.world = new World(this.scene, this.resources, this.debug);  // Initialize the world after the camera and renderer.
        this.player = new Player(this.keyboard, this.time, this.camera, this.camera2, this.world);
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.sizes.on('resize', this.resize.bind(this));  // See note 1.
        this.time.on('tick', () => {
            this.stats.begin();
            this.update();
            this.stats.end();
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize();
        this.renderer2.resize();
    }

    update() {
        this.player.update();
        this.camera.update(this.player);
        this.camera2.update(this.player);
        this.world.update();
        this.renderer.update();
        this.renderer2.update();
    }

    destroy() {  // I'm not sure if this is right, but it's interesting anyway.
        this.sizes.off('resize');
        this.time.off('tick');
        this.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });
        this.renderer.instance.dispose();
        this.debug.gui.destroy();
    }
}

// Note 1:
// The 'bind' ensures 'this' refers to the Game instance instead of the Sizes instance.
// The alternative is:
//     this.sizes.on('resize', () => {  // This is an alternative way to bind 'this' using an arrow function.
//         this.resize();
//     })
