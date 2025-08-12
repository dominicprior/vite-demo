// Lights and environment maps.

import { DirectionalLight, MeshStandardMaterial,
    SRGBColorSpace, Texture, Mesh, Object3D,
} from '../../../three/threebuild/three_module.js';
import Resources from '../utils/resources.js';
import Utils from '../utils/utils.js';

export default class Environment {
    resources: Resources;
    utils: Utils;
    // @ts-ignore: no initializer
    sunlight: DirectionalLight;
    intensity: number = 0.4;
    // @ts-ignore: no initializer
    texture: Texture;
    // @ts-ignore: no initializer
    updateMaterial: () => void;

    constructor(resources: Resources, utils: Utils) {
        this.resources = resources;
        this.utils = utils;
        this.setSunlight();
        this.setEnvironmentMap();
    }

    setSunlight() {
        this.sunlight = new DirectionalLight(0xffffff, 1);
        this.sunlight.position.set(15, 40, 7);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.mapSize.width = 256;
        this.sunlight.shadow.mapSize.height = 256;
        this.sunlight.shadow.camera.top    =  10;
        this.sunlight.shadow.camera.bottom = -10;
        this.sunlight.shadow.camera.left   = -10;
        this.sunlight.shadow.camera.right  =  10;
        this.utils.game.scene.add(this.sunlight);
    }

    setEnvironmentMap() {
        this.texture = this.resources.items.environmentMapTexture;
        this.texture.colorSpace = SRGBColorSpace;
        this.utils.game.scene.environment = this.texture;

        this.updateMaterial = () => {
            this.utils.game.scene.traverse((child: Object3D) => {
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

        this.utils.debug.gui.add(this, 'intensity', 0, 2, 0.01).name('Environment Map Intensity')
            .onChange(
                // () => { this.environmentMap.updateMaterial(); }
                this.updateMaterial  // not needed: .bind(this.environmentMap)  // bind the method to the environmentMap context
            );
    }
}
