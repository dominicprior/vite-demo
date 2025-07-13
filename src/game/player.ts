import {
    Vector3,
} from '../../three/threebuild/three_module.js';

import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import Camera from './camera.js';
import World from './world/world.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

export default class Player {
    radius: number = 1;
    bearing: number = 0;  // radians from North (negative Z) round towards positive X.
    speed: number = 0;
    rotationSpeed: number = 3;  // in radians per second
    movementSpeed: number = 2.4;
    pos: Vector3 = new Vector3(0, 0.5, 6);
    keyboard: Keyboard;
    time: Time;
    camera: Camera;
    world: World;

    constructor(keyboard: Keyboard, time: Time, camera: Camera, world: World) {
        this.keyboard = keyboard;
        this.time = time;
        this.camera = camera;
        this.world = world;
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

            this.world.firstCollision(this);
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