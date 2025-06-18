import { AmbientLight } from '../../three/threebuild/three_module.js';

function createAmbientLight() {
    const ambientLight = new AmbientLight(
        'white', // bright sky color
        0, // intensity
    );
    return ambientLight;
}

export { createAmbientLight };
