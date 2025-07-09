import * as TYPES from './types.js';

export default class Keyboard {
    pressed: { [key: string]: boolean; } = {};

    constructor() {
        addEventListener("keydown", (event) => {
            this.pressed[event.code] = true;
        })
        addEventListener("keyup", (event) => {
            this.pressed[event.code] = false;
        })
    }

    turning(): TYPES.Sign {
        const left  = this.turningLeft()  ? 1 : 0;
        const right = this.turningRight() ? 1 : 0;
        return (left - right) as TYPES.Sign;
    }
    turningLeft(): boolean {
        return this.pressed['KeyA'] || this.pressed['ArrowLeft'];
    }
    turningRight(): boolean {
        return this.pressed['KeyD'] || this.pressed['ArrowRight'];
    }

    moving(): TYPES.Sign {
        const fwd   = this.goingForward() ? 1 : 0;
        const back  = this.goingBack()    ? 1 : 0;
        return (fwd - back) as TYPES.Sign;
    }
    goingForward(): boolean {
        return this.pressed['KeyW'] || this.pressed['ArrowUp'];
    }
    goingBack(): boolean {
        return this.pressed['KeyS'] || this.pressed['ArrowDown'];
    }

    strafing(): TYPES.Sign {
        const right = this.strafingRight() ? 1 : 0;
        const left  = this.strafingLeft()  ? 1 : 0;
        return (right - left) as TYPES.Sign;
    }
    strafingLeft(): boolean {
        return this.pressed['KeyQ'];
    }
    strafingRight(): boolean {
        return this.pressed['KeyE'];
    }
}
