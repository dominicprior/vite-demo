import Game from '../game.js';

export default class Time {
    game: Game;
    start: number;
    current: number;
    elapsed: number;
    delta: number;

    constructor(game: Game) {
        this.game = game;
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
        this.game.respondToTick();

        requestAnimationFrame(() => {
            this.tick();
        });
    }
}