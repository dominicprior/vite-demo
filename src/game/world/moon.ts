import {
    Scene, Mesh, MeshBasicMaterial,
    BoxGeometry, IcosahedronGeometry, CircleGeometry,
    Vector3,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';

export default class Moon {
    debug: Debug;
    mesh: Mesh;

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;

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
