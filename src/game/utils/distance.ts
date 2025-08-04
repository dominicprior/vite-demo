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

// const NOTHING = new NearestPoint(1e9, new Vector3);

class VertexDist {
    pos: Vector3;
    constructor(pos: Vector3) {
        this.pos = pos;
    }
    distTo(pos: Vector3): NearestPoint {
        return new NearestPoint(this.pos.distanceTo(pos), this.pos);
    }
}

export { VertexDist };
