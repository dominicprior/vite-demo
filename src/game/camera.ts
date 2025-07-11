import {
    PerspectiveCamera,
    Scene, Vector2, Vector3,
} from '../../three/threebuild/three_module.js';

import Game from './game.js';
import Sizes from "./utils/sizes.js";
import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js'
import HorizontalBox from './collisions/horizontalbox.js';

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

    setInstance() {  // --- camera ---
                     // One day, we will want to merge in fisheye stuff.
        this.instance = new PerspectiveCamera(
                75, this.sizes.width / this.sizes.height, 0.05, 100);
        this.instance.position.set(0, 0.5, 6);
        this.scene.add(this.instance);
    }

    resize() {  // --- camera ---
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {  // --- player pos etc. ---
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

            if (0) {  ////////// Think about plugging collisions into the player movements.
                      ////////// Separate player-state (speed, dir, pos) from camera things like FoV.
                const box = new HorizontalBox(new Vector2(), 1, 1, 0);
                const pos = this.instance.position;
                const angle = this.instance.rotation.y;
                const player = {
                    pos: new Vector2(pos.x, pos.z),
                    radius: 1,
                    velocity: new Vector2(Math.cos(angle), Math.sin(angle))
                        .multiplyScalar(this.movementSpeed)
                };
                const collision = box.firstCollision(player);
                console.log(collision);
                debugger;
            }

        }

        const strafing = this.keyboard.strafing();
        if (strafing) {
            const fwd = this.instance.getWorldDirection(_dummy).clone().cross(upVec);
            this.instance.position.add(fwd.multiplyScalar(
                this.movementSpeed * delta * strafing));
        }
    }
}
