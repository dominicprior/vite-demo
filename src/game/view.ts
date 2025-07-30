import {
    Vector3, Vector4,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Player from './player.js';
import Wide from './utils/wide.js';

interface Port {  // as proportions of the whole screen
    x: number;
    y: number;
    w: number;
    h: number;
}

export default class View {
    sizes: Sizes;
    bend: number;
    horizFov: number;
    camera: Wide;
    port: Port;
    relativeBearing: number;
    mirrored: boolean;

    constructor(sizes: Sizes, bend: number, horizFov: number,
                port: Port, relativeBearing: number,
                mirrored: boolean) {
        this.sizes = sizes;
        this.bend = bend;
        this.horizFov = horizFov;
        this.port = port;
        this.relativeBearing = relativeBearing;
        this.mirrored = mirrored;
        this.camera = new Wide(this.vertFov(), this.aspect(), 0.05, 100, bend);
    }

    update(player: Player) {
        const pos = player.pos;
        this.camera.position.set(pos.x, pos.y, pos.z);
        this.camera.setRotationFromAxisAngle(new Vector3(0,1,0), player.bearing + this.relativeBearing);
        // this.scene.add(this.camera);
    }

    resize() {
        this.camera.aspect = this.aspect();
        this.camera.fov = this.vertFov();
        this.camera.updateProjectionMatrix();
    }

    vertFov() {
        const halfHorizFov = this.horizFov * Math.PI / 360;
        const t = Math.tan(halfHorizFov) / this.aspect();
        return Math.atan(t) * 360 / Math.PI;
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
