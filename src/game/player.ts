import {
    Vector3,
} from '../../three/threebuild/three_module.js';

import Game from './game.js';
import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import Camera from './camera.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

export default class Player {
    game: Game;
    keyboard: Keyboard;
    time: Time;
    camera: Camera;
    rotationSpeed: number = 3;  // in radians per second
    movementSpeed: number = 2.4;
    pos: Vector3 = new Vector3(0, 0.5, 6);
    radius: number = 1;
    bearing: number = 0;  // radians from North (negative Z) round towards positive X.
    speed: number = 0;

    constructor(game: Game) {
        this.game = game;
        this.keyboard = game.keyboard;
        this.time = game.time;
        this.camera = game.camera;
    }

    update() {
        const delta = this.time.delta / 1000;

        const turning = this.keyboard.turning();
        if (turning) {
            this.bearing += this.rotationSpeed * delta * turning;
        }

        const moving = this.keyboard.moving();
        if (moving) {
            const distance = this.movementSpeed * delta * moving;
            this.pos.x -= distance * Math.sin(this.bearing);
            this.pos.z -= distance * Math.cos(this.bearing);

            // if (0) {  ////////// Think about plugging collisions into the player movements.
            //           ////////// Separate player-state (speed, dir, pos) from camera things like FoV.
            //     const box = new HorizontalBox(new Vector2(), 1, 1, 0);
            //     const pos = this.instance.position;
            //     const angle = this.instance.rotation.y;
            //     const player = {
            //         pos: new Vector2(pos.x, pos.z),
            //         radius: 1,
            //         velocity: new Vector2(Math.cos(angle), Math.sin(angle))
            //             .multiplyScalar(this.movementSpeed)
            //     };
            //     const collision = box.firstCollision(player);
            //     console.log(collision);
            //     debugger;
            // }

        }

        const strafing = this.keyboard.strafing();
        if (strafing) {
            const distance = this.movementSpeed * delta * strafing;
            this.pos.x += distance * Math.cos(this.bearing);
            this.pos.z -= distance * Math.sin(this.bearing);
        }

        if (turning || moving || strafing) {
            this.camera.update(this);
        }
    }

}