import { Color, Scene, DirectionalLight, MeshStandardMaterial,
    SRGBColorSpace, Texture, Mesh, Object3D,
} from '../../../three/threebuild/three_module.js';
import Resources from '../utils/resources.js';
import Debug from '../utils/debug.js';

export default class Environment {
    scene: Scene;
    resources: Resources;
    debug: Debug;
    // @ts-ignore: no initializer
    sunlight: DirectionalLight;
    intensity: number = 0.4;
    // @ts-ignore: no initializer
    texture: Texture;
    // @ts-ignore: no initializer
    updateMaterial: () => void;

     constructor(scene: Scene, resources: Resources, debug: Debug) {
        this.scene = scene;
        this.resources = resources;
        this.debug = debug;
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

    setBackgroundColor(color: string) {
        this.scene.background = new Color(color);
    }

    setEnvironmentMap() {
        this.texture = this.resources.items.environmentMapTexture;
        this.texture.colorSpace = SRGBColorSpace;
        this.scene.environment = this.texture;

        this.updateMaterial = () => {
            this.scene.traverse((child: Object3D) => {
                // @ts-ignore: property does not exist
                if (child.isMesh && child.material instanceof MeshStandardMaterial) {
                    const material = (child as Mesh).material as MeshStandardMaterial;
                    material.envMap = this.texture;
                    material.envMapIntensity = this.intensity;
                    material.needsUpdate = true;
                }
            });
        }
        this.updateMaterial();

        this.debug.gui.add(this, 'intensity', 0, 2, 0.01).name('Environment Map Intensity')
            .onChange(
                // () => { this.environmentMap.updateMaterial(); }
                this.updateMaterial  // not needed: .bind(this.environmentMap)  // bind the method to the environmentMap context
            );
    }
}