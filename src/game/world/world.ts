import {
    Scene, Mesh, BoxGeometry, MeshStandardMaterial, Color,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
import Environment from './environment.js';
import Resources from '../utils/resources.js';

export default class World {
    game: Game;
    scene: Scene;
    // @ts-ignore: no initializer
    environment: Environment;
    resources: Resources;

    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.resources = game.resources;

        // this.scene.background = new Color('skyblue');
        const testMesh = new Mesh(
            new BoxGeometry(4, 4, 4,10,10,10),
            new MeshStandardMaterial({ color: 0xffffff })
        );
        this.scene.add(testMesh);
        this.resources.on('ready', () => {
            console.log('Resources are ready');
            this.environment = new Environment(game);
            // this.environment.setBackgroundColor('pink');
        });
    }
}