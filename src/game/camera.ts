import {
    PerspectiveCamera,
    Scene, 
} from '../../three/threebuild/three_module.js';
import { OrbitControls } from '../../three/threebuild/OrbitControls.js';

import Game from './game.js';
import Sizes from "./utils/sizes.js";

export default class Camera {
    game: Game;
    sizes: Sizes;
    scene: Scene;
    canvas: HTMLCanvasElement | null;
    // @ts-ignore: no initializer
    instance: PerspectiveCamera;
    // @ts-ignore: no initializer
    controls: OrbitControls;
    constructor(game: Game) {
        this.game = game;
        this.sizes = game.sizes;
        this.scene = game.scene;
        this.canvas = game.canvas;
        this.setInstance();
        this.setOrbitControls();
    }

    setInstance() {
        this.instance = new PerspectiveCamera(
                75, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas!);  // note the non-null assertion operator '!'
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update();
    }
}
