import {
    PerspectiveCamera,
    Scene, Vector3,
} from '../../three/threebuild/three_module.js';

import Game from './game.js';
import Sizes from "./utils/sizes.js";
import Keyboard from './utils/keyboard.js';

var _dummy = new Vector3();

export default class Camera {
    game: Game;
    sizes: Sizes;
    keyboard: Keyboard;
    scene: Scene;
    canvas: HTMLCanvasElement | null;
    // @ts-ignore: no initializer
    instance: PerspectiveCamera;

    constructor(game: Game) {
        this.game = game;
        this.sizes = game.sizes;
        this.keyboard = game.keyboard;
        this.scene = game.scene;
        this.canvas = game.canvas;
        this.setInstance();
    }

    setInstance() {
        this.instance = new PerspectiveCamera(
                75, this.sizes.width / this.sizes.height, 0.05, 100);
        this.instance.position.set(0, 0.5, 6);
        this.scene.add(this.instance);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        const turning = this.keyboard.turning();
        if (turning) {
            this.instance.rotateY(0.05 * turning);
        }

        const moving = this.keyboard.moving();
        if (moving) {
            const fwd = this.instance.getWorldDirection(_dummy);
            this.instance.position.add(fwd.clone().multiplyScalar(0.04 * moving));
        }
    }
}
