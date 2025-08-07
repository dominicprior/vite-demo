import {
    Scene, Mesh, MeshBasicMaterial,
    BoxGeometry,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';
import Player from '../player.js';

export default class CrossHairs {
    boxSize: number = 0.008;
    debug: Debug;
    meshes: Array<Mesh> = [];

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;

        const material = new MeshBasicMaterial({ color: 'red', });
        for (let i=0; i<2; i++) {
            const geometry = new BoxGeometry(
                i ? this.boxSize / 10 : this.boxSize,
                i ? this.boxSize      : this.boxSize / 10,
                this.boxSize / 10
            );
            const mesh = new Mesh(geometry, material);
            mesh.name = 'crosshair' + i;
            mesh.layers.enableAll();
            scene.add(mesh);
            this.meshes.push(mesh);
        }
    }

    update(player: Player) {
        const vec = player.forwardsDirection().clone().multiplyScalar(0.2);
        for (let mesh of this.meshes) {
            mesh.position.copy(player.pos.clone().add(vec));
            mesh.rotation.y = player.bearing;
        }
    }
}
