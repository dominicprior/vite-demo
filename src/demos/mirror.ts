import {
    Scene, PerspectiveCamera, WebGLRenderer, OrthographicCamera,
    MeshBasicMaterial, Mesh, BoxGeometry, WebGLRenderTarget, PlaneGeometry,
    Vector3, BackSide, RawShaderMaterial, Material,
} from '../../three/threebuild/three_module.js';
const scene = new Scene();
const camera = new PerspectiveCamera( 75, 2, 0.1, 1000 );
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({ canvas: container!, antialias: false });
document.body.appendChild( renderer.domElement );
const geometry = new BoxGeometry( 1, 1, 1 );
const green = new MeshBasicMaterial( { color: 0x00ff00 } );
const red = new MeshBasicMaterial( { color: 0xff0000 } );
const greenCube = new Mesh( geometry, green );
greenCube.rotateZ(0.2)
scene.add(greenCube);
const redCube = new Mesh( geometry, red );
redCube.translateX(0.7);
scene.add(redCube);
camera.position.set(0, 0, 2);
const renderTarget = new WebGLRenderTarget(300, 150);  // contains the green and red squares
if (1) {
    // Drawing them via a buffer so we can do a mirror flip.
    // But, unfortunately, the antialiasing seems to get lost.
    // Maybe a custom shader would be more precise.
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    const orthoScene = new Scene();
    const orthoCamera = new OrthographicCamera(-1, 1,  -1, 1,  0.1, 10 );
    orthoCamera.position.set(0, 0, 2);
    orthoCamera.up = new Vector3(0, -1, 0);
    orthoCamera.lookAt(new Vector3);
    if (1) {
        const material = new RawShaderMaterial();
        material.vertexShader = `
            attribute vec3 position;
            void main() {
                gl_Position.xy = position.xy;
            }
        `;
        material.fragmentShader = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
            }
        `;
        const plane = new Mesh(new PlaneGeometry(2, 2), material);
        orthoScene.add(plane);
    }
    else {
        const material: Material = new MeshBasicMaterial({
                side: BackSide,
                map: renderTarget.texture,
        });
        const plane = new Mesh(new PlaneGeometry(2, 2), material);
        orthoScene.add(plane);
    }
    renderer.render(orthoScene, orthoCamera);
}
else {
    renderer.render(scene, camera);  // drawing them directly
}
