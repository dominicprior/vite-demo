import {
    Scene, Mesh, PlaneGeometry, MeshStandardMaterial,
} from '../../../three/threebuild/three_module.js';

import Game from '../game.js'
import Debug from '../utils/debug.js';

export default class Floor {
    numRows: number = 1;
    debug: Debug;
    scene: Scene;
    // @ts-ignore: no initializer
    geometry: PlaneGeometry;
    // @ts-ignore: no initializer
    material: MeshStandardMaterial;
    // @ts-ignore: no initializer
    mesh: Mesh;

    constructor(game: Game) {
        this.debug = game.debug;
        this.scene = game.scene;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new PlaneGeometry(10, 10, this.numRows, this.numRows);
        this.debug.gui.add(this, 'numRows', 1, 10, 1).name('Num floor rows')
            .onChange(() => {
                this.scene.remove(this.mesh);
                this.geometry.dispose();
                this.geometry = new PlaneGeometry(10, 10, this.numRows, this.numRows);
                this.mesh.geometry = this.geometry;
                this.scene.add(this.mesh);
            });
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            color: 'yellow',
        });
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = - Math.PI * 0.5;
        // this.mesh.receiveShadow = true
        this.scene.add(this.mesh);
    }
}
