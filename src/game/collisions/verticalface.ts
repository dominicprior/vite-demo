import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type {
    Player, Collision,
} from '../utils/types.js';
import {
    noCollision, rot90,
} from '../utils/types.js';

export default class VerticalFace {
    a: Vector2;
    b: Vector2;
    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }
    firstCollision(player: Player): Collision {
        const v = player.velocity;
        const bMinusA = this.b.clone().sub(this.a);
        const normal = rot90(bMinusA).normalize();
        const vDotNormal = v.dot(normal);
        if (vDotNormal >= 0) {
            return noCollision;  // facing away
        }
        const u = rot90(v);
        const denom =  bMinusA.dot(u);
        if (denom === 0) {
            return noCollision;  // parallel
        }
        const normalTimesRad = normal.clone().multiplyScalar(player.radius);
        const a = this.a.clone().add(normalTimesRad);
        const playerMinusA = player.pos.clone().sub(a)
        const numer = playerMinusA.dot(u);
        const μ = numer / denom;
        if (μ >= 1 || μ <= 0) {
            return noCollision;  // misses
        }
        const collisionPos = bMinusA.clone().multiplyScalar(μ).add(a);
        const collisionT = - playerMinusA.dot(normal) / vDotNormal;
        const newVelocity = bMinusA.clone().multiplyScalar(
                v.dot(bMinusA) / bMinusA.lengthSq())
        return { t: collisionT, pos: collisionPos, newVelocity: newVelocity };
    }
}
