import {
    Vector3,
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
    camera: Wide;
    port: Port;
    relativeBearing: number;
    mirrored: boolean;

    constructor(sizes: Sizes, bend: number, fov: number,
                port: Port, relativeBearing: number,
                mirrored: boolean) {
        this.sizes = sizes;
        this.port = port;
        this.relativeBearing = relativeBearing;
        this.mirrored = mirrored;
        this.camera = new Wide(fov, this.aspect(), 0.05, 100, bend);
    }

    update(player: Player) {
        const pos = player.pos;
        this.camera.position.set(pos.x, pos.y, pos.z);
        this.camera.setRotationFromAxisAngle(new Vector3(0,1,0), player.bearing + this.relativeBearing);
        // this.scene.add(this.camera);
    }

    resize() {
        this.camera.aspect = this.aspect();
        this.camera.updateProjectionMatrix();
    }

    aspect() {
        return (this.sizes.width * this.port.w) / (this.sizes.height * this.port.h);
    }
}
