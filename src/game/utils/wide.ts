import {
    PerspectiveCamera,
} from '../../../three/threebuild/three_module.js';

export default class Wide extends PerspectiveCamera {
    bend: number;
    isWide: boolean;

    constructor( fov = 50, aspect = 1, near = 0.1, far = 2000,
            bend = 1, ) {
		super(fov, aspect, near, far);
        this.bend = bend;
        this.isWide = true;
    }
}
