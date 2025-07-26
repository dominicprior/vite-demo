import {
    Vector3,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Player from './player.js';
import Wide from './utils/wide.js';

export default class View {
    sizes: Sizes;
    camera: Wide;
    x: number;  // as proportions of the whole screen
    y: number;
    w: number;
    h: number;
    relativeBearing: number;

    constructor(sizes: Sizes, bend: number, fov: number,
                x: number, y: number, w: number, h: number, relativeBearing: number) {
        this.sizes = sizes;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.relativeBearing = relativeBearing;
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
        return (this.sizes.width * this.w) / (this.sizes.height * this.h);
    }
}
