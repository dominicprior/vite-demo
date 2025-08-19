import {
    TextureLoader, CubeTextureLoader,
} from '../../../three/threebuild/three_module.js';
import Utils from './utils.js';

export default class Resources {
    sources: Array<{ name: string, type: string, path: string | string[] }>;
    items: { [key: string]: any };
    toLoad: number;
    loaded: number;
    // @ts-ignore: no initializer.
    loaders: { [key: string]: any };
    utils: Utils;

    constructor(sources: Array<{
                    name: string, type: string, path: string | string[]
                }>,
                utils: Utils) {
        this.sources = sources;
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.utils = utils;
        this.setLoaders();
        this.startLoading();
        if (sources.length === 0) {
            setTimeout(() => {
                this.utils.game.respondToReady();
                this.utils.game.world.respondToResourcesReady();
            }, 0);
        }
    }
    setLoaders() {
        this.loaders = {};
        // this.loaders.gltfLoader = new (window as any).THREE.GLTFLoader();
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
    }
    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path as string,
                    (file: any) => {
                        this.sourceLoaded(source.name, file);
                    }
                );
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path as string[],
                    (file: any) => {
                        this.sourceLoaded(source, file);
                    },
                    undefined,
                    (error: any) => {
                        console.error(`Error loading cube texture: ${source.name}`, error);
                    }
                );
            }
        }
    }
    sourceLoaded(source: any, file: any) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded === this.toLoad) {
            this.utils.game.respondToReady();
            this.utils.game.world.respondToResourcesReady();
        }
    }
}
