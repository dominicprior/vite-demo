// Stuff the player can bump into.
// Using the same format as the classes in distances.ts.

// For collisions, the player will check the proximity to elements of the brep
// and accelerate away from them.

// The brep consists of vertices, edges and faces.

// For now, we will only consider convex faces.

// We will do BB optimizations later.

// The other files will add stuff to the faces, edges and vertices.

import {
    Vector3,
} from '../../three/threebuild/three_module.js';

import { ConvexPolygonDist, DistInfo, EdgeDist, VertexDist } from './utils/distance.js';

export default class Brep {
    faces: Array<ConvexPolygonDist> = [];
    edges: Array<EdgeDist> = [];
    vertices: Array<VertexDist> = [];

    distances(pos: Vector3, rad: number): Array<DistInfo> {
        const ans: Array<DistInfo> = [];
        for (let face of this.faces) {
            const dist = face.dist(pos);
            if (dist.dist < rad) {
                // console.log(face, dist);
                // a.stop();
                ans.push(dist);
            }
        }
        if (ans.length === 0) {
            for (let edge of this.edges) {
                const dist = edge.dist(pos);
                if (dist.dist < rad) {
                    ans.push(dist);
                }
            }
        }
        return ans;
    }
}
