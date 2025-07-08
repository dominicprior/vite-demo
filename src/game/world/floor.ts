import {
    Scene, Mesh, PlaneGeometry, MeshStandardMaterial, DataTexture, RepeatWrapping,
    BufferAttribute,
} from '../../../three/threebuild/three_module.js';

import Game from '../game.js'
import Debug from '../utils/debug.js';

export default class Floor {
    numRows: number = 6;
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

        const numVertices = (this.numRows + 1) ** 2; // (this.numRows + 0) ** 2 * 6;
        const f32a = new Float32Array(3 * numVertices);
        for (let i=0; i < 3 * numVertices; i++) {
            f32a[i] = Math.random();
        }
        // nice values: [0.487, 0.013, 0.006, 0.88, 0.148, 0.965, 0.165, 0.852, 0.392, 0.523, 0.281, 0.391, 0.246, 0.991, 0.543, 0.062, 0.005, 0.806]
        this.geometry.setAttribute('color', new BufferAttribute(f32a, 3));

        this.debug.gui.add(this, 'numRows', 1, 10, 1).name('Num floor rows')
            .onChange(() => {
                this.geometry.dispose();
                this.geometry = new PlaneGeometry(10, 10, this.numRows, this.numRows);
                this.mesh.geometry = this.geometry;
            });
    }

    setMaterial() {
        this.material = new MeshStandardMaterial({
            vertexColors: true,
        });
    }


// .vertexColors : Boolean
// Defines whether vertex coloring is used. Default is false. 
// The engine supports RGB and RGBA vertex colors depending
// on whether a three (RGB) or four (RGBA) component color 
// buffer attribute is used.

    setTextureMaterial() {  // not used

        const width = 4;
        const height = 4;

        const size = width * height;
        const data = new Uint8Array( 4 * size );

        // const r = 255;
        const g = 150;
        const b = 150;

        for ( let i = 0; i < size; i ++ ) {
            const stride = i * 4;
            data[ stride ] = 255 * Math.random();
            data[ stride + 1 ] = g;
            data[ stride + 2 ] = b;
            data[ stride + 3 ] = 255;
        }

        const texture = new DataTexture( data, width, height );
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.needsUpdate = true;

        this.material = new MeshStandardMaterial({
            map: texture,
        });
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = 'floor';
        this.mesh.rotation.x = - Math.PI * 0.5;
        // this.mesh.receiveShadow = true
        this.scene.add(this.mesh);
    }
}
