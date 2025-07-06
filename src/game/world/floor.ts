import {
    Scene, Mesh, PlaneGeometry, MeshStandardMaterial,
} from '../../../three/threebuild/three_module.js';

import Game from '../game.js'

export default class Floor {
    scene: Scene;
    // @ts-ignore: no initializer
    geometry: PlaneGeometry;
    // @ts-ignore: no initializer
    material: MeshStandardMaterial;
    // @ts-ignore: no initializer
    mesh: Mesh;

    constructor(game: Game) {
        this.scene = game.scene

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new PlaneGeometry(10, 10)
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            color: 'yellow',
        })
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        // this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}
