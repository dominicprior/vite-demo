import {
    Scene, Mesh, MeshStandardMaterial,
    BoxGeometry,
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type { Player2D, Collision, } from '../utils/types.js';
import { noCollision, } from '../utils/types.js';
import Debug from '../utils/debug.js';
import HorizontalBox from '../collisions/horizontalbox.js';

export default class Cubes {
    numRows: number = 1;
    numBands: number = 5;
    stride: number = 2;
    boxSize: number = 1;
    debug: Debug;
    scene: Scene;
    meshes: Array<Mesh> = [];

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;
        this.scene = scene;
        this.meshes = [];

        const geometry = new BoxGeometry(this.boxSize, this.boxSize, this.boxSize,
                this.numBands, this.numBands, this.numBands);
        const material = new MeshStandardMaterial({ color: 'pink', });
        for (let i=0; i < this.numRows; i++) {
            this.addMesh(i, geometry, material);
        }
    }

    addMesh(i: number, geometry: BoxGeometry, material: MeshStandardMaterial) {
        let mesh = new Mesh(geometry, material);
        mesh.name = 'cube';
        mesh.frustumCulled = false;
        mesh.position.x = this.stride * (i - (this.numRows - 1) / 2);
        mesh.position.y = 0.5;
        mesh.position.z = 0;
        // this.mesh.receiveShadow = true
        this.meshes.push(mesh);
        this.scene.add(mesh);
    }

    firstCollision(player: Player2D): Collision {
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
