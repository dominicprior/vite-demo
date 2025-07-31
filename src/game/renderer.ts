import {
    // PCFSoftShadowMap,
    Scene, WebGLRenderer, WebGLRenderTarget, OrthographicCamera,
    Vector3, MeshBasicMaterial, PlaneGeometry, Mesh, BackSide,
} from '../../three/threebuild/three_module.js';
import Player from './player.js';
import type Sizes from './utils/sizes.js';
import View from './view.js';
import Keyboard from './utils/keyboard.js';

export default class Renderer {
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: Scene;
    skyScene: Scene;
    skyCamera: OrthographicCamera;
    player: Player;
    keyboard: Keyboard;
    views: Array<View> = [];
    rearViewVisible: boolean = true;
    instance: WebGLRenderer;

    constructor(canvas: HTMLCanvasElement,
                sizes: Sizes, scene: Scene, skyScene: Scene, player: Player, keyboard: Keyboard) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = scene;
        this.skyScene = skyScene;
        this.player = player;
        this.keyboard = keyboard;
        this.views.push(new View(this.sizes, 1.0, 95,
                                 {x: 0, y: 0, w: 1, h: 1},
                                 0, false, keyboard));
        const k = 0.16;
        this.views.push(new View(this.sizes, 1.0, 95,
                                {x: 0.5 - k / 2, y: 0.99 - k, w: k, h: k},
                                Math.PI, true, keyboard));
        this.instance = new WebGLRenderer({
            canvas: this.canvas!,
            antialias: true,
        });
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.skyCamera = new OrthographicCamera();
        this.skyCamera.position.z = 2;
        window.addEventListener('keydown', (event) => { 
            if (event.key === 'r')
                this.rearViewVisible = !this.rearViewVisible;
        });
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        for (const view of this.views) {
            view.resize();
        }
    }

    redraw() {
        for (const view of this.views) {
            view.update(this.player);
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
                this.drawSkyAndScene(view);
            }
        }
    }

    drawSkyAndScene(view: View) {
                this.instance.autoClear = true;
                this.redrawSky();
                this.instance.autoClear = false;
                this.instance.render(this.scene, view.camera);
    }

    drawMirrored(view: View) {
        // Render the scene into a buffer.
        const renderTarget = new WebGLRenderTarget(view.widthInPixels(),
                                                   view.heightInPixels());
        renderTarget.samples = 4;
        this.instance.setRenderTarget(renderTarget);
        this.drawSkyAndScene(view);
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
        const viewport = view.viewport();
        this.instance.setViewport(viewport);
        this.instance.setScissor(viewport);
        this.instance.setScissorTest(view.port.w !== 1 || view.port.h !== 1);
        this.instance.render(orthoScene, orthoCamera);
    }

    redrawSky() {
        this.instance.render(this.skyScene, this.skyCamera);
    }
}

// currentViewport is Viewport multiplied by window.devicePixelRatio
// https://discourse.threejs.org/t/using-viewport-with-rendertarget/42081/1

// These views were surprisingly unintuitive:
// this.views.push(new View(this.sizes, 1.0, 55,  0,   0,  0.1, 0.2,   Math.PI * 0.75));
// this.views.push(new View(this.sizes, 1.0, 55,  0.9, 0,  0.1, 0.2, - Math.PI * 0.75));

// alpha: true,  stops Three.js making the whole canvas opaque:
// https://threejs.org/manual/#en/tips#transparent-canvas

// this.instance.shadowMap.enabled = true;
// this.instance.shadowMap.type = PCFSoftShadowMap;
