import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";

export default class Game {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    time: Time;
    constructor(canvas: (HTMLCanvasElement|null)) {
        Object.defineProperty(window, 'a', { value: { game: this },
            writable: true, });
        // window['a'].b = 3;
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.sizes.on('resize', this.resize.bind(this));  // Note the 'bind' to ensure 'this' refers to the Game instance instead of the Sizes instance.
        // this.sizes.on('resize', () => {  // This is an alternative way to bind 'this' using an arrow function.
        //     this.resize();
        // })
        this.time.on('tick', () => {
            console.log('tick', this.time.delta);
            this.update();
        })
    }

    resize() {
        console.log('resize!!!', this);
        // if (this.canvas) {
        //     this.canvas.width = this.sizes.width * this.sizes.pixelRatio;
        //     this.canvas.height = this.sizes.height * this.sizes.pixelRatio;
        //     this.canvas.style.width = `${this.sizes.width}px`;
        //     this.canvas.style.height = `${this.sizes.height}px`;
        // }
    }

    update() {
        console.log('update!!!', this);
        // Update game logic here
    }
}

