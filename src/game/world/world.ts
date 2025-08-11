// Simply invokes various constructors.

import {
    Scene,
} from '../../../three/threebuild/three_module.js';

import Environment from './environment.js';
import Resources from '../utils/resources.js';
import Sky from './sky.js';
import Floor from './floor.js';
import Mirror from './mirror.js';
import Cubes from './cubes.js';
import Moon from './moon.js';
import CrossHairs from './crosshairs.js';
import Utils from '../utils/utils.js';
import Player from '../player.js';
import Brep from '../brep.js';

export default class World {
    scene: Scene;
    skyScene: Scene;
    brep: Brep;
    // @ts-ignore: no initializer
    floor: Floor;
    // @ts-ignore: no initializer
    mirror: Mirror;
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

    constructor(scene: Scene, skyScene: Scene, resources: Resources, utils: Utils) {
        this.scene = scene;
        this.skyScene = skyScene;
        this.brep = new Brep();
        this.resources = resources;
        this.utils = utils;
        this.mirror = new Mirror();

        this.utils.debug.gui.addFolder('World');

        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.environment = new Environment(this.scene, this.resources, this.utils);
            this.sky = new Sky(skyScene, this.utils);
            this.floor = new Floor(this.scene, this.utils);
            this.cubes = new Cubes(this.scene, this.brep, this.utils);
            this.moon = new Moon(this.scene, this.utils);
            this.crosshairs = new CrossHairs(this.scene, this.utils);
            // this.scene.background = new Color('green');
        });
    }

    update(player: Player) {
        // if (this.fox) {  // if the fox is loaded
        //     this.fox.update();
        // }
        this.crosshairs.update(player);
    }
}
