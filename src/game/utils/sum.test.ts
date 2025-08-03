import {
    Vector2, Vector3,
} from '../../../three/threebuild/three_module.js';
import { expect, test } from 'vitest';
import { sum } from './sum.js';
import type {
    Collision,
} from '../utils/types.js';
import VerticalFace from '../collisions/verticalface.js';
import Player from '../player.js';

test('simple sum', () => {
    expect(sum(1, 2)).toBe(3);
});

test('VerticalFace', () => {
    const face = new VerticalFace(
            new Vector2(10, 9), new Vector2(14, 9));
    // @ts-ignore
    const player: Player = {
            pos: new Vector3(9, 0, 13),
            radius: 1,
            velocity: () => new Vector2(0.2, -0.3),
        };
    const collision: Collision = face.firstCollision(player);
    expect(collision.t).toBe(10);
    expect(collision.pos.x).toBe(11);
    expect(collision.pos.y).toBe(10);
    expect(collision.skidVelocity.x).toBe(0.2);
    expect(collision.skidVelocity.y).toBe(0);
});
