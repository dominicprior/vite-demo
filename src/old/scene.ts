import { Color, Scene } from '../../three/threebuild/three_module.js';

function createScene() {
    const scene = new Scene();
    scene.background = new Color('skyblue');
    return scene;
}

export { createScene };
