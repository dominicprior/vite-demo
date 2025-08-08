// Maintains the set of keys that are currently pressed.
// Has convenience functions like movingForward().

import type {
    Sign,
} from '../utils/types.js';

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

    turning(): Sign {
        const left  = this.turningLeft()  ? 1 : 0;
        const right = this.turningRight() ? 1 : 0;
        return (left - right) as Sign;
    }
    turningLeft(): boolean {
        return this.pressed['KeyA'] || this.pressed['ArrowLeft'];
    }
    turningRight(): boolean {
        return this.pressed['KeyD'] || this.pressed['ArrowRight'];
    }

    movingForwardOrBack(): Sign {
        const fwd   = this.movingForward() ? 1 : 0;
        const back  = this.movingBack()    ? 1 : 0;
        return (fwd - back) as Sign;
    }
    movingForward(): boolean {
        return this.pressed['KeyW'] || this.pressed['ArrowUp'];
    }
    movingBack(): boolean {
        return this.pressed['KeyS'] || this.pressed['ArrowDown'];
    }

    strafing(): Sign {
        const right = this.strafingRight() ? 1 : 0;
        const left  = this.strafingLeft()  ? 1 : 0;
        return (right - left) as Sign;
    }
    strafingLeft(): boolean {
        return this.pressed['KeyQ'];
    }
    strafingRight(): boolean {
        return this.pressed['KeyE'];
    }
}
