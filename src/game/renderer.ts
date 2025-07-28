import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer, Vector4, WebGLRenderTarget, OrthographicCamera,
    Vector3, MeshBasicMaterial, PlaneGeometry, Mesh, BackSide,
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
        this.views.push(new View(this.sizes, 1.0, -1.0, 55,  0,   0,  1,   1,   0, false));
        // Unintuitive views
        // this.views.push(new View(this.sizes, 1.0, 55,  0,   0,  0.1, 0.2,   Math.PI * 0.75));
        // this.views.push(new View(this.sizes, 1.0, 55,  0.9, 0,  0.1, 0.2, - Math.PI * 0.75));
        const k = 0.16;
        this.views.push(new View(this.sizes, 1.0, 1.0, 55,  0.5 - k/2, 0.99-k,  k, k, Math.PI, true));
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

            if (view.mirrored) {
                this.drawMirrored(view);
            }
            else {
                this.instance.setViewport(v);
                this.instance.setScissor(v);
                this.instance.setScissorTest(view.w !== 1 || view.h !== 1);
                this.instance.render(this.scene, view.camera);
            }
        }
    }

    drawMirrored(view: View) {
        // Render the scene into a buffer.
        const renderTarget = new WebGLRenderTarget(view.w * this.sizes.width,
                                                   view.h * this.sizes.height);
        renderTarget.samples = 4;
        this.instance.setRenderTarget(renderTarget);
        this.instance.render(this.scene, view.camera);
        this.instance.setRenderTarget(null);

        // Set up an ortho camera (mirroring by looking backwards).
        const orthoCamera = new OrthographicCamera(-1, 1,  1, -1,  0.1, 10 );
        orthoCamera.position.set(0, 0, -2);
        orthoCamera.lookAt(new Vector3);

        // Create a scene containing a plane textured from the buffer.
        const orthoScene = new Scene();
        const material = new MeshBasicMaterial({
                map: renderTarget.texture,
                side: BackSide,
        });
        const plane = new Mesh(new PlaneGeometry(2, 2), material);
        orthoScene.add(plane);

        // Add a rim.
        const rimMaterial = new MeshBasicMaterial({
                color: 'white',
                side: BackSide,
        });
        const wideGeom = new PlaneGeometry(1.99, .01);
        orthoScene.add(new Mesh(wideGeom, rimMaterial).translateZ(-0.1).translateY(-1));
        orthoScene.add(new Mesh(wideGeom, rimMaterial).translateZ(-0.1).translateY(1));
        const tallGeom = new PlaneGeometry(.005, 1.99);
        orthoScene.add(new Mesh(tallGeom, rimMaterial).translateZ(-0.1).translateX(-1));
        orthoScene.add(new Mesh(tallGeom, rimMaterial).translateZ(-0.1).translateX(1));

        // Render the mirror.
        const v = new Vector4(view.x * this.sizes.width,
                              view.y * this.sizes.height,
                              view.w * this.sizes.width,
                              view.h * this.sizes.height);
        this.instance.setViewport(v);
        this.instance.setScissor(v);
        this.instance.setScissorTest(view.w !== 1 || view.h !== 1);
        this.instance.render(orthoScene, orthoCamera);
    }
}

// currentViewport is Viewport multiplied by window.devicePixelRatio
// https://discourse.threejs.org/t/using-viewport-with-rendertarget/42081/1
