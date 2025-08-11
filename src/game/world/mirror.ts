// Initial set up for the mirror view.

import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer, WebGLRenderTarget, OrthographicCamera,
    Vector3, MeshBasicMaterial, PlaneGeometry, Mesh, BackSide,
} from '../../../three/threebuild/three_module.js';


export default class Mirror {
    orthoCamera: OrthographicCamera;

    constructor() {
        // Set up an ortho camera (mirroring by looking backwards).
        this.orthoCamera = new OrthographicCamera(-1, 1,  1, -1,  0.1, 10 );
        this.orthoCamera.position.set(0, 0, -2);
        this.orthoCamera.lookAt(new Vector3);
    }
}