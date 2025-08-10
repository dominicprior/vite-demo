// Calculations of distances to edges and faces etc.

import {
    Vector3, Euler,
} from '../../../three/threebuild/three_module.js';

class DistInfo {
    dist: number;
    base: Vector3;
    constructor(dist: number, base: Vector3) {
        this.dist = dist;
        this.base = base;
    }
}

const NOTHING = new DistInfo(1e9, new Vector3);

class VertexDist {
    pos: Vector3;
    constructor(pos: Vector3) {
        this.pos = pos;
    }
    dist(pos: Vector3): DistInfo {
        return new DistInfo(this.pos.distanceTo(pos), this.pos);
    }
}

class EdgeDist {
    a: Vector3;
    b: Vector3;
    constructor(a: Vector3, b: Vector3) {
        this.a = a;
        this.b = b;
    }
    dist(pos: Vector3): DistInfo {
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
        return new DistInfo(pos.distanceTo(base), base);
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
    dist(pos: Vector3): DistInfo {
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
                return NOTHING;  // outside the prism
            }
        }
        const posMinusV0 = pos.clone().sub(this.vertex[0]);
        const posDotNormal = posMinusV0.dot(normal);
        const dist = posDotNormal / normal.length();  // signed dist.
        if (dist < 0) {
            return NOTHING;
        }
        // v is the pos relative to its projection onto the plane of the polygon.
        const v = normal.clone().multiplyScalar(posDotNormal / normal.lengthSq());
        const base = pos.clone().sub(v);
        return new DistInfo(dist, base);
    }
}

class BoxDist {
    centre: Vector3;
    width: number;
    depth: number;
    height: number;
    euler: Euler;
    faceDist: Array<ConvexPolygonDist> = [];
    edgeDist: Array<EdgeDist> = [];
    vertexDist: Array<VertexDist> = [];

    constructor(centre: Vector3, width: number,
                depth: number, height: number, euler: Euler) {
        this.centre = centre;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.euler = euler;
        this.addVertices();
        this.addEdges();
        this.addFaces();
    }

    addVertices() {
        for (let i of [-0.5, 0.5]) {
            for (let j of [-0.5, 0.5]) {
                for (let k of [-0.5, 0.5]) {
                    const offset = new Vector3(
                            i * this.width, j * this.depth, k * this.height)
                            .applyEuler(this.euler);
                    const v = this.centre.clone().add(offset);
                    this.vertexDist.push(new VertexDist(v));
                }
            }
        }
    }

    addEdges() {
        const v = this.vertexDist;
        for (let [i, j] of [[0, 1], [1, 3], [3, 2], [2, 0]]) {
            this.edgeDist.push(new EdgeDist(v[i].pos,     v[j].pos));
            this.edgeDist.push(new EdgeDist(v[i].pos,     v[i + 4].pos));
            this.edgeDist.push(new EdgeDist(v[i + 4].pos, v[j + 4].pos));
        }
    }

    addFaces() {
        const v = this.vertexDist;
        const a = '0132,4675,1573,0264,0451,2376'.split(',');
        for (let q of a) {  // e.g. '0132'
            const p = new ConvexPolygonDist([]);
            for (let i of q) {  // e.g. '0'
                p.vertex.push(v[+i].pos);
            }
            this.faceDist.push(p);
        }
    }
}

export { DistInfo, VertexDist, EdgeDist, ConvexPolygonDist, BoxDist };
