export default class Keyboard {
    pressed: { [key: string]: boolean; } = {};
    constructor() {
        addEventListener("keydown", (event) => {
            this.pressed[event.code] = true;
        })
        addEventListener("keyup", (event) => {
            this.pressed[event.code] = false;
            console.log(this.pressed);
        })
    }
    turningLeft(): boolean {
        return this.pressed['KeyA'] || this.pressed['ArrowLeft'];
    }
    turningRight(): boolean {
        return this.pressed['KeyD'] || this.pressed['ArrowRight'];
    }
}
