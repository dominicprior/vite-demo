import {
    Vector2,
} from '../../../three/threebuild/three_module.js';
import type {
    Player2D, Collision,
} from '../utils/types.js';
import VerticalFace from '../collisions/verticalface.js';
import HorizontalBox from '../collisions/horizontalbox.js';

export default class Test {
    test1() : boolean {
        const face = new VerticalFace(
                new Vector2(10, 9), new Vector2(14, 9));
        const player: Player2D = {
                pos: new Vector2(9, 13),
                radius: 1,
                velocity: new Vector2(0.2, -0.3)
            };
        const collision: Collision = face.firstCollision(player);
        if (collision.t !== 10) debugger;
        if (collision.pos.x !== 11) debugger;
        if (collision.pos.y !== 10) debugger;
        if (collision.newVelocity.x !== 0.2) debugger;
        if (collision.newVelocity.y !== 0) debugger;
        console.log(collision);
        return true;
    }
    test2() : boolean {
        const box = new HorizontalBox(new Vector2(12, 8), 4, 2, 0);
        const player: Player2D = {
                pos: new Vector2(9, 13),
                radius: 1,
                velocity: new Vector2(0.2, -0.3)
            };
        const collision: Collision = box.firstCollision(player);
        if (collision.t !== 10) debugger;
        if (collision.pos.x !== 11) debugger;
        if (collision.pos.y !== 10) debugger;
        if (collision.newVelocity.x !== 0.2) debugger;
        if (collision.newVelocity.y !== 0) debugger;
        console.log(collision);
        return true;
    }
};
