import {
    Vector3, Vector4,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Wide from './utils/wide.js';
import Utils from './utils/utils.js';

interface Port {  // as proportions of the whole screen
    x: number;
    y: number;
    w: number;
    h: number;
}

export default class View {
    sizes: Sizes;
    bend: number;
    minFov: number;
    camera: Wide;
    port: Port;
    relativeBearing: number;
    pitch: number = 0;
    mirrored: boolean;
    utils: Utils;

    constructor(sizes: Sizes, bend: number, minFov: number,
                port: Port, relativeBearing: number,
                mirrored: boolean, utils: Utils) {
        this.sizes = sizes;
        this.bend = bend;
        this.minFov = minFov;
        this.port = port;
        this.relativeBearing = relativeBearing;
        this.mirrored = mirrored;
        this.utils = utils;
        this.camera = new Wide(this.vertFov(), this.aspect(), 0.05, 1000, bend);
    }

    update(pos: Vector3, bearing: number) {
        this.camera.position.set(pos.x, pos.y, pos.z);
        this.camera.setRotationFromAxisAngle(new Vector3(0,1,0), bearing + this.relativeBearing);
        if (this.utils.keyboard.pressed['KeyG']) {
            this.pitch += 0.02;
        }
        if (this.utils.keyboard.pressed['KeyB']) {
            this.pitch -= 0.02;
        }
        this.camera.rotateX(this.pitch);
    }

    resize() {
        this.camera.aspect = this.aspect();
        this.camera.fov = this.vertFov();
        this.camera.updateProjectionMatrix();
    }

    vertFov() {
        if (this.aspect() < 1) {  // portrait - make the fov bigger so the horiz fov is minFov
            const halfHorizFov = this.minFov * Math.PI / 360;
            const t = Math.tan(halfHorizFov) / this.aspect();
            return Math.atan(t) * 360 / Math.PI;
        }
        else {  // landscape
            return this.minFov;
        }
    }

    widthInPixels() {
        return this.sizes.width * this.port.w;
    }

    heightInPixels() {
        return this.sizes.height * this.port.h;
    }

    viewport() {
        return new Vector4(
            this.port.x * this.sizes.width,
            this.port.y * this.sizes.height,
            this.widthInPixels(),
            this.heightInPixels()
        )
    }

    aspect() {
        return this.widthInPixels() / this.heightInPixels();
    }
}
