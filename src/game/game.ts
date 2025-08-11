import {
    Scene, Mesh,
} from '../../three/threebuild/three_module.js';
import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Renderer from './renderer.js';
import World from './world/world.js';
import Resources from './utils/resources.js';
import Debug from './utils/debug.js';
import sources from './sources.js';
import Keyboard from './utils/keyboard.js';
import Player from './player.js';
import Stats from './utils/stats.js';
import Utils from './utils/utils.js';

export default class Game {
    utils: Utils;
    scene: Scene;
    skyScene: Scene;
    resources: Resources;
    player: Player;
    renderer: Renderer;
    stats: any;
    world: World;
    ready: boolean = false;
    doneARender: boolean = false;
    stopAfterOneRender: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        Object.defineProperty(window, 'a', { value: this,  writable: true, });
        Object.defineProperty(window, 'pr', { value: console.log,  writable: true, });
        this.utils = new Utils(new Debug, this, new Keyboard, new Sizes, new Time(this));
        this.scene = new Scene();
        this.skyScene = new Scene();
        this.resources = new Resources(sources);
        this.world = new World(this.scene, this.skyScene, this.resources, this.utils);
        this.player = new Player(this.utils);
        this.renderer = new Renderer(canvas, this.scene, this.skyScene,
            this.player, this.world.mirror, this.utils);
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        const camera = this.renderer.views[0].camera;
        this.utils.debug.gui.add(camera, 'fov', 10, 120, 1).name('fov')
                .onChange(() => { camera.updateProjectionMatrix() })

        this.utils.sizes.on('resize', this.resize.bind(this));  // See note 1.

        this.resources.on('ready', () => {
            this.ready = true;
        });
    }

    respondToTick() {
        if (this.ready) {
            if (this.doneARender && this.stopAfterOneRender) {
                // we're not animating any more
            }
            else {
                this.stats.begin();
                this.update();
                this.stats.end();
                this.doneARender = true;
            }
        }
    }

    stop() {  // We can call this from anywhere with `a.stop()` because
              // we've defined `window.a` to be this `Game` object.
        this.doneARender = true;
        this.stopAfterOneRender = true;
    }

    resize() {
        this.renderer.resize();
    }

    update() {
        this.player.update(this.world.brep);
        this.world.update(this.player);
        this.renderer.redraw();
    }

    destroy() {  // I'm not sure if this is right, but it's interesting anyway.
        this.utils.sizes.off('resize');
        this.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });
        this.renderer.instance.dispose();
        this.utils.debug.gui.destroy();
    }
}

// Note 1:
// The 'bind' ensures 'this' refers to the Game instance instead of the Sizes instance.
// The alternative is:
//     this.sizes.on('resize', () => {  // This is an alternative way to bind 'this' using an arrow function.
//         this.resize();
//     })
