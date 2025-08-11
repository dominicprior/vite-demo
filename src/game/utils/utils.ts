import Debug from './debug.js';
import Game from '../game.js';
import Keyboard from './keyboard.js';
import Sizes from "./sizes.js";
import Time from "./time.js";

export default class Utils {
    debug: Debug;
    game: Game;
    keyboard: Keyboard;
    sizes: Sizes;
    time: Time;
    constructor(debug: Debug, game: Game, keyboard: Keyboard, sizes: Sizes, time: Time) {
        this.debug = debug;
        this.game = game;
        this.keyboard = keyboard;
        this.sizes = sizes;
        this.time = time;
    }
}
