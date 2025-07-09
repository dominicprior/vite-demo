import {
    PerspectiveCamera,
    Scene, Vector3,
} from '../../three/threebuild/three_module.js';

import Game from './game.js';
import Sizes from "./utils/sizes.js";
import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js'

var _dummy = new Vector3();
const upVec = new Vector3(0, 1, 0);

export default class Camera {
    game: Game;
    sizes: Sizes;
    keyboard: Keyboard;
    time: Time;
    scene: Scene;
    rotationSpeed: number = 3;  // in radians per second
    movementSpeed: number = 2.4;
    canvas: HTMLCanvasElement | null;
    // @ts-ignore: no initializer
    instance: PerspectiveCamera;

    constructor(game: Game) {
        this.game = game;
        this.sizes = game.sizes;
        this.keyboard = game.keyboard;
        this.time = game.time;
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
        const delta = this.time.delta / 1000;

        const turning = this.keyboard.turning();
        if (turning) {
            this.instance.rotateY(this.rotationSpeed * delta * turning);
        }

        const moving = this.keyboard.moving();
        if (moving) {
            const fwd = this.instance.getWorldDirection(_dummy);
            this.instance.position.add(fwd.clone().multiplyScalar(
                this.movementSpeed * delta * moving));
        }

        const strafing = this.keyboard.strafing();
        if (strafing) {
            const fwd = this.instance.getWorldDirection(_dummy).clone().cross(upVec);
            this.instance.position.add(fwd.multiplyScalar(
                this.movementSpeed * delta * strafing));
        }
    }
}
