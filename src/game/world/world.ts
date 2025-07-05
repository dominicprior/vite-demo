import {
    Scene, Mesh, BoxGeometry, MeshStandardMaterial, Color,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
import Environment from './environment.js';
export default class World {
    game: Game;
    scene: Scene;
    environment: Environment;
    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;

        this.scene.background = new Color('skyblue');
        const testMesh = new Mesh(
            new BoxGeometry(4, 4, 4,10,10,10),
            new MeshStandardMaterial({ color: 0xff0000 })
        );
        this.scene.add(testMesh);
        this.environment = new Environment(game);
        this.environment.setBackgroundColor('pink');  // Set the background color of the scene
    }
}