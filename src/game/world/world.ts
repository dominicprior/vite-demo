import {
    Scene, Mesh, BoxGeometry, MeshBasicMaterial
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
export default class World {
    game: Game;
    scene: Scene;
    constructor(game: Game) {
        console.log('World initialized');
        this.game = game;
        this.scene = game.scene;

        const testMesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 0xff0000 })
        );
        this.scene.add(testMesh);
    }
}