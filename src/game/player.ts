import {
    Vector2,
    Vector3,
} from '../../three/threebuild/three_module.js';

import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import World from './world/world.js';
import type { Collision } from './utils/types.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

export default class Player {

    // constants
    radius: number = 0.25;
    rotationSpeed: number = 1;  // in radians per second
    movementSpeed: number = 2.4;
    collisionDuration: number = 0.3;
    bounceFactor: number = 0.7;
    verticalSpeed: number = 1.2;

    // variables
    bearing: number = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(0, 3.5, 4.5);
    collisionTime: number = -100;  // when the last collision occurred.
    bounceVelocity: Vector2 = new Vector2();

    keyboard: Keyboard;
    time: Time;
    world: World;

    constructor(keyboard: Keyboard, time: Time, world: World) {
        this.keyboard = keyboard;
        this.time = time;
        this.world = world;
    }

    velocity(): Vector2 {
        return this.forwardsDirection().multiplyScalar(this.movementSpeed);
    }

    forwardsDirection() {
        return new Vector2(-Math.sin(this.bearing), -Math.cos(this.bearing));
    }

    update() {
        const delta = this.time.delta;
        const bouncing = this.time.elapsed < this.collisionTime + this.collisionDuration;

        this.updateTurning();
        this.updateUpDown();
        if (bouncing) {
            // bouncing, ignore movement keys
            this.pos.x += this.bounceVelocity.x * delta;
            this.pos.z += this.bounceVelocity.y * delta;
        }
        else {
            this.updateMoving();
            this.updateStrafing();
        }
    }

    updateMoving() {
        const delta = this.time.delta;
        const moving = this.keyboard.moving();
        if (moving) {
            const collision = this.world.firstCollision(this);
            if (collision.t < delta) {
                this.collide(collision);
            }
            else {
                const velocity = this.velocity();
                this.pos.x += delta * moving * velocity.x;
                this.pos.z += delta * moving * velocity.y;
            }
        }
    }

    collide(collision: Collision) {
        const skid = collision.skidVelocity;
        this.bounceVelocity = skid.clone()  // (skid - v) * bounceFactor  +  skid
                .sub(this.velocity())
                .multiplyScalar(this.bounceFactor)
                .add(skid);
        const newPos = this.bounceVelocity.clone()  // bounceVelocity * "the remaining time" + collision.pos
                .multiplyScalar(this.time.delta - collision.t)
                .add(collision.pos);
        this.pos.x = newPos.x;
        this.pos.z = newPos.y;
        this.collisionTime = this.time.elapsed;  // ? plus spare time?
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
}