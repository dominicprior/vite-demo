// Simply the constructors for the game geometry to add themselves
// to the scene.

import Environment from './environment.js';
import Resources from '../utils/resources.js';
import Sky from './sky.js';
import Floor from './floor.js';
import Cubes from './cubes.js';
import Moon from './moon.js';
import CrossHairs from './crosshairs.js';
import Utils from '../utils/utils.js';
import Player from '../player.js';
import Brep from '../brep.js';

export default class World {
    brep: Brep;
    // @ts-ignore: no initializer
    floor: Floor;
    // @ts-ignore: no initializer
    sky: Sky;
    // @ts-ignore: no initializer
    cubes: Cubes;
    // @ts-ignore: no initializer
    moon: Moon;
    // @ts-ignore: no initializer
    crosshairs: CrossHairs;
    utils: Utils;
    // @ts-ignore: no initializer
    environment: Environment;
    resources: Resources;

    constructor(resources: Resources, utils: Utils) {
        this.brep = new Brep();
        this.resources = resources;
        this.utils = utils;

        this.utils.debug.gui.addFolder('World');
    }

    respondToResourcesReady() {
        console.log('Resources are ready');
        const scene    = this.utils.game.scene;
        const skyScene = this.utils.game.skyScene;
        this.environment = new Environment(this.utils);
        this.sky = new Sky(skyScene, this.utils);
        this.floor = new Floor(scene, this.utils);
        this.cubes = new Cubes(scene, this.brep, this.utils);
        this.moon = new Moon(scene, this.utils);
        this.crosshairs = new CrossHairs(scene, this.utils);
    }

    update(player: Player) {
        // if (this.fox) {  // if the fox is loaded
        //     this.fox.update();
        // }
        this.crosshairs.update(player);
    }
}
