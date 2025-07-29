import { Scene, DirectionalLight, MeshStandardMaterial,
    SRGBColorSpace, Texture, Mesh, Object3D, DataTexture,
    RGBAFormat, LinearFilter,
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

    setBackgroundColor() {  // not used
        // this.scene.background = new Color('skyblue');

        // Create a simple 2x2 DataTexture
        const width = 2;
        const height = 2;
        const size = width * height;
        const data = new Uint8Array( size * 4 ); // RGBA format

        // Fill with 4 colors (R, G, B, White)
        data.set([
            255, 0, 0, 255,    // Red
            0, 255, 0, 255,    // Green
            0, 0, 255, 255,    // Blue
            255, 255, 255, 255, // White
        ]);

        const texture = new DataTexture(data, width, height, RGBAFormat);
        texture.magFilter = LinearFilter;
        texture.needsUpdate = true;

        // Set the texture as the scene background
        this.scene.background = texture;
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