import {
    Vector2,
} from '../../../three/threebuild/three_module.js';

export type Sign = -1 | 0 | 1;

export function rot90(v: Vector2): Vector2 {
    return new Vector2(-v.y, v.x);
}
