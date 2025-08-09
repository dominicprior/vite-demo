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
    rotationSpeed = 1;  // in radians per second
    verticalSpeed = 1.2;  // for J and K
    gravity = 3;
    initialJumpSpeed = 2.5;
    power = 5;
    decayFactor = 1;   // 0.2;  // set this to zero for immediate stopping.

    // variables
    bearing = 0;  // radians from North (negative Z) round towards negative X.
    pos: Vector3 = new Vector3(0, 0.6, 0);
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
            }
        });
    }

    forwardsDirection() {
        return new Vector3(0, 0, -1).
            applyEuler(new Euler(0, this.bearing, 0));
    }

    strafeDirection() {
        return new Vector3(1, 0, 0).
            applyEuler(new Euler(0, this.bearing, 0));
    }

    velocity(): Vector3 {  // intended velocity that might get thwarted by walls
        return this.forwardsDirection().clone()
                        .multiplyScalar(this.fwdBkSpeed)
           .add(this.strafeDirection()
                        .multiplyScalar(this.strafeSpeed))
    }

    update(brep: Brep) {
        this.updateTurning();
        this.updateFromBrep(brep);
        this.updateForwardOrBack();
        this.updateStrafing();
        this.pos.add(this.velocity().clone()
                .multiplyScalar(this.time.delta));
        this.updateUpDown();
        this.updateJumping();
    }

    updateFromBrep(brep: Brep) {
        // accelerations etc., for each relevant bit of brep geometry.
        let acceleration = 0;
        for (let dist of brep.distances(this.pos, this.radius)) {
            // the maths...  dist.dist  dist.base
        }
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