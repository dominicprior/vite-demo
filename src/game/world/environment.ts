import { Color
, Scene, DirectionalLight, MeshStandardMaterial,
SRGBColorSpace,
} from '../../../three/threebuild/three_module.js';
import Game from '../game.js';
import Resources from '../utils/resources.js';
import Debug from '../utils/debug.js';

export default class Environment {
    game: Game;
    scene: Scene;
    debug: Debug;
    // @ts-ignore: no initializer
    sunlight: DirectionalLight;
    resources: Resources;
    environmentMap: any;

     constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;
        this.resources = game.resources;
        this.debug = game.debug;
        this.setSunlight();
        this.setEnvironmentMap();
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

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = SRGBColorSpace;
        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child.isMesh && child.material instanceof MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        }
        this.environmentMap.updateMaterial();

        if (this.debug.active) {  // after the "if" Copilot suggested the whole block!
            this.debug.gui.add(this.environmentMap, 'intensity', 0, 2, 0.01).name('Environment Map Intensity')
                .onChange(
                    // () => { this.environmentMap.updateMaterial(); }
                    this.environmentMap.updateMaterial  // not needed: .bind(this.environmentMap)  // bind the method to the environmentMap context
                );
        }
    }
}