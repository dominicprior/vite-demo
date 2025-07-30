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

    a: Vector2;    // The horiz positions (i.e. XZ) of the two ends.
    b: Vector2;

    constructor(a: Vector2, b: Vector2) {
        this.a = a;
        this.b = b;
    }

    firstCollision(player: Player): Collision {  // oops!  what about when we have gone past the face?

        const epsilon = 0.01;
        const pos = new Vector2(player.pos.x, player.pos.z);
        const v = player.velocity();
        const bMinusA = this.b.clone().sub(this.a);  // along the face.
        const normal = rot90(bMinusA).normalize();   // away from the face.
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
        const a = this.a.clone().add(normalTimesRad);  // 2D pos of A offset outwards from the face.
        const playerMinusA = pos.clone().sub(a);
        const playerMinusAdotN = playerMinusA.dot(normal);  // signed distance from the infinite face.
        if (playerMinusAdotN < -epsilon) {  // gone past
            return noCollision;
        }
        const numer = playerMinusA.dot(u);  // (b - a) . u
        // Solve: pos + t * v   =   a + μ * (b - a)
        // Taking the dot product with u eliminates t * v.
        // pos . u   =   a . u  +  μ * (b - a) . u
        // (pos - a) . u   =   μ * (b - a) . u
        const μ = numer / denom;
        if (μ >= 1 || μ <= 0) {
            return noCollision;  // missed
        }
        const collisionPos = bMinusA.clone().multiplyScalar(μ).add(a);  // (b - a) * μ  +  a
        const collisionT = - playerMinusAdotN / vDotNormal;  // - ((pos - a) . normal) / (v . normal)
        const skiddingAlongVelocity = bMinusA.clone().multiplyScalar(  // (b - a) * (v . (b - a)) / ((b - a) . (b - a))
                v.dot(bMinusA) / bMinusA.lengthSq())
        return { t: collisionT, pos: collisionPos, skiddingAlongVelocity: skiddingAlongVelocity };
    }
}
