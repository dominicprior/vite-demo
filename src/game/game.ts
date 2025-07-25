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
    renderer: Renderer;
    stats: any;
    world: World;
    ready: boolean = false;
    doneARender: boolean = false;
    stopAfterOneRender: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        Object.defineProperty(window, 'a', { value: this,  writable: true, });
        Object.defineProperty(window, 'pr', { value: console.log,  writable: true, });
        this.debug = new Debug();
        this.test = new Test();
        this.sizes = new Sizes();
        this.time = new Time();
        this.keyboard = new Keyboard();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this.sizes, 1.0, 75);
        this.world = new World(this.scene, this.resources, this.debug);
        this.player = new Player(this.keyboard, this.time, this.camera, this.world);
        this.renderer = new Renderer(canvas, this.sizes, this.scene, this.camera);
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.sizes.on('resize', this.resize.bind(this));  // See note 1.
        this.time.on('tick', () => {
            if (this.ready) {
                if (this.doneARender && this.stopAfterOneRender) {
                    // we're not animating any more
                }
                else {
                    this.stats.begin();
                    this.update();
                    this.stats.end();
                    this.doneARender = true;
                }
            }
        });
        this.resources.on('ready', () => {
            this.ready = true;
        });
    }

    resize() {
        this.camera.resize()
        this.renderer.resize();
    }

    update() {
        this.player.update();
        this.camera.update(this.player);
        this.world.update(this.player);
        this.renderer.update();
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
