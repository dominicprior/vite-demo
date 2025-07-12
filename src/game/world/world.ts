import {
    Scene,
} from '../../../three/threebuild/three_module.js';

import type { Player, Collision, } from '../utils/types.js';
import Environment from './environment.js';
import Resources from '../utils/resources.js';
import Floor from './floor.js';
import Cubes from './cubes.js';
import Debug from '../utils/debug.js';

export default class World {
    scene: Scene;
    // @ts-ignore: no initializer
    floor: Floor;
    // @ts-ignore: no initializer
    cubes: Cubes;
    debug: Debug;
    // @ts-ignore: no initializer
    environment: Environment;
    resources: Resources;

    constructor(scene: Scene, resources: Resources, debug: Debug) {
        this.scene = scene;
        this.resources = resources;
        this.debug = debug;

        this.debug.gui.addFolder('World');

        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.environment = new Environment(this.scene, this.resources, this.debug);
            this.floor = new Floor(this.scene, this.debug);
            this.cubes = new Cubes(this.scene, this.debug);
            // this.environment.setBackgroundColor('skyblue');
        });
    }

    firstCollision(player: Player): Collision {
        return this.cubes.firstCollision(player);
    }

    update() {
        // if (this.fox) {  // if the fox is loaded
        //     this.fox.update();
        // }
    }
}