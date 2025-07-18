import {
    Scene,
    Vector3,
} from '../../three/threebuild/three_module.js';
import Sizes from './utils/sizes.js';
import Player from './player.js';
import Wide from './utils/wide.js';

export default class Camera {
    sizes: Sizes;
    scene: Scene;
    // @ts-ignore: no initializer
    instance: Wide;

    constructor(sizes: Sizes, scene: Scene) {
        this.sizes = sizes;
        this.scene = scene;
        this.setInstance();
    }

    setInstance() {
        this.instance = new Wide(
                75, this.sizes.width / this.sizes.height, 0.05, 100, 0.4);
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
