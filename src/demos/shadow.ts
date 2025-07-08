// A shadow demo, including a shadow autoUpdate of false.

// The two planes (the ground and the shelf) are rotated to be at
// an angle to demonstrate the shadow granularity.

// Turning on the shelf's receiveShadow property (in addition to
// the castShadow property) causes some stippling unless we introduce
// a small bias.

// The shelf's shadowSide has to be set to DoubleSide (or the material
// itself has to be DoubleSide, or, weirdly, the shelf has to be upside down).

// With this logging:
//     console.log( object.name, drawCount, camera.name, material.constructor.name );
// in the renderBufferDirect function, just before:
//     renderer.render( drawStart, drawCount );
// we get the following output:
//     shelf 6 sunlight-shadow-camera MeshDepthMaterial
//     ground 6 perspective-camera MeshStandardMaterial
//     shelf 6 perspective-camera MeshStandardMaterial
//     ground 6 perspective-camera MeshStandardMaterial
//     shelf 6 perspective-camera MeshStandardMaterial

// Amusingly, the VS Code auto-complete nearly got it right:
//     shelf 1 perspective-camera MeshStandardMaterial
//     ground 1 perspective-camera MeshStandardMaterial


import {
    Scene, PerspectiveCamera, DoubleSide, WebGLRenderer,
    PlaneGeometry, MeshStandardMaterial, Mesh, DirectionalLight,
    MeshBasicMaterial,
    EquirectangularReflectionMapping, CameraHelper,
    BasicShadowMap,
    // PCFSoftShadowMap, PCFShadowMap, VSMShadowMap,
    DataTexture,
} from '../../three/threebuild/three_module.js';
import gsap from 'gsap';

// -- GUI --
import GUI from 'lil-gui';
const gui = new GUI({
    title: 'Awesome UI', 
    width: 300
});
gui.hide();
const debugObject: any = {
    color: 'yellow',
}
window.addEventListener('keydown', (event) => {
    if (event.key === 'h')
        gui.show(gui._hidden);
});

// -- Renderer --
const w = window.innerWidth;
const h = window.innerHeight;
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
});
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.autoUpdate = false;  // this was useful for showing how the shadow map update can be skipped.
renderer.shadowMap.type = BasicShadowMap;  // unfiltered.  (radius has no effect).
// renderer.shadowMap.type = PCFShadowMap;  // (default) percentage close filtering.
// renderer.shadowMap.type = PCFSoftShadowMap;  // percentage close filtering with bilinear filtering in shader.  (radius has no effect).
// renderer.shadowMap.type = VSMShadowMap;  // variance shadow mapping, which is a bit blurry.

// -- Sunlight --
const sunlight = new DirectionalLight('white', 3);
sunlight.position.set(0, 0, 4);
sunlight.castShadow = true;
sunlight.shadow.camera.top    =  1;
sunlight.shadow.camera.bottom = -1;
sunlight.shadow.camera.left   = -1;
sunlight.shadow.camera.right  =  1;
sunlight.shadow.camera.near = 2;
sunlight.shadow.camera.far = 5;
sunlight.shadow.mapSize.width  = 64;
sunlight.shadow.mapSize.height = 64;
sunlight.shadow.bias = -0.001;
sunlight.shadow.intensity = 0.5;
sunlight.shadow.radius = 12;
sunlight.name = 'sunlight';
sunlight.shadow.camera.name = 'sunlight-shadow-camera';
const sunlight2 = sunlight.clone();
sunlight2.shadow.camera.left   =  -0.2;
sunlight2.shadow.camera.right  =  0.2;

// -- Ground --
const groundGeometry = new PlaneGeometry(2, 2);  // if we ever change to a new geometry, we will need to "dispose" of the old one.
const groundMaterial = new MeshStandardMaterial({ color: 'pink', });
const ground = new Mesh(groundGeometry, groundMaterial);
ground.rotation.z = -Math.PI / 4;
// ground.castShadow = true;
ground.receiveShadow = true;
ground.name = 'ground';

// -- Shelf --
const shelfGeometry = new PlaneGeometry(1, 1);
const shelfMaterial = new MeshBasicMaterial({ color: 'yellow', });
shelfMaterial.shadowSide = DoubleSide;
// shelfMaterial.side = DoubleSide;
// shelfMaterial.transparent = true;
// shelfMaterial.opacity = 0.5;
const shelf = new Mesh(shelfGeometry, shelfMaterial);
shelf.position.set(0, 0, 1);
shelf.rotation.z = -Math.PI / 4;
shelf.castShadow = true;
// shelf.receiveShadow = true;
shelf.name = 'shelf';

shelfMaterial.onBeforeCompile = (shader) => {
    console.log('onBeforeCompile', shader);
    console.log('shader.vertexShader', shader.vertexShader);
    console.log('shader.fragmentShader', shader.fragmentShader);
    console.log('shader.uniforms', shader.uniforms);
    console.log('shader.defines', shader.defines);
    // debugger;
}



// -- GUI --
gui.add(shelf.position, 'z', -2, 2, 0.01).name('shelf z');
gui.add(shelf.rotation, 'y', -2, 2, 0.01).name('shelf Y rotation');
const foo = gui.addFolder('foo');
foo.add(shelf, 'castShadow').name('shelf castShadow');
foo.add(shelfMaterial, 'wireframe').name('shelf wireframe');
gui.add(shelfMaterial, 'side', { FrontSide: 0, BackSide: 1, DoubleSide: 2 }).name('shelf side');
gui.addColor(debugObject, 'color').name('shelf color').onChange((c: String) => {  // see also onFinishChange
    shelfMaterial.color.set(debugObject.color);
    console.log('shelf color changed', c, shelfMaterial.color);
});
debugObject.spin = () => {
    gsap.to(shelf.rotation, { z: shelf.rotation.z + Math.PI / 2, duration: 0.5 });
};
gui.add(debugObject, 'spin').name('shelf spin');

// -- Scene --
const scene = new Scene();
// scene.background = new Color('skyblue');
scene.add(shelf, ground, sunlight,
    // sunlight2   // adding this second light shows that three.js can deal with multiple shadow sources.
);
scene.add(new CameraHelper(sunlight.shadow.camera));  // this shows the shadow camera's frustum.

// -- Pixel Ratios --
// const d = window.devicePixelRatio;
// renderer.setPixelRatio(0.25);  // this made less work for the GPU, but the graphics was grainy (big pixels).
// renderer.setPixelRatio(4);  // this makes things smooth when I zoom chrome to 400%.
// renderer.setPixelRatio(d);  // this gives best quality.
// renderer.setPixelRatio(Math.min(d, 2));  // this limits the cost on high-DPI screens.

// -- Camera --
const camera = new PerspectiveCamera(45, w / h, 1, 1000);
camera.position.set(5, 0, 5);
camera.lookAt(0, 0, 0);
camera.name = 'perspective-camera';

// -- Render twice --
// renderer.shadowMap.needsUpdate = true;  // this was useful for showing how the shadow map update can be skipped.
renderer.render(scene, camera);
// debugger;
camera.position.set(6, 0, 4);
camera.lookAt(0, 0, 0);
renderer.render(scene, camera);

// -- Animation Loop --
// renderer.setAnimationLoop(() => {   // simple example of setAnimationLoop
//             shelf.rotation.z += 0.01;
//             renderer.render(scene, camera);
//         });

// -- Simple Mouse Move --
// window.addEventListener('mousemove', (event) => {
//     const x =  (event.clientX / w) * 4 - 2;   // We would normally put the mouse position in a persistent variable.
//     const y = -(event.clientY / h) * 4 + 2;   // And then use the persistent variable in the render loop.
//     camera.position.set(x * 2, y * 2, 4);
//     camera.lookAt(0, 0, 0);
//     renderer.render(scene, camera);
// });

// -- OrbitControls --
import { OrbitControls } from '../../three/threebuild/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0.05;
renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
})

// -- RGBELoader --
import { RGBELoader } from '../../three/threebuild/RGBELoader.js';
const rgbeLoader = new RGBELoader();
rgbeLoader.load('2k.hdr',
    (envMap: DataTexture) => {
        console.log('HDR texture loaded:', envMap.constructor.name);
        envMap.mapping = EquirectangularReflectionMapping;
        // scene.environment = envMap;
        scene.background = envMap;
        // texture.colorSpace = SRGBColorSpace;
    });

// -- Resize --
window.addEventListener('resize', () => {
    const d = window.devicePixelRatio;
    renderer.setPixelRatio(Math.min(d, 2));  // this limits the cost on high-DPI screens.
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

// -- Fullscreen --
window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();  // but watch out for Safari.
    } else {
        container!.requestFullscreen();
    }
});
