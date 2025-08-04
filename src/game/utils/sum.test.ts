import {
    Vector3, Euler,
} from '../../../three/threebuild/three_module.js';
import { expect, test } from 'vitest';
import { VertexDist, EdgeDist, ConvexPolygonDist } from './distance.js';

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
    expect(vecDist(v, 1, -3, 2)).toBeCloseTo(0);
});
