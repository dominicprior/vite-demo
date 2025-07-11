import {
    Vector2,
} from '../../../three/threebuild/three_module.js';

export type Sign = -1 | 0 | 1;

export interface Player {
    pos: Vector2;
    radius: number;
    velocity: Vector2;
};

export interface Collision {
    t: number;
    pos: Vector2;
    newVelocity: Vector2;
};
