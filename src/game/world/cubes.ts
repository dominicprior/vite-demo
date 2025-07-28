import {
    Scene, Mesh, MeshStandardMaterial,
    BoxGeometry,
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type { Collision, } from '../utils/types.js';
import { noCollision, } from '../utils/types.js';
import Debug from '../utils/debug.js';
import HorizontalBox from '../collisions/horizontalbox.js';
import Player from '../player.js';

// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// See https://threejs-journey.com/lessons/performance-tips around 35:00.
// Or use a THREE.InstancedMesh.
// Also see the matrix maths in https://threejs.org/docs/?q=matr#api/en/math/Matrix4
// And https://discoverthreejs.com/tips-and-tricks/

export default class Cubes {
    numRows: number = 2;
    numBands: number = 5;
    stride: number = 2;
    boxSize: number = 1;
    debug: Debug;
    meshes: Array<Mesh> = [];

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;
        this.meshes = [];

        const geometry = new BoxGeometry(this.boxSize, this.boxSize, this.boxSize,
                this.numBands, this.numBands, this.numBands);
        const material = new MeshStandardMaterial({ color: 'pink', });
        for (let i=0; i < this.numRows; i++) {
            this.setMesh(i, geometry, material, scene);
        }
    }

    setMesh(i: number, geometry: BoxGeometry, material: MeshStandardMaterial, scene: Scene) {
        let mesh = new Mesh(geometry, material);
        mesh.name = 'cube';
        mesh.frustumCulled = false;
        mesh.position.x = this.stride * (i - (this.numRows - 1) / 2);
        mesh.position.y = 0.5;
        mesh.position.z = 0;
        mesh.layers.enableAll();
        // this.mesh.receiveShadow = true
        this.meshes.push(mesh);
        scene.add(mesh);
    }

    firstCollision(player: Player): Collision {
        let result = noCollision;
        for (let i=0; i < this.numRows; i++) {
            const position = this.meshes[i].position;
            const box = new HorizontalBox(
                    new Vector2(position.x, position.z),
                    this.boxSize,
                    this.boxSize,
                    0);
            let collision = box.firstCollision(player);
            if (collision.t < result.t) {
                result = collision;
            }
        }
        return result;
    }
}
