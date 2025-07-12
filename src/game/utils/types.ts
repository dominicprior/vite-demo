import {
    Vector2,
} from '../../../three/threebuild/three_module.js';

export type Sign = -1 | 0 | 1;

export interface Player2D {
    pos: Vector2;
    radius: number;
    velocity: Vector2;
};

export interface Collision {
    t: number;
    pos: Vector2;
    newVelocity: Vector2;
};

export const noCollision = {
    t: 1e9, pos: new Vector2(), newVelocity: new Vector2() };

export function rot90(v: Vector2): Vector2 {
    return new Vector2(-v.y, v.x);
}
