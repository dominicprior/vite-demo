import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer, Vector4,
} from '../../three/threebuild/three_module.js';
import Player from './player.js';
import type Sizes from './utils/sizes.js';
import View from './view.js';

export default class Renderer {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: Scene;
    player: Player;
    views: Array<View> = [];
    // @ts-ignore: no initializer
    instance: WebGLRenderer;

    constructor(canvas: HTMLCanvasElement,
                sizes: Sizes, scene: Scene, player: Player) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = scene;
        this.player = player;
        this.views.push(new View(this.sizes, 1.0, 55,  0,   0,  1,   1,   0));
        // Unintuitive views
        // this.views.push(new View(this.sizes, 1.0, 55,  0,   0,  0.1, 0.2,   Math.PI * 0.75));
        // this.views.push(new View(this.sizes, 1.0, 55,  0.9, 0,  0.1, 0.2, - Math.PI * 0.75));
        this.views.push(new View(this.sizes, 1.0, 55,  0.45, 0,  0.1, 0.1, Math.PI));
        this.setInstance();
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas!,
            // alpha: true,  // https://threejs.org/manual/#en/tips#transparent-canvas - stops Three.js making the whole canvas opaque
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
        for (const view of this.views) {
            view.resize();
        }
}

    update() {
        for (const view of this.views) {
            view.update(this.player);
            const v = new Vector4(view.x * this.sizes.width,
                                  view.y * this.sizes.height,
                                  view.w * this.sizes.width,
                                  view.h * this.sizes.height);
            this.instance.setViewport(v);
            this.instance.setScissor(v);
            this.instance.setScissorTest(view.w !== 1 || view.h !== 1);

            this.instance.render(this.scene, view.camera);
        }
    }
}

// currentViewport is Viewport multiplied by window.devicePixelRatio
// https://discourse.threejs.org/t/using-viewport-with-rendertarget/42081/1
