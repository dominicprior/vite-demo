// Player position and movement

import {
    Euler,
    Vector3,
} from '../../three/threebuild/three_module.js';

import Utils from './utils/utils.js';
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

let prevStringsLen = 0;

export default class Player {

    // constants
    radius = 0.25;
    minDist = 0.1;
    bounceStiffness = 1;
    collisionDrag = 0;
    numSteps = 4;

    rotationSpeed = 1;  // in radians per second
    verticalSpeed = 1.2;  // for J and K
    gravity = 3;
    initialJumpSpeed = 2.5;
    power = 5;
    decayFactor = 1;   // 0.2;  // set this to zero for immediate stopping.
    catchUpFactor = 1;  // for trueVelocity catching up with intendedVelocity.

    // variables
    bearing = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(0, 0.6, 0);
    fwdBkSpeed  = 0;  // These two speeds give the user's intended velocity.
    strafeSpeed = 0;
    trueVelocity = new Vector3;  // This is the velocity accounting for walls.
    jumpTime = -100;       // when the last jump occurred.
    verticalVelocity = 0;

    utils: Utils;

    constructor(utils: Utils) {
        this.utils = utils;
        if (typeof(window) === 'undefined') {
            // Running inside Vitest, not inside a browser.
        }
        else {
            window.addEventListener('keydown', (event) => { 
                if (event.key === ' ') {
                    this.verticalVelocity = this.initialJumpSpeed;
                    this.jumpTime = this.utils.time.elapsed;
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
                    // @ts-ignore
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
        for (let _step=0; _step < this.numSteps; _step++) {
            this.updateOneStep(brep, this.utils.time.delta / this.numSteps);
        }
    }

    updateOneStep(brep: Brep, delta: number) {

        const prevIntendedVelocity = this.intendedVelocity();

        // account for the user intentions by updating the intendedVelocity.
        this.updateTurning(delta);
        this.updateForwardOrBack(delta);
        this.updateStrafing(delta);
        const change = this.intendedVelocity().clone().sub(prevIntendedVelocity);

        this.updateTrueVelocityFromBrep(brep, delta);

        this.tendTowardsIntendedVelocity(change, delta);

        this.pos.add(this.trueVelocity.clone().multiplyScalar(delta));
        this.updateUpDown(delta);
        this.updateJumping(delta);
    }

    tendTowardsIntendedVelocity(change: Vector3, delta: number) {
        // We would like the trueVelocity to keep up with the user intentions,
        // but to lag behind collision effects:
        // trueVelocity +=
        //          change + (intendedVelocity() - trueVelocity) * delta * catchUpFactor
        this.trueVelocity.add(change)
                .add(
                    this.intendedVelocity().clone().sub(this.trueVelocity)
                            .multiplyScalar(delta * this.catchUpFactor)
                );
    }

    updateTrueVelocityFromBrep(brep: Brep, delta: number) {
        let acceleration = new Vector3;
        let strings: Array<string> = [];
        for (let dist of brep.distances(this.pos, this.radius)) {
            const k = this.radius - this.minDist;
            const x = this.radius - dist.dist;
            strings.push((k - x).toFixed(3));
            const accelerationScalar = (k / (k - x) ** 2 - 1 / k) * this.bounceStiffness;
            acceleration.add(
                this.pos.clone().sub(dist.base).normalize().multiplyScalar(accelerationScalar)
            );
        }
        if (strings.length > 0) {
            // @ts-ignore
            console.log(
                [this.pos.x.toFixed(3), this.pos.z.toFixed(3), ...strings].join(' : ')
            );
        }
        if (strings.length === 0 && prevStringsLen !== 0) {
            // @ts-ignore
            console.log('---');
        }
        prevStringsLen = strings.length;
        this.trueVelocity.add(
            acceleration.multiplyScalar(delta * this.bounceStiffness)
        );
    }

    updateForwardOrBack(delta: number) {
        this.fwdBkSpeed = calcNewSpeed(
                delta, this.utils.keyboard.movingForwardOrBack(),
                this.fwdBkSpeed, this.decayFactor, this.power);
    }

    updateStrafing(delta: number) {
        this.strafeSpeed = calcNewSpeed(
                delta, this.utils.keyboard.strafing(),
                this.strafeSpeed, this.decayFactor, this.power);
    }

    updateTurning(delta: number) {
        const turning = this.utils.keyboard.turning();
        if (turning) {
            this.bearing += this.rotationSpeed * delta * turning;
        }
    }

    updateUpDown(delta: number) {
        if (this.utils.keyboard.pressed['KeyJ']) {
            this.pos.y += this.verticalSpeed * delta;
        }
        if (this.utils.keyboard.pressed['KeyK']) {
            this.pos.y -= this.verticalSpeed * delta;
        }
    }

    updateJumping(delta: number) {
        const totalJumpDuration = 2 * this.initialJumpSpeed / this.gravity;
        const jumpTimeSoFar = this.utils.time.elapsed - this.jumpTime;
        if (jumpTimeSoFar < totalJumpDuration) {
            const newVerticalVelocity = this.verticalVelocity - delta * this.gravity;
            this.pos.y += delta * (this.verticalVelocity + newVerticalVelocity) / 2;
            this.verticalVelocity = newVerticalVelocity;
        }
    }

    jumpAltitude(t: number) {  // not used
        return this.initialJumpSpeed * t - this.gravity * t * t / 2;
    }
}