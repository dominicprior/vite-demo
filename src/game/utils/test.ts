import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type {
    Player, Collision,
} from '../utils/types.js';
import VerticalFace from '../collisions/verticalface.js';
export default class Test {
    test1() : boolean {
        const verticalFace = new VerticalFace(
                new Vector2(10, 9), new Vector2(14, 9));
        const player: Player = {
                pos: new Vector2(9, 13),
                radius: 1,
                velocity: new Vector2(0.2, -0.3)
            };
        const collision: Collision = verticalFace.firstCollision(player);
        console.log(collision);
        return true;
    }
};
