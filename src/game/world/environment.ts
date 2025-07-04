import { Color
, Scene, DirectionalLight,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';

export default class Environment {
    game: Game;
    scene: Scene;
    // @ts-ignore: no initializer
    sunlight: DirectionalLight;
     constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.setSunlight();
        console.log('Environment initialized');
        // Initialize environment settings or properties here
    }

    setSunlight() {
        this.sunlight = new DirectionalLight(0xffffff, 1);
        this.sunlight.position.set(10, 10, 10);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.width = 1024;
        this.sunlight.shadow.mapSize.height = 1024;
        this.scene.add(this.sunlight);
    }

    // Example method to set the background color of the scene
    setBackgroundColor(color: string) {
        // Assuming `this.scene` is available in the context
        this.scene.background = new Color(color);
    }

    // Additional methods for environment management can be added here
}