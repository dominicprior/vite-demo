import {
    Scene, Mesh, MeshStandardMaterial,
    BoxGeometry,
} from '../../../three/threebuild/three_module.js';

import Game from '../game.js'
import Debug from '../utils/debug.js';

export default class Cubes {
    numRows: number = 7;
    numBands: number = 5;
    stride: number = 2;
    debug: Debug;
    scene: Scene;
    meshes: Array<Mesh> = [];

    constructor(game: Game) {
        this.debug = game.debug;
        this.scene = game.scene;
        this.meshes = [];

        const geometry = new BoxGeometry(1, 1, 1,
                this.numBands, this.numBands, this.numBands);
        const material = new MeshStandardMaterial({ color: 'pink', });
        for (let i=0; i < this.numRows; i++) {
            this.setMesh(i, geometry, material);
        }
    }

    setMesh(i: number, geometry: BoxGeometry, material: MeshStandardMaterial) {
        let mesh = new Mesh(geometry, material);
        mesh.name = 'cube';
        mesh.frustumCulled = false;
        mesh.position.x = this.stride * (i - (this.numRows - 1) / 2);
        mesh.position.y = 0.5;
        // this.mesh.receiveShadow = true
        this.meshes.push(mesh);
        this.scene.add(mesh);
    }
}
