import {
    Scene, Mesh, MeshBasicMaterial,
    PlaneGeometry, DataTexture, RGBAFormat, LinearFilter,
} from '../../../three/threebuild/three_module.js';
import Debug from '../utils/debug.js';

export default class Sky {
    debug: Debug;
    skyMesh: Mesh;
    // @ts-ignore
    seaMesh: Mesh;

    constructor(skyScene: Scene, debug: Debug) {
        this.debug = debug;
        const drawingTheSea = false;
        const skyGeometry = new PlaneGeometry(4, drawingTheSea ? 2: 4);

        const width = 1;
        const height = 2;
        const size = width * height;
        const colours = new Uint8Array( size * 4 );
        colours.set([
            55, 155, 255, 255, // pale sky blue
            0, 0, 120, 255,    // Blue
        ]);

        const texture = new DataTexture(colours, width, height, RGBAFormat);
        texture.magFilter = LinearFilter;
        texture.needsUpdate = true;

        const skyMaterial = new MeshBasicMaterial({ map: texture, depthTest: false, });
        
        this.skyMesh = new Mesh(skyGeometry, skyMaterial).translateY(drawingTheSea ? 0.5: 0);
        this.skyMesh.name = 'sky';
        skyScene.add(this.skyMesh);
        if (drawingTheSea) {
            const seaGeometry = new PlaneGeometry(2, 1);
            const seaMaterial = new MeshBasicMaterial({ color: 'darkblue', depthTest: false, });
            this.seaMesh = new Mesh(seaGeometry, seaMaterial).translateY(-0.5);
            this.seaMesh.name = 'sea';
            skyScene.add(this.seaMesh);
        }
    }
}
