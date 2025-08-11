import Game from '../game.js';

export default class Sizes {
    width: number;
    height: number;
    pixelRatio: number;
    game: Game;

    constructor(game: Game) {
        this.game = game;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.game.respondToResize();
        });
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}
