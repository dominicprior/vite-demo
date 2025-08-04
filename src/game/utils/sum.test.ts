import {
    Vector3,
} from '../../../three/threebuild/three_module.js';
import { expect, test } from 'vitest';
import { VertexDist } from './distance.js';

test('dist1', () => {
    const vert = new VertexDist(new Vector3(3,4,5));
    const nearest = vert.distTo(new Vector3(4,6,7));
    expect(nearest.dist).toBe(3);
    expect(nearest.base.distanceTo(vert.pos)).toBe(0);
});
