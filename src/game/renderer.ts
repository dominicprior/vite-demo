// Redrawing the screen

import {
    PCFSoftShadowMap,
    Scene, WebGLRenderer, OrthographicCamera,
} from '../../three/threebuild/three_module.js';
import View from './view.js';
import Mirror from './mirror.js';
import type Utils from './utils/utils.js';

export default class Renderer {
    canvas: HTMLCanvasElement | null;
    scene: Scene;
    skyScene: Scene;
    skyCamera: OrthographicCamera;
    utils: Utils;
    views: Array<View> = [];
    mirror: Mirror;
    rearViewVisible: boolean = false;
    instance: WebGLRenderer;

    constructor(canvas: HTMLCanvasElement,
                scene: Scene, skyScene: Scene,
                utils: Utils) {
        this.canvas = canvas;
        this.scene = scene;
        this.skyScene = skyScene;
        this.utils = utils;
        const sizes = utils.sizes;
        this.views.push(new View(sizes, 1.0, 95,
                                 {x: 0, y: 0, w: 1, h: 1},
                                 0, false, utils));
        const k = 0.16;
        this.views.push(new View(sizes, 1.0, 95,
                                {x: 0.99 - k, y: 0.99 - k, w: k, h: k},
                                Math.PI, true, utils));
        this.mirror = new Mirror(this.views[1]);  // !
        this.instance = new WebGLRenderer({
            canvas: this.canvas!,
            antialias: true,
        });
        this.instance.setSize(sizes.width, sizes.height);
        this.instance.setPixelRatio(sizes.pixelRatio);
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFSoftShadowMap;
        this.skyCamera = new OrthographicCamera();
        this.skyCamera.position.z = 2;
        window.addEventListener('keydown', (event) => { 
            if (event.key === 'r')
                this.rearViewVisible = !this.rearViewVisible;
        });
    }

    resize() {
        this.instance.setSize(this.utils.sizes.width, this.utils.sizes.height);
        this.instance.setPixelRatio(this.utils.sizes.pixelRatio);
        for (const view of this.views) {
            view.resize();
        }
        this.mirror.resize(this.views[1]);
    }

    redraw() {
        for (const view of this.views) {
            view.update(this.utils.game.player.pos, this.utils.game.player.bearing);
            const viewport = view.viewport();
            this.instance.setViewport(viewport);
            this.instance.setScissor(viewport);
            this.instance.setScissorTest(view.port.w !== 1 || view.port.h !== 1);
            if (view.mirrored) {
                if (this.rearViewVisible) {
                    this.drawMirrored(view);
                }
            }
            else {
                this.drawBothScenes(view);
            }
        }
    }

    drawBothScenes(view: View) {
        this.instance.autoClear = true;
        this.instance.render(this.skyScene, this.skyCamera);
        this.instance.autoClear = false;
        this.instance.render(this.scene, view.camera);
    }

    drawMirrored(view: View) {
        // Render the scene into a buffer.
        this.instance.setRenderTarget(this.mirror.target);
        this.drawBothScenes(view);
        this.instance.setRenderTarget(null);

        // Render the mirror from the buffer.
        const viewport = view.viewport();
        this.instance.setViewport(viewport);
        this.instance.setScissor(viewport);
        this.instance.setScissorTest(view.port.w !== 1 || view.port.h !== 1);
        this.instance.render(this.mirror.orthoScene, this.mirror.orthoCamera);
    }
}

// currentViewport is Viewport multiplied by window.devicePixelRatio
// https://discourse.threejs.org/t/using-viewport-with-rendertarget/42081/1

// alpha: true,  stops Three.js making the whole canvas opaque:
// https://threejs.org/manual/#en/tips#transparent-canvas

