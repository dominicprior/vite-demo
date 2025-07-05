import { DirectionalLight } from '../../three/threebuild/three_module.js';

function createSunlight() {
    const sunlight = new DirectionalLight('white', 2);

    sunlight.position.set(100, 100, 100);
    sunlight.castShadow = true;
    sunlight.shadow.camera.top = 50;
    sunlight.shadow.camera.bottom = - 50;
    sunlight.shadow.camera.left = - 50;
    sunlight.shadow.camera.right = 50;
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 1000;
    sunlight.shadow.mapSize.width = 16;
    sunlight.shadow.mapSize.height = 16;

    sunlight.name = 'sunlight';
    return sunlight;
}

export { createSunlight };
