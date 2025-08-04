import {
    Vector3,
} from '../../../three/threebuild/three_module.js';
import { expect, test } from 'vitest';
import { VertexDist, EdgeDist } from './distance.js';

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
    expect(ans.base.distanceTo(new Vector3(4,5,3))).toBe(0);
});
