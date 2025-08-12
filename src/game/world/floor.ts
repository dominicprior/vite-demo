import {
    Scene, Mesh, BufferGeometry, MeshStandardMaterial, DataTexture, RepeatWrapping,
    BufferAttribute, Float32BufferAttribute,
} from '../../../three/threebuild/three_module.js';
import Utils from '../utils/utils.js';

export default class Floor {
    numRows: number = 45;
    utils: Utils;
    mesh: Mesh;

    constructor(scene: Scene, utils: Utils) {
        this.utils = utils;

        const geometry = this.geometry();
        this.setColours(geometry);
        this.setDebug();
        const material = this.material();
        this.mesh = this.newMesh(geometry, material);
        scene.add(this.mesh);
    }

    geometry(): BufferGeometry {
        const geometry = new BufferGeometry();
        const size = 15;
        const stride = size / this.numRows;
        let vertices: Array<number> = [];
        for (let i=0; i < this.numRows; i++) {
            for (let j=0; j < this.numRows; j++) {
                const x = -size/2 + i * stride;
                const y = -size/2 + j * stride;
                if ((i+j) % 2) {
                    vertices.push(x, y, 0,   x + stride, y, 0,   x + stride, y + stride, 0);
                    vertices.push(x, y, 0,   x + stride, y + stride, 0,   x, y + stride, 0);
                }
                else {
                    vertices.push(x, y, 0,   x + stride, y, 0,   x, y + stride, 0);
                    vertices.push(x + stride, y, 0,   x + stride, y + stride, 0,   x, y + stride, 0);

                }
            }
        }
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();  // what about uv values too?
        return geometry;
    }

    setColours(geometry: BufferGeometry) {
        const numTriangles = this.numRows * this.numRows * 2;
        const f32a = new Float32Array(9 * numTriangles);
        for (let i=0; i < numTriangles; i++) {
            // Choose a random RGB where R+G+B is 2.
            const [y, x] = ([Math.random(), Math.random()] as any).toSorted((a: number, b: number) => a - b)
            let r = x;
            let g = 1 - y;
            let b = 2 - r - g;
            // Now dampen the colours
            r /= 4;
            g /= 4;
            b /= 4;
            r += 0.75;
            g += 0.75;
            b += 0.25;

            for (let v=0; v < 3; v++) {
                f32a[9*i + 3*v]     = r;
                f32a[9*i + 3*v + 1] = g;
                f32a[9*i + 3*v + 2] = b;
            }
        }
        geometry.setAttribute('color', new BufferAttribute(f32a, 3));
    }

    setDebug() {
        this.utils.debug.gui.add(this, 'numRows', 1, 10, 1).name('Num floor rows')
            .onChange(() => {
                this.mesh.geometry.dispose();
                const geometry = this.geometry();
                this.setColours(geometry);
                this.mesh.geometry = geometry;
            });
    }

    material() {
        return new MeshStandardMaterial({
            vertexColors: true,
        });
    }

    newMesh(geometry: BufferGeometry, material: MeshStandardMaterial): Mesh {
        const mesh = new Mesh(geometry, material);
        mesh.name = 'floor';
        mesh.frustumCulled = false;
        mesh.rotation.x = - Math.PI * 0.5;
        mesh.receiveShadow = true;
        return mesh;
    }

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

        return new MeshStandardMaterial({
            map: texture,
        });
    }
}
