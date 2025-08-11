// Add a white disk in the distance.  (It should be at infinity, but this will do for now).

import {
    Scene, Mesh, MeshBasicMaterial,
    CircleGeometry,
    Vector3,
} from '../../../three/threebuild/three_module.js';
import Utils from '../utils/utils.js';

export default class Moon {
    utils: Utils;
    mesh: Mesh;

    constructor(scene: Scene, utils: Utils) {
        this.utils = utils;

        // const material = new MeshBasicMaterial({ color: 0xffeeaa, });
        const material = new MeshBasicMaterial({ color: 'white', });
        const geometry = new CircleGeometry(10, 30);
        const mesh = new Mesh(geometry, material);
        mesh.name = 'moon';
        mesh.frustumCulled = false;
        mesh.position.set(0, 110, -200);
        mesh.lookAt(new Vector3);
        mesh.layers.enableAll();
        scene.add(mesh);
        this.mesh = mesh;
    }
}
