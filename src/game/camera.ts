import {
    Scene,
    Vector3,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Player from './player.js';
import Wide from './utils/wide.js';

export default class Camera {
    sizes: Sizes;
    instance: Wide;

    constructor(sizes: Sizes, bend: number, fov: number) {
        this.sizes = sizes;
        this.instance = new Wide(
                fov, this.sizes.width / this.sizes.height, 0.05, 100, bend);
    }
            
    update(player: Player) {
        const pos = player.pos;
        this.instance.position.set(pos.x, pos.y, pos.z);
        this.instance.setRotationFromAxisAngle(new Vector3(0,1,0), player.bearing);
        // this.scene.add(this.instance);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
}
