import {
    Scene, Mesh, MeshBasicMaterial,
    BoxGeometry,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';
import Player from '../player.js';

// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// See https://threejs-journey.com/lessons/performance-tips around 35:00.
// Or use a THREE.InstancedMesh.
// Also see the matrix maths in https://threejs.org/docs/?q=matr#api/en/math/Matrix4
// And https://discoverthreejs.com/tips-and-tricks/

export default class CrossHairs {
    boxSize: number = 0.004;
    debug: Debug;
    scene: Scene;
    meshes: Array<Mesh> = [];

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;
        this.scene = scene;

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
            this.scene.add(mesh);
            this.meshes.push(mesh);
        }   
    }

    update(player: Player) {
        const vec = player.forwardsDirection().clone().multiplyScalar(0.2);
        for (let i=0; i<2; i++) {
            this.meshes[i].position.x = player.pos.x + vec.x;
            this.meshes[i].position.y = player.pos.y;
            this.meshes[i].position.z = player.pos.z + vec.y;
            this.meshes[i].rotation.y = player.bearing;
        }
    }
}
