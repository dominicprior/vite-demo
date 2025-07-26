import {
    Vector3,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Player from './player.js';
import Wide from './utils/wide.js';

export default class View {
    sizes: Sizes;
    camera: Wide;

    constructor(sizes: Sizes, bend: number, fov: number) {
        this.sizes = sizes;
        this.camera = new Wide(
                fov, this.sizes.width / this.sizes.height, 0.05, 100, bend);
    }
            
    update(player: Player) {
        const pos = player.pos;
        this.camera.position.set(pos.x, pos.y, pos.z);
        this.camera.setRotationFromAxisAngle(new Vector3(0,1,0), player.bearing);
        // this.scene.add(this.camera);
    }

    resize() {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }
}
