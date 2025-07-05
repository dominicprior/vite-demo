import {
    Scene, Mesh, BoxGeometry, MeshStandardMaterial,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
import Environment from './environment.js';
import Resources from '../utils/resources.js';
import Debug from '../utils/debug.js';

export default class World {
    game: Game;
    scene: Scene;
    debug: Debug;
    // @ts-ignore: no initializer
    environment: Environment;
    resources: Resources;

    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.resources = game.resources;
        this.debug = game.debug;

        if (this.debug.active) {
            this.debug.gui.addFolder('World');
        }

        // this.scene.background = new Color('skyblue');
        const testMesh = new Mesh(
            new BoxGeometry(4, 4, 4,10,10,10),
            new MeshStandardMaterial({ color: 0xffffff })
        );

        if (this.debug.active) {
            this.debug.gui.add(testMesh.position, 'y', -2, 2, 0.01).name('box Y');
        }

        this.scene.add(testMesh);
        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.environment = new Environment(game);
            // this.environment.setBackgroundColor('pink');
        });
    }

    update() {
        // if (this.fox) {  // if the fox is loaded
        //     this.fox.update();
        // }
    }
}