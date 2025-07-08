import {
    Scene, Mesh, BufferGeometry, MeshStandardMaterial,
    BoxGeometry,
} from '../../../three/threebuild/three_module.js';

import Game from '../game.js'
import Debug from '../utils/debug.js';

export default class Cubes {
    numRows: number = 4;
    numBands: number = 2;
    stride: number = 4;
    debug: Debug;
    scene: Scene;
    // @ts-ignore: no initializer
    geometry: BufferGeometry;
    // @ts-ignore: no initializer
    material: MeshStandardMaterial;
    // @ts-ignore: no initializer
    meshes: Array<Mesh>;

    constructor(game: Game) {
        this.debug = game.debug;
        this.meshes = [];
        this.scene = game.scene;

        this.setGeometry();
        for (let i=0; i < this.numRows; i++) {
            this.setColours();
            this.setMaterial();
            this.setMesh(i);
        }
        this.setDebug();
    }

    setGeometry() {
        this.geometry = new BoxGeometry(1, 1, 1, this.numBands, this.numBands, this.numBands);
    }

    setColours() {
    }

    setDebug() {
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            // vertexColors: true,
            color: 'pink',
        });
    }

    setMesh(i: number) {
        let mesh = new Mesh(this.geometry, this.material);
        this.meshes.push(mesh);
        mesh.name = 'cube';
        mesh.position.x = this.stride * (i - (this.numRows - 1) / 2);
        mesh.position.y = 0.5;
        // this.mesh.receiveShadow = true
        this.scene.add(mesh);
    }
}
