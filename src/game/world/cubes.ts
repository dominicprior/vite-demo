// Adds boxes to the scene and keeps a note of them in the
// cubes member variable.

import {
    Scene, Mesh, MeshStandardMaterial,
    BoxGeometry,
    Vector3,
    Euler,
} from '../../../three/threebuild/three_module.js';
import Brep from '../brep.js';
import Utils from '../utils/utils.js';
import { BoxDist } from '../utils/distance.js';

// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// See https://threejs-journey.com/lessons/performance-tips around 35:00.
// Or use a THREE.InstancedMesh.
// Also see the matrix maths in https://threejs.org/docs/?q=matr#api/en/math/Matrix4
// And https://discoverthreejs.com/tips-and-tricks/

interface Cube {
    centre: Vector3,
    mesh: Mesh,
}

export default class Cubes {
    locations: string = `
73636263637
3.........3
7.........7
3.........3
6.........6
2.........2
6.........6
3.........3
7.........7
3.........3
73736463737
`;
    numBands: number = 5;
    stride: number = 1;
    boxSize: number = 1;
    utils: Utils;
    cubes: Array<Cube> = [];
    geom: BoxGeometry = new BoxGeometry(this.boxSize, this.boxSize, this.boxSize,
                this.numBands, this.numBands, this.numBands);
    material: MeshStandardMaterial = new MeshStandardMaterial({ color: 'pink', });

    constructor(scene: Scene, brep: Brep, utils: Utils) {
        this.utils = utils;

        const lines = this.locations.trim().split('\n');
        for (let row = lines.length - 1; row >= 0; row--) {
            const line = lines[row];
            for (let col = 0; col < line.length; col++) {
                const char = line[col];
                if (char !== '.') {
                    let n = char.match(/[0-9]/) ? +char : char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
                    for (let level=0, pow=1; level <= 5; level++, pow *= 2) {
                        if ((n & pow) !== 0) {
                            this.addCube(row, col, level, scene, brep, lines.length, line.length);
                        }
                    }
                }
            }
        }
    }

    addCube(row: number, col: number, level: number, scene: Scene, brep: Brep,
                            numRows: number, numCols: number) {
        let mesh = new Mesh(this.geom, this.material);
        const centre = new Vector3(this.stride * (col - (numCols - 1) / 2),
                                   level + 0.5,
                                   this.stride * (row - (numRows - 1) / 2));
        mesh.name = 'cube';
        mesh.frustumCulled = false;
        mesh.position.x = centre.x;
        mesh.position.y = centre.y;
        mesh.position.z = centre.z;
        mesh.layers.enableAll();
        mesh.castShadow = true;
        this.cubes.push({centre: centre, mesh: mesh});
        scene.add(mesh);
        const box = new BoxDist(centre, this.boxSize, this.boxSize, this.boxSize, new Euler);
        for (let face of box.faceDist) {
            brep.faces.push(face);
        }
        for (let edge of box.edgeDist) {
            brep.edges.push(edge);
        }
    }
}
