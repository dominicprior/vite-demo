// Player position and movement

import {
    Euler,
    Vector3,
} from '../../three/threebuild/three_module.js';

import Keyboard from './utils/keyboard.js';
import Time from './utils/time.js';
import World from './world/world.js';
import Brep from './brep.js';

// var _dummy = new Vector3();
// const upVec = new Vector3(0, 1, 0);

// Pure function for calculating the signed speed for fwd/bk, strafing or turning.
function calcNewSpeed(dt: number, kbd: number, speed: number, decay: number, power: number): number {

    if (kbd === 0) {  // coasting with decay.
        return speed * decay ** dt;
    }
    if (speed === 0) {
        return kbd * Math.sqrt(power * dt);
    }
    if (kbd * speed < 0) {  // zap the speed when the player reverses direction.
        return 0;
    }
    return kbd * Math.sqrt(speed ** 2  +  power * dt);
}


export default class Player {

    // constants
    radius = 0.25;
    minDist = 0.1;
    bounceStiffness = 1;
    collisionDrag = 0;

    rotationSpeed = 1;  // in radians per second
    verticalSpeed = 1.2;  // for J and K
    gravity = 3;
    initialJumpSpeed = 2.5;
    power = 5;
    decayFactor = 1;   // 0.2;  // set this to zero for immediate stopping.
    catchUpFactor = 0;  // for trueVelocity catching up with intendedVelocity.

    // variables
    bearing = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(2, 0.6, -3);
    fwdBkSpeed  = 0;  // These two speeds give the user's intended velocity.
    strafeSpeed = 0;
    trueVelocity = new Vector3;  // This is the velocity accounting for walls.
    jumpTime = -100;       // when the last jump occurred.
    verticalVelocity = 0;

    keyboard: Keyboard;
    time: Time;
    world: World;

    constructor(keyboard: Keyboard, time: Time, world: World) {
        this.keyboard = keyboard;
        this.time = time;
        this.world = world;
        if (typeof(window) === 'undefined') {
            // Running inside Vitest, not inside a browser.
        }
        else {
            window.addEventListener('keydown', (event) => { 
                if (event.key === ' ') {
                    this.verticalVelocity = this.initialJumpSpeed;
                    this.jumpTime = this.time.elapsed;
                }
            });
            window.addEventListener('keydown', (event) => { 
                if (event.key === 'z') {
                    this.fwdBkSpeed = 0;
                    this.strafeSpeed = 0;
                    this.trueVelocity = new Vector3;
                }
            });
            window.addEventListener('keydown', (event) => { 
                if (event.key === 'c') {
                    this.fwdBkSpeed = 0;
                    this.strafeSpeed = 0;
                    this.trueVelocity = new Vector3;
                    this.pos = new Vector3(0, 0.6, 0);
                }
            });
            window.addEventListener('keydown', (event) => { 
                if (event.key === 's') {
                    a.stop();
                }
            });
        }
    }

    forwardsDirection() {
        return new Vector3(0, 0, -1).
            applyEuler(new Euler(0, this.bearing, 0));
    }

    strafeDirection() {
        return new Vector3(1, 0, 0).
            applyEuler(new Euler(0, this.bearing, 0));
    }

    intendedVelocity(): Vector3 {
        return this.forwardsDirection()
                        .multiplyScalar(this.fwdBkSpeed)
           .add(this.strafeDirection()
                        .multiplyScalar(this.strafeSpeed))
    }

    update(brep: Brep) {

        const prevIntendedVelocity = this.intendedVelocity();

        // account for the user intentions by updating the intendedVelocity.
        this.updateTurning();
        this.updateForwardOrBack();
        this.updateStrafing();
        const change = this.intendedVelocity().clone().sub(prevIntendedVelocity);

        this.updateTrueVelocityFromBrep(brep);

        this.tendTowardsIntendedVelocity(change);

        this.pos.add(this.trueVelocity.clone().multiplyScalar(this.time.delta));
        this.updateUpDown();
        this.updateJumping();
    }

    tendTowardsIntendedVelocity(change: Vector3) {
        // We would like the trueVelocity to keep up with the user intentions,
        // but to lag behind collision effects:
        // trueVelocity +=
        //          change + (intendedVelocity() - trueVelocity) * delta * catchUpFactor
        this.trueVelocity.add(change)
                .add(
                    this.intendedVelocity().clone().sub(this.trueVelocity)
                            .multiplyScalar(this.time.delta * this.catchUpFactor)
                );
    }

    updateTrueVelocityFromBrep(brep: Brep) {
        let acceleration = new Vector3;
        for (let dist of brep.distances(this.pos, this.radius)) {
            const k = this.radius - this.minDist;  // 0.15
            const x = this.radius - dist.dist;     // 0.25 - 0.2 = 0.05;  k - x = 0.1
            // 0.15 / 0.1**2 - 1 / 0.15
            const accelerationScalar = (k / (k - x) ** 2 - 1 / k) * this.bounceStiffness;
            acceleration.add(
                this.pos.clone().sub(dist.base).normalize().multiplyScalar(accelerationScalar)
            );
        }
        this.trueVelocity.add(
            acceleration.multiplyScalar(this.time.delta * this.bounceStiffness)
        );
    }

    updateForwardOrBack() {
        this.fwdBkSpeed = calcNewSpeed(
                this.time.delta, this.keyboard.movingForwardOrBack(),
                this.fwdBkSpeed, this.decayFactor, this.power);
    }

    updateStrafing() {
        this.strafeSpeed = calcNewSpeed(
                this.time.delta, this.keyboard.strafing(),
                this.strafeSpeed, this.decayFactor, this.power);
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