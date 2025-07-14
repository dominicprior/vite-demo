import {
    Vector2,
    Vector3,
} from '../../three/threebuild/three_module.js';

import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import Camera from './camera.js';
import World from './world/world.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

export default class Player {

    // constants
    radius: number = 0.25;
    rotationSpeed: number = 3;  // in radians per second
    movementSpeed: number = 2.4;
    collisionDuration: number = 0.25;

    // variables
    bearing: number = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(0, 0.5, 6);
    collisionTime: number = -100;  // when the last collision occurred.
    bounceVelocity: Vector2 = new Vector2();

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

    velocity() {
        return new Vector2(-Math.sin(this.bearing), -Math.cos(this.bearing))
                    .multiplyScalar(this.movementSpeed);
    }

    update() {
        const delta = this.time.delta;
        const turning = this.keyboard.turning();
        const moving = this.keyboard.moving();
        const strafing = this.keyboard.strafing();
        const bouncing = this.time.elapsed < this.collisionTime + this.collisionDuration;

        if (turning) {
            this.bearing += this.rotationSpeed * delta * turning;
        }

        if (bouncing) {
            // bouncing, ignore movement keys
            this.pos.x += this.bounceVelocity.x * delta;
            this.pos.z += this.bounceVelocity.y * delta;
        }
        else {

            if (moving) {
                const collision = this.world.firstCollision(this);
                if (collision.t < delta) {
                    this.bounceVelocity = collision.newVelocity.clone()
                            .multiplyScalar(2)
                            .sub(this.velocity());
                    const newPos = this.bounceVelocity.clone()
                            .multiplyScalar(delta - collision.t)
                            .add(collision.pos);
                    this.pos.x = newPos.x;
                    this.pos.z = newPos.y;
                    this.collisionTime = this.time.elapsed;  // ? plus spare time?
                }
                else {
                    const velocity = this.velocity();
                    this.pos.x += delta * moving * velocity.x;
                    this.pos.z += delta * moving * velocity.y;
                }
            }

            if (strafing) {
                const distance = this.movementSpeed * delta * strafing;
                this.pos.x += distance * Math.cos(this.bearing);
                this.pos.z -= distance * Math.sin(this.bearing);
            }
        }

        if (turning || moving || strafing || bouncing) {
            this.camera.update(this);
        }
    }

}