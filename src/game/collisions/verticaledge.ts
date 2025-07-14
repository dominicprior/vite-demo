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

export default class VerticalEdge {
    c: Vector2;

    constructor(c: Vector2) {
        this.c = c;
    }

    firstCollision(player: Player): Collision {  // oops!  what about when we have gone past the face?

        const epsilon = 0.01;
        const relPos = new Vector2(player.pos.x, player.pos.z).sub(this.c);  // pos relative to the cylinder centre.
        const v = player.velocity();
        const pDotV = relPos.dot(v);
        const vDotV = v.dot(v);
        const pDotP = relPos.dot(relPos);
        const discr = pDotV ** 2 + player.radius ** 2 - pDotP ** 2;
        if (discr <= 0) {
            return noCollision;  // no solutions to the quadratic
        }
        if (pDotP < player.radius - epsilon) {
            return noCollision;  // already inside the cylinder
        }
        const t = (pDotV - Math.sqrt(discr)) / vDotV;
        const relCollisionPos = v.clone().multiplyScalar(t).add(relPos);
        const collisionPos = relCollisionPos.clone().add(this.c);
        const normal = relCollisionPos.clone().normalize();
        const tangent = rot90(normal);
        const newVelocity = tangent.clone().multiplyScalar(v.dot(tangent));
        return { t: t, pos: collisionPos, newVelocity: newVelocity };
    }
}
