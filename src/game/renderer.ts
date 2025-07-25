import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer,
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
        this.views.push(new View(this.sizes, 1.0, 75));
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
        // this.instance.setScissorTest(true);           // crops the picture
        // this.instance.setScissor(50, 50, 100, 300);   // crops the picture
        // this.instance.render(this.scene, this.view.instance);

        // this.instance.setScissorTest(true);           // crops the picture
        // this.instance.setScissor(250, 50, 100, 300);  // crops the picture
        // this.instance.render(this.scene, this.view.instance);

        // this.instance.setScissorTest(true);            // crops the picture
        // this.instance.setScissor( 550, 150, 100, 100); // crops the picture
        // this.instance.setViewport(550, 150, 100, 100); // shrinks the picture (and squashes it)
        // this.instance.render(this.scene, this.view.instance);
        for (const view of this.views) {
            view.update(this.player);
            this.instance.render(this.scene, view.instance);
        }
    }
}

// currentViewport is Viewport multiplied by window.devicePixelRatio - https://discourse.threejs.org/t/using-viewport-with-rendertarget/42081/1
