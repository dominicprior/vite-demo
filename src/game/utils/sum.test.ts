import {
    Vector3, Euler,
} from '../../../three/threebuild/three_module.js';
import { expect, test } from 'vitest';
import { VertexDist, EdgeDist, ConvexPolygonDist, BoxDist } from './distance.js';
import Player from '../player.js';
import Brep from '../brep.js';

function vecDist(u: Vector3, x: number, y: number, z: number) {
    return new Vector3(x, y, z).distanceTo(u)
}

test('dist1', () => {
    const vert = new VertexDist(new Vector3(3,4,5));
    const ans = vert.dist(new Vector3(4,6,7));
    expect(ans.dist).toBe(3);
    expect(ans.base.distanceTo(vert.pos)).toBe(0);
});

test('dist2', () => {
    const a = new Vector3(4,5,2);
    const b = new Vector3(4,5,6);
    const edge = new EdgeDist(a, b);
    const v000 = new Vector3(0,0,0);
    expect(edge.dist(v000).dist).toBe(1e9);
    const v008 = new Vector3(0,0,8);
    expect(edge.dist(v008).dist).toBe(1e9);
    const v113 = new Vector3(1,1,3);
    const ans = edge.dist(v113);
    expect(ans.dist).toBe(5);
    expect(vecDist(ans.base, 4, 5, 3)).toBe(0);
});

test('dist3', () => {
    const poly = new ConvexPolygonDist([
        new Vector3(2,3,4),
        new Vector3(6,3,4),
        new Vector3(2,7,4),
    ]);
    const ans349 = poly.dist(new Vector3(3,4,9));
    expect(ans349.dist).toBe(5);
    expect(vecDist(ans349.base, 3,4,4)).toBe(0);
    expect(poly.dist(new Vector3(1, 4, 9)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(1.8, 3, -9)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(1.8, 3, 0)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(1.8, 2.9, 0)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(4, 2.9, 0)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(4, 5.1, 5)).dist).toBe(1e9);
    expect(poly.dist(new Vector3(4, 4.9, 5)).dist).toBe(1);
    expect(vecDist(poly.dist(new Vector3(4, 4.9, 5)).base, 4, 4.9, 4)).toBe(0);
});

test('dist4', () => {
    const e = new Euler(Math.PI/2);
    const v = new Vector3(1,2,3).applyEuler(e);
    expect(vecDist(v, 1, -3, 2)).toBeCloseTo(0, 9);
});

test('dist5', () => {
    const box = new BoxDist(new Vector3, 2, 3, 4, new Euler(0, 0, Math.PI / 2));
    expect(box.vertexDist[0].pos.x).toBeCloseTo(1.5);
    // console.log('hello')
    // console.log(box.edgeDist)
});

test('dist6', () => {
    const w = 2.6, d = 3.1, h = 4.7;
    const box = new BoxDist(new Vector3, w, d, h, new Euler(.5, .6, .7));
    let sumOfLenSq = 0;
    let sumOfVertDists = 0;
    for (let e of box.edgeDist) {
        sumOfLenSq += e.a.distanceTo(e.b) ** 2;
        sumOfVertDists += e.b.length();
    }
    expect(sumOfLenSq).toBeCloseTo(4 * (w**2 + d**2 + h**2), 9);
    expect(sumOfVertDists).toBeCloseTo(
        12 * new Vector3(w, d, h).length() / 2, 9);
});

test('dist7', () => {
    const w = 2.6, d = 3.1, h = 4.7;
    const box = new BoxDist(new Vector3, w, d, h, new Euler(.5, .6, .7));
    let sumOfSemiPerimeter = 0;
    // let sumOfVertDists = 0;
    for (let f of box.faceDist) {
        const v = f.vertex;
        sumOfSemiPerimeter += v[0].distanceTo(v[1]) +
                              v[1].distanceTo(v[2]);
        // sumOfVertDists += e.b.length();
    }
    expect(sumOfSemiPerimeter).toBeCloseTo(4 * (w + d + h), 9);
    // expect(sumOfVertDists).toBeCloseTo(
    //     12 * new Vector3(w, d, h).length() / 2, 9);
});

test('collision1', () => {
    // @ts-ignore
    let player = new Player();

    player.bearing = 0;  // going North
    player.bounceStiffness = 1;
    player.catchUpFactor = 2;
    player.collisionDrag = 0;
    player.decayFactor = 1;
    player.fwdBkSpeed = 0.8;  // travelling North
    player.strafeSpeed = 0;
    player.pos = new Vector3(0, 0, 0.7);  // 0.5 south of the origin

    player.minDist = 0.1;
    // player.power = 5;  // i.e. from an engine
    player.radius = 0.25;
    // @ts-ignore
    player.time = { delta: 0.02 };
    player.trueVelocity = new Vector3(0, 0, -0.5);  // going north

    const brep = new Brep;
    const box = new BoxDist(new Vector3, 1,1,1, new Euler);  // a unit box at the origin.
    for (let face of box.faceDist) {
        brep.faces.push(face);
    }

    const dists = brep.distances(player.pos, player.radius);
    expect(dists.length).toBe(1);
    const dist = dists[0];
    expect(dist.dist).toBeCloseTo(0.2);
    const acc = 0.15 / 0.1**2 - 1 / 0.15;
    expect(dist.base.distanceTo(new Vector3(0,0,0.5))).toBeCloseTo(0);

    player.updateTrueVelocityFromBrep(brep, 0.02);

    expect(player.trueVelocity.z).toBeCloseTo(acc * player.time.delta - 0.5)
});
