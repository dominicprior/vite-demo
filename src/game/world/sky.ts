// Adds a blue gradient-filled PlaneGeometry (the sky) to the given skyScene.

// The PlaneGeometry is twice the size of the screen to crop it to the part
// of the texture that has linear interpolation.

// The sky has depthTest=false material, which also implicitly
// disables the depth write, which means the main scene will appear in front
// of the sky.

import {
    Scene, Mesh, MeshBasicMaterial,
    PlaneGeometry, DataTexture, RGBAFormat, LinearFilter,
} from '../../../three/threebuild/three_module.js';
import Utils from '../utils/utils.js';

export default class Sky {
    utils: Utils;
    skyMesh: Mesh;
    // @ts-ignore
    seaMesh: Mesh;

    constructor(skyScene: Scene, utils: Utils) {
        this.utils = utils;
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
