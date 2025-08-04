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

// We assume the polgon is flat and non-degenerate and has at
// least 3 vertices.

// We also assume the vertices walk anti-clockwise around
// the face when viewed from outside the body.

class ConvexPolygonDist {
    vertex: Array<Vector3>;
    constructor(vertex: Array<Vector3>) {
        this.vertex = vertex;
    }
    dist(pos: Vector3): NearestPoint {
        const normal = new Vector3().crossVectors(  // outwards
            this.vertex[1].clone().sub(this.vertex[0]),
            this.vertex[2].clone().sub(this.vertex[1]),  // (0,0,16)
        );
        for (let i=0; i < this.vertex.length; i++) {
            const a = this.vertex[i];
            const b = this.vertex[(i+1) % this.vertex.length];
            const bMinusA = b.clone().sub(a);  // 400
            const inwards = new Vector3().crossVectors(normal, bMinusA);  // inwards in the plane of the polygon.
            if (pos.clone().sub(a).dot(inwards) < 0) {
                return NOTHING;
            }
        }
        const posMinusV0 = pos.clone().sub(this.vertex[0]);  // 349 - 234 = 115
        const posDotNormal = posMinusV0.dot(normal);
        const dist = posDotNormal / normal.length();  // signed dist.  5
        // v is the pos relative to its projection onto the plane of the polygon.
        const v = normal.clone().multiplyScalar(posDotNormal / normal.lengthSq());  // 005
        const base = pos.clone().sub(v);  // 349 - 005 = 344
        return new NearestPoint(dist, base);
    }
}

export { VertexDist, EdgeDist, ConvexPolygonDist };
