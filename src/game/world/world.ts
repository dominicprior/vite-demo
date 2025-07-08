import {
    Scene,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
import Environment from './environment.js';
import Resources from '../utils/resources.js';
import Floor from './floor.js';
import Cubes from './cubes.js';
import Debug from '../utils/debug.js';

export default class World {
    game: Game;
    scene: Scene;
    // @ts-ignore: no initializer
    floor: Floor;
    // @ts-ignore: no initializer
    cubes: Cubes;
    debug: Debug;
    // @ts-ignore: no initializer
    environment: Environment;
    resources: Resources;

    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.resources = game.resources;
        this.debug = game.debug;

        this.debug.gui.addFolder('World');

        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.environment = new Environment(game);
            this.floor = new Floor(game);
            this.cubes = new Cubes(game);
            // this.environment.setBackgroundColor('skyblue');
        });
    }

    update() {
        // if (this.fox) {  // if the fox is loaded
        //     this.fox.update();
        // }
    }
}