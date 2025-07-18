import EventEmitter from "./eventemitter.js";

export default class Sizes extends EventEmitter {
    width: number;
    height: number;
    pixelRatio: number;

    constructor(fullScreen: boolean, canvas: HTMLCanvasElement) {
        super();
        if (fullScreen) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            window.addEventListener('resize', () => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.pixelRatio = Math.min(window.devicePixelRatio, 2);
                this.trigger('resize');
            });
        }
        else {
            this.width = canvas.width;
            this.height = canvas.height;
        }
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}
