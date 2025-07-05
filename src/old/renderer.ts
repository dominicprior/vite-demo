import {
    WebGLRenderer,
    BasicShadowMap
} from '../../three/threebuild/three_module.js';

function createRenderer(container: Element) {
    const renderer = new WebGLRenderer({
        antialias: true,
        canvas: container,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = BasicShadowMap;
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setPixelRatio(window.devicePixelRatio);  // from https://discoverthreejs.com/book/first-steps/first-scene/
    return renderer;
}

export { createRenderer };
