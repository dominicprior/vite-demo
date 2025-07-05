import {
    Scene, 
} from '../../three/threebuild/three_module.js';
import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Camera from './camera.js';
import Renderer from './renderer.js';
import World from './world/world.js';
import Resources from './utils/resources.js';
import sources from './sources.js';

export default class Game {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    time: Time;
    scene: Scene;
    resources: Resources;
    camera: Camera;
    renderer: Renderer;
    world: World;
    constructor(canvas: (HTMLCanvasElement|null)) {
        Object.defineProperty(window, 'a', { value: { game: this },
            writable: true, });
        // window['a'].b = 3;
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
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
        this.renderer.resize();}

    update() {
        this.camera.update();
        this.renderer.update();
    }
}

