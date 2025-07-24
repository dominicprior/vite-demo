import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer,
} from '../../three/threebuild/three_module.js';
import type Sizes from './utils/sizes.js';
import type Camera from './camera.js';

export default class Renderer {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: Scene;
    camera: Camera;
    // @ts-ignore: no initializer
    instance: WebGLRenderer;

    constructor(canvas: HTMLCanvasElement,
                sizes: Sizes, scene: Scene, camera: Camera) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = scene;
        this.camera = camera;
        this.setInstance();
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas!,
            // alpha: true,  // https://threejs.org/manual/#en/tips#transparent-canvas - otherwise Three.js makes the whole canvas opaque
            antialias: true,
        });  // Note the non-null assertion operator '!'
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        // this.instance.shadowMap.enabled = true;
        // this.instance.shadowMap.type = PCFSoftShadowMap;
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        ////debugger;
        this.instance.render(this.scene, this.camera.instance);
        ////debugger;
    }
}