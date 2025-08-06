import {
    Vector2,
    Vector3,
} from '../../three/threebuild/three_module.js';

import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import World from './world/world.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

export default class Player {

    // constants
    radius: number = 0.25;
    rotationSpeed: number = 1;  // in radians per second
    verticalSpeed: number = 1.2;  // for J and K
    gravity: number = 3;
    initialJumpSpeed = 2.5;
    power = 5;
    decayFactor = 0.2;

    // variables
    bearing: number = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(0, 0.6, 0);
    movementSpeed: number = 0;
    jumpTime: number = -100;       // when the last jump occurred.
    verticalVelocity = 0;

    keyboard: Keyboard;
    time: Time;
    world: World;

    constructor(keyboard: Keyboard, time: Time, world: World) {
        this.keyboard = keyboard;
        this.time = time;
        this.world = world;
        window.addEventListener('keydown', (event) => { 
            if (event.key === ' ') {
                this.verticalVelocity = this.initialJumpSpeed;
                this.jumpTime = this.time.elapsed;
            }
        });
    }

    velocity(): Vector2 {
        return this.forwardsDirection().multiplyScalar(this.movementSpeed);
    }

    forwardsDirection() {
        return new Vector2(-Math.sin(this.bearing), -Math.cos(this.bearing));
    }

    update() {
        this.updateTurning();
        this.updateUpDown();
        // this.updateMoving();
        this.updateStrafing();
        this.updateJumping();
    }

    // Pure(ish) function for calculating fwd/bk, strafing or turning.
    calcNewVelocity(dt: number, kbd: number, velocity: number, decay: number, power: number): number {

        if (kbd === 0) {  // coasting with decay
            return velocity * decay ** dt;
        }

        if (velocity === 0) {
            return kbd * Math.sqrt(power * dt);
        }

        if (kbd * velocity < 0) {
            return 0;
        }

        return kbd * Math.sqrt(velocity ** 2  +  power * dt);
    }

    updateTurning() {
        const turning = this.keyboard.turning();
        if (turning) {
            this.bearing += this.rotationSpeed * this.time.delta * turning;
        }
    }

    updateUpDown() {
        if (this.keyboard.pressed['KeyJ']) {
            this.pos.y += this.verticalSpeed * this.time.delta;
        }
        if (this.keyboard.pressed['KeyK']) {
            this.pos.y -= this.verticalSpeed * this.time.delta;
        }
    }

    updateStrafing() {
        const strafing = this.keyboard.strafing();
        if (strafing) {
            const distance = this.movementSpeed * this.time.delta * strafing;
            this.pos.x += distance * Math.cos(this.bearing);
            this.pos.z -= distance * Math.sin(this.bearing);
        }
    }

    updateJumping() {
        const totalJumpDuration = 2 * this.initialJumpSpeed / this.gravity;
        const jumpTimeSoFar = this.time.elapsed - this.jumpTime;
        if (jumpTimeSoFar < totalJumpDuration) {
            const delta = this.time.delta;
            const newVerticalVelocity = this.verticalVelocity - delta * this.gravity;
            this.pos.y += delta * (this.verticalVelocity + newVerticalVelocity) / 2;
            this.verticalVelocity = newVerticalVelocity;
        }
    }

    jumpAltitude(t: number) {  // not used
        return this.initialJumpSpeed * t - this.gravity * t * t / 2;
    }
}