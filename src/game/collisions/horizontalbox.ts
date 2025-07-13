import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type { Collision, } from '../utils/types.js';
import { noCollision, } from '../utils/types.js';
import VerticalFace from './verticalface.js';
import Player from '../player.js';

export default class HorizontalBox {
    centre: Vector2;
    width: number;
    depth: number;
    angle: number;

    constructor(centre: Vector2, width: number,
                depth: number, angle: number) {
        this.centre = centre;
        this.width = width;
        this.depth = depth;
        this.angle = angle;
    }

    firstCollision(player: Player): Collision {
        let result = noCollision;
        let corners: Array<Vector2> = [[1,1], [1,-1], [-1,-1], [-1,1]].map(
                a => (new Vector2(a[0], a[1]))
                        .multiply(new Vector2(this.width / 2, this.depth / 2))
                        .rotateAround(new Vector2(), this.angle)
                        .add(this.centre)
                    );
        for (let i=0; i < 4; i++) {
            let face = new VerticalFace(corners[i], corners[(i+1) % 4]);
            let collision = face.firstCollision(player);
            if (collision.t < result.t) {
                result = collision;
            }
        }
        return result;
    }
}
