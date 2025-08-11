// Draws tiny crosshairs in all six axis directions by always moving
// them relative to the player.

import {
    Scene, Mesh, MeshBasicMaterial,
    BoxGeometry,
    Vector3,
    Euler,
} from '../../../three/threebuild/three_module.js';
import Utils from '../utils/utils.js';
import Player from '../player.js';

export default class CrossHairs {
    boxSize: number = 0.008;
    utils: Utils;
    meshes: Array<Array<Array<Mesh>>> = [];

    constructor(scene: Scene, utils: Utils) {
        this.utils = utils;

        const material = new MeshBasicMaterial({ color: 'red', });
        for (let axis of [0, 1, 2]) {
            const aa: Array<Array<Mesh>> = [];
            for (let sign of [-1, 1]) {
                const a: Array<Mesh> = [];
                for (let i of [0, 1]) {
                    const b = axis === 0 ? this.boxSize : this.boxSize / 2;
                    const geometry = new BoxGeometry(
                        i ? b / 10 : b,
                        i ? b      : b / 10,
                        b / 10
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
        for (let [axis, relPos, rotX, rotY] of [
                                    [0, player.forwardsDirection(), 0, 0],
                                    [1, player.strafeDirection(),   0, 1],
                                    [2, new Vector3(0,1,0),         1, 0]
                                ]) {
            const aa: Array<Array<Mesh>> = this.meshes[axis as number];
            for (let sign of [0, 1]) {
                const a: Array<Mesh> = aa[sign];
                const signedRelPos = (relPos as Vector3).clone().multiplyScalar((sign * 2 - 1) * 0.2);
                for (let mesh of a) {
                    mesh.position.copy(player.pos.clone().add(signedRelPos));
                    mesh.setRotationFromEuler(new Euler(0, player.bearing));
                    mesh.rotateX((rotX as number) * Math.PI / 2);
                    mesh.rotateY((rotY as number) * Math.PI / 2);
                }
            }
        }
    }
}
