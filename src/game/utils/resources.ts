import {
    TextureLoader, CubeTextureLoader,
} from '../../../three/threebuild/three_module.js';
import EventEmitter from "./eventemitter.js";

export default class Resources extends EventEmitter {
    sources: Array<{ name: string, type: string, path: string | string[] }>;
    items: { [key: string]: any };
    toLoad: number;
    loaded: number;
    // @ts-ignore: no initializer.
    loaders: { [key: string]: any };
    constructor(sources: Array<{ name: string, type: string, path: string | string[] }>) {
        super();
        this.sources = sources;
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;
        this.setLoaders();
        this.startLoading();
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
                        console.log(`Loaded texture: ${source.name}`);
                        // this.sourceLoaded(source.name, file);
                    }
                );
            } else if (source.type === 'cubeTexture') {
                console.log('resources.ts: ', source);
                // this.loaders.cubeTextureLoader.path = '/static';
                this.loaders.cubeTextureLoader.load(
                    source.path as string[],
                    (file: any) => {
                        // this.sourceLoaded(source.name, file);
                        console.log(`Loaded cube texture: ${source.name}`);
                    },
                    undefined,
                    (error: any) => {
                        console.error(`Errorz loading cube texture: ${source.name}`, error);
                    }
                );
            }
        }
    }
}
