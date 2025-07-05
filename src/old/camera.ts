import { PerspectiveCamera } from '../../three/threebuild/three_module.js';

// let time = 0;

function createCamera() {
    const camera = new PerspectiveCamera(
        35, // fov = Field Of View
        1, // aspect ratio (dummy value)
        1, // near clipping plane
        10000, // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(250, 130, 1200);
    //   camera.tick = (delta) => {
    //     time += delta;
    //     camera.position.z = 10 + 2.4 * time;
    //   };
    camera.lookAt(0, 0, 0); // look at the origin
    return camera;
}

export { createCamera };
