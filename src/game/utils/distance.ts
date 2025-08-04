import {
    Vector3,
} from '../../../three/threebuild/three_module.js';

class NearestPoint {
    dist: number;
    base: Vector3;
    constructor(dist: number, base: Vector3) {
        this.dist = dist;
        this.base = base;
    }
}

const NOTHING = new NearestPoint(1e9, new Vector3);

class VertexDist {
    pos: Vector3;
    constructor(pos: Vector3) {
        this.pos = pos;
    }
    dist(pos: Vector3): NearestPoint {
        return new NearestPoint(this.pos.distanceTo(pos), this.pos);
    }
}

class EdgeDist {
    a: Vector3;
    b: Vector3;
    constructor(a: Vector3, b: Vector3) {
        this.a = a;
        this.b = b;
    }
    dist(pos: Vector3): NearestPoint {
        const posMinusA = pos.clone().sub(this.a);
        const posMinusB = pos.clone().sub(this.b);
        const bMinusA   = this.b.clone().sub(this.a);
        const dotA = posMinusA.dot(bMinusA);
        const dotB = posMinusB.dot(bMinusA);
        if (dotA < 0 || dotB > 0) {
            return NOTHING;
        }
        const base = bMinusA.clone()
                        .multiplyScalar(dotA / bMinusA.lengthSq())
                        .add(this.a);
        return new NearestPoint(pos.distanceTo(base), base);
    }
}

export { VertexDist, EdgeDist };
