import {
    Scene, Mesh, MeshBasicMaterial,
    PlaneGeometry, DataTexture, RGBAFormat, LinearFilter,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';

export default class Sky {
    debug: Debug;
    mesh: Mesh;

    constructor(skyScene: Scene, debug: Debug) {
        this.debug = debug;
        const geometry = new PlaneGeometry(4, 4);

        const width = 1;
        const height = 2;
        const size = width * height;
        const colours = new Uint8Array( size * 4 );
        colours.set([
            55, 155, 255, 255, // pale sky blue
            0, 0, 255, 255,    // Blue
        ]);

        const texture = new DataTexture(colours, width, height, RGBAFormat);
        texture.magFilter = LinearFilter;
        texture.needsUpdate = true;

        const material = new MeshBasicMaterial({ map: texture, depthTest: false, });

        this.mesh = new Mesh(geometry, material);
        this.mesh.name = 'sky';
        skyScene.add(this.mesh);
    }
}
