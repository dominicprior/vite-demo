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
    turningLeft(): boolean {
        return this.pressed['KeyA'] || this.pressed['ArrowLeft'];
    }
    turningRight(): boolean {
        return this.pressed['KeyD'] || this.pressed['ArrowRight'];
    }
    goingForward(): boolean {
        return this.pressed['KeyW'] || this.pressed['ArrowUp'];
    }
    goingBack(): boolean {
        return this.pressed['KeyS'] || this.pressed['ArrowDown'];
    }
}
