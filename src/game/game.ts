import {
    Scene, 
} from '../../three/threebuild/three_module.js';
import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Camera from './camera.js';

export default class Game {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    time: Time;
    scene: Scene;
    camera: Camera;
    constructor(canvas: (HTMLCanvasElement|null)) {
        Object.defineProperty(window, 'a', { value: { game: this },
            writable: true, });
        // window['a'].b = 3;
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new Scene();
        this.camera = new Camera(this);
        this.sizes.on('resize', this.resize.bind(this));  // Note the 'bind' to ensure 'this' refers to the Game instance instead of the Sizes instance.
        // this.sizes.on('resize', () => {  // This is an alternative way to bind 'this' using an arrow function.
        //     this.resize();
        // })
        this.time.on('tick', () => {
            this.update();
        })
    }

    resize() {
        console.log('resize!!!', this);
        this.camera.resize()
        // if (this.canvas) {
        //     this.canvas.width = this.sizes.width * this.sizes.pixelRatio;
        //     this.canvas.height = this.sizes.height * this.sizes.pixelRatio;
        //     this.canvas.style.width = `${this.sizes.width}px`;
        //     this.canvas.style.height = `${this.sizes.height}px`;
        // }
    }

    update() {
        // Update game logic here
    }
}

