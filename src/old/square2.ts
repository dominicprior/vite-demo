// Create a square mesh with two colors using an indexed BufferGeometry
// and groups, which allows us to use different materials for each group of faces.

import {
    Mesh, MeshStandardMaterial,
    DoubleSide, BufferGeometry,
    BufferAttribute,
} from '../../three/threebuild/three_module.js';

function createSquare2() {

    const vertices = new Float32Array([
        -1, -1, 0,
        1, -1, 0,
        1, 1, 0,
        -1, 1, 0,
    ]);
    const indices = [0, 1, 2, 2, 3, 0];

    const purple = new MeshStandardMaterial({
        color: 'purple',
        // side: DoubleSide
    });
    const yellow = new MeshStandardMaterial({ color: 'yellow', side: DoubleSide });

    const geometry = new BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    geometry.addGroup(0, 3, 0);
    geometry.addGroup(3, 3, 1);
    const square = new Mesh(geometry, [purple, yellow]);
    // let square = new Mesh(geometry, purple);
    // square = new Mesh(new BoxGeometry, purple);
    return square;
}

export { createSquare2 };
