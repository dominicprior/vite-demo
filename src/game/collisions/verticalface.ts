import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type {
    Collision,
} from '../utils/types.js';
import {
    noCollision, rot90,
} from '../utils/types.js';
import Player from '../player.js';

export default class VerticalFace {
    a: Vector2;
    b: Vector2;

    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }

    firstCollision(player: Player): Collision {  // oops!  what about when we have gone past the face?

        const epsilon = 0.01;
        const pos = new Vector2(player.pos.x, player.pos.z);
        const v = player.velocity();
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
        const playerMinusA = pos.clone().sub(a);
        const playerMinusAdotN = playerMinusA.dot(normal);
        if (playerMinusAdotN < -epsilon) {  // gone past
            return noCollision;
        }
        const numer = playerMinusA.dot(u);
        const μ = numer / denom;
        if (μ >= 1 || μ <= 0) {
            return noCollision;  // missed
        }
        const collisionPos = bMinusA.clone().multiplyScalar(μ).add(a);
        const collisionT = - playerMinusAdotN / vDotNormal;
        const newVelocity = bMinusA.clone().multiplyScalar(
                v.dot(bMinusA) / bMinusA.lengthSq())
        return { t: collisionT, pos: collisionPos, newVelocity: newVelocity };
    }
}
