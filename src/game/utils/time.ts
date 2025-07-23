import EventEmitter from "./eventemitter.js";

export default class Time extends EventEmitter {
    start: number;
    current: number;
    elapsed: number;
    delta: number;

    constructor() {
        super();
        this.start = Date.now() / 1000;
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 0.016;

        requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now() / 1000;
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;
        this.trigger('tick');

        requestAnimationFrame(() => {
            this.tick();
        });
    }
}