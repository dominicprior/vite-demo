import {
    Scene,
    WebGLRenderTarget,
    OrthographicCamera,
    Vector3, Mesh, PlaneGeometry,
    MeshBasicMaterial, BackSide, Material,
} from '../../three/threebuild/three_module.js';
import View from './view.js';

export default class Mirror {
    view: View;
    orthoCamera: OrthographicCamera;
    target: WebGLRenderTarget;
    orthoScene: Scene;
    planeGeom: PlaneGeometry = new PlaneGeometry(2, 2);
    // @ts-ignore
    planeMesh: Mesh;

    constructor(view: View) {
        this.view = view;
        this.target = new WebGLRenderTarget(view.widthInPixels(),
                                            view.heightInPixels());
        this.target.samples = 4;

        // Set up an ortho camera (mirroring by looking backwards).
        this.orthoCamera = new OrthographicCamera(-1, 1,  1, -1,  0.1, 10 );
        this.orthoCamera.position.set(0, 0, -2);
        this.orthoCamera.lookAt(new Vector3);

        this.orthoScene = new Scene;
        this.addTexturedPlane();
        this.addRim();
    }

    addTexturedPlane() {
        const material = new MeshBasicMaterial({
                map: this.target.texture,
                side: BackSide,
        });
        this.planeMesh = new Mesh(this.planeGeom, material);
        this.orthoScene.add(this.planeMesh);
    }

    addRim() {
        const rimMaterial = new MeshBasicMaterial({
                color: 'white',
                side: BackSide,
        });
        const wideGeom = new PlaneGeometry(1.99, .01);
        this.orthoScene.add(new Mesh(wideGeom, rimMaterial).translateZ(-0.1).translateY(-1));
        this.orthoScene.add(new Mesh(wideGeom, rimMaterial).translateZ(-0.1).translateY(1));
        const tallGeom = new PlaneGeometry(.005, 1.99);
        this.orthoScene.add(new Mesh(tallGeom, rimMaterial).translateZ(-0.1).translateX(-1));
        this.orthoScene.add(new Mesh(tallGeom, rimMaterial).translateZ(-0.1).translateX(1));
    }

    resize(view: View) {
        this.target.dispose();
        this.target = new WebGLRenderTarget(view.widthInPixels(),
                                            view.heightInPixels());
        this.target.samples = 4;

        this.orthoScene.remove(this.planeMesh);
        (this.planeMesh.material as Material).dispose();
        this.addTexturedPlane();
    }
}
