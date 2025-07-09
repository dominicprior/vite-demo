import {
    PerspectiveCamera,
    Scene, 
} from '../../three/threebuild/three_module.js';

import Game from './game.js';
import Sizes from "./utils/sizes.js";
import Keyboard from './utils/keyboard.js';

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
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        if (this.keyboard.turningLeft()) {
            this.instance.rotateY(0.02);
        }
        if (this.keyboard.turningRight()) {
            this.instance.rotateY(-0.02);
        }
    }
}
