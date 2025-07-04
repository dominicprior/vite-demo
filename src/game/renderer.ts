import {
    PCFSoftShadowMap,
    Scene, WebGLRenderer,
} from '../../three/threebuild/three_module.js';
import Game from './game.js';
import type Sizes from './utils/sizes.js';
import type Camera from './camera.js';
export default class Renderer {
    game: Game;
    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    scene: Scene;
    camera: Camera
    // @ts-ignore: no initializer
    instance: WebGLRenderer;

    constructor(game: Game) {
        this.game = game;
        this.canvas = game.canvas;
        this.sizes = game.sizes;
        this.scene = game.scene;
        this.camera = game.camera;
        this.setInstance();
    }

    setInstance() {
        this.instance = new WebGLRenderer({ canvas: this.canvas! });  // Note the non-null assertion operator '!'
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFSoftShadowMap;
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}