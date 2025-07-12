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

export default class Game {
    canvas: HTMLCanvasElement;
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
    world: World;
    constructor(canvas: HTMLCanvasElement) {
        Object.defineProperty(window, 'a', { value: this,  writable: true, });
        this.canvas = canvas;
        this.debug = new Debug();
        this.test = new Test();
        this.sizes = new Sizes();
        this.time = new Time();
        this.keyboard = new Keyboard();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this.sizes, this.scene);
        this.player = new Player(this.keyboard, this.time, this.camera);
        this.renderer = new Renderer(this.canvas, this.sizes, this.scene, this.camera);
        this.world = new World(this);  // Initialize the world after the camera and renderer.
        this.sizes.on('resize', this.resize.bind(this));  // Note the 'bind' to ensure 'this' refers to the Game instance instead of the Sizes instance.
        // this.sizes.on('resize', () => {  // This is an alternative way to bind 'this' using an arrow function.
        //     this.resize();
        // })
        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize();
    }

    update() {
        this.player.update();
        this.camera.update(this.player);
        this.world.update();
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

