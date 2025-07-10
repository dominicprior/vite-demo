import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type {
    Player, Collision,
} from '../utils/types.js';

const noCollision = {
    t: 1e9, pos: new Vector2(), newVelocity: new Vector2() };

function rot90(v: Vector2): Vector2 {
    return new Vector2(v.y, -v.x);
}

export class VerticalFace {
    a: Vector2;
    b: Vector2;
    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }
    firstCollision(player: Player): Collision {
        const bMinusA = this.b.clone().sub(this.a);
        const normal = rot90(bMinusA).normalize();
        const normalTimesRad = normal.clone().multiplyScalar(player.radius);
        const a = this.a.clone().add(normalTimesRad);
        const v = player.velocity;
        if (v.dot(normal) >= 0) {
            return noCollision;
        }
        const numer = player.pos.clone().sub(a).dot(player.u);
        const denom =  bMinusA.dot(player.u);
        const μ = numer / denom;
        if (μ >= 1 || μ <= 0) {   // epsilon ?
            return noCollision;
        }
        const collisionPos =
                bMinusA.clone().multiplyScalar(μ).add(a);
        const collisionT = this.a.clone().sub(player.pos).dot(normal) /
                v.dot(normal);
        const newVelocity = bMinusA.clone().multiplyScalar(
                v.dot(bMinusA) / bMinusA.lengthSq())
        return { t: collisionT, pos: collisionPos, newVelocity: newVelocity };
    }
}
