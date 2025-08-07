import {
    Scene, Mesh, MeshBasicMaterial,
    BoxGeometry,
    Vector3,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';
import Player from '../player.js';

export default class CrossHairs {
    boxSize: number = 0.008;
    debug: Debug;
    meshes: Array<Array<Array<Mesh>>> = [];

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;

        const material = new MeshBasicMaterial({ color: 'red', });
        for (let axis of [0, 1, 2]) {
            const aa: Array<Array<Mesh>> = [];
            for (let sign of [-1, 1]) {
                const a: Array<Mesh> = [];
                for (let i of [0, 1]) {
                    const geometry = new BoxGeometry(
                        i ? this.boxSize / 10 : this.boxSize,
                        i ? this.boxSize      : this.boxSize / 10,
                        this.boxSize / 10
                    );
                    const mesh = new Mesh(geometry, material);
                    mesh.name = 'crosshair' + axis + sign + i;
                    mesh.frustumCulled = false;
                    mesh.layers.enableAll();
                    scene.add(mesh);
                    a.push(mesh);
                }
                aa.push(a);
            }
            this.meshes.push(aa);
        }
    }

    update(player: Player) {
        for (let [axis, relPos] of [
                                    [0, player.forwardsDirection()],
                                    [1, player.strafeDirection()],
                                    [2, new Vector3(0,1,0)]
                                ]) {
            const aa: Array<Array<Mesh>> = this.meshes[axis as number];
            for (let sign of [0, 1]) {
                const a: Array<Mesh> = aa[sign];
                const signedRelPos = (relPos as Vector3).clone().multiplyScalar((sign * 2 - 1) * 0.2);
                for (let mesh of a) {
                    mesh.position.copy(player.pos.clone().add(signedRelPos));
                    mesh.rotation.y = player.bearing;
                }
            }
        }
    }
}
