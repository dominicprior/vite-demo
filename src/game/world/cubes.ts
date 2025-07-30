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

interface Cube {
    centre: Vector2,
    mesh: Mesh,
}

export default class Cubes {
    locations: string = `
..00
0..0
`;
    numBands: number = 5;
    stride: number = 1;
    boxSize: number = 1;
    debug: Debug;
    cubes: Array<Cube> = [];
    geom: BoxGeometry = new BoxGeometry(this.boxSize, this.boxSize, this.boxSize,
                this.numBands, this.numBands, this.numBands);
    material: MeshStandardMaterial = new MeshStandardMaterial({ color: 'pink', });

    constructor(scene: Scene, debug: Debug) {
        this.debug = debug;

        const lines = this.locations.trim().split('\n');
        for (let row = 0; row < lines.length; row++) {
            const line = lines[row];
            for (let col = 0; col < line.length; col++) {
                if (line[col] === '0') {
                    this.addCube(row, col, scene, lines.length, line.length);
                }
            }
        }
    }

    addCube(row: number, col: number, scene: Scene, numRows: number, numCols: number) {
        let mesh = new Mesh(this.geom, this.material);
        const centre = new Vector2(this.stride * (col - (numCols - 1) / 2),
                                   this.stride * (row - (numRows - 1) / 2));
        mesh.name = 'cube';
        mesh.frustumCulled = false;
        mesh.position.x = centre.x;
        mesh.position.y = 0.5;
        mesh.position.z = centre.y;
        mesh.layers.enableAll();
        // mesh.receiveShadow = true
        this.cubes.push({centre: centre, mesh: mesh});
        scene.add(mesh);
    }

    firstCollision(player: Player): Collision {
        let result = noCollision;
        for (let cube of this.cubes) {
            const box = new HorizontalBox(cube.centre, this.boxSize, this.boxSize, 0);
            let collision = box.firstCollision(player);
            if (collision.t < result.t) {
                result = collision;
            }
        }
        return result;
    }
}
