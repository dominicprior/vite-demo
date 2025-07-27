import {
    Scene, PerspectiveCamera, WebGLRenderer, OrthographicCamera,
    MeshBasicMaterial, Mesh, BoxGeometry, WebGLRenderTarget, PlaneGeometry,
    Vector3, BackSide, RawShaderMaterial, Material, Color,
} from '../../three/threebuild/three_module.js';
const scene = new Scene();
scene.background = new Color('black');
const w = 120;
const h = 80;
const camera = new PerspectiveCamera( 75, w/h, 0.1, 1000 );
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({ canvas: container!, antialias: true });
renderer.setSize(w, h);

// Set up the scene and the camera.
const geometry = new BoxGeometry( 1, 1, 1 );
const yellow = new MeshBasicMaterial( { color: 0xffffc0 } );
const red = new MeshBasicMaterial( { color: 0xff0000 } );
const yellowCube = new Mesh( geometry, yellow );
yellowCube.rotateZ(0.2)
scene.add(yellowCube);
const redCube = new Mesh( geometry, red );
redCube.translateX(0.7);
scene.add(redCube);
camera.position.set(0, 0, 2);

if (1) {
    // Draw the yellow and red squares into the renderTarget.
    const renderTarget = new WebGLRenderTarget(w, h);
    renderTarget.samples = 4;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // Carefully set up an ortho camera so we have to option of avoiding the projectionMatrix etc.
    const orthoScene = new Scene();
    const orthoCamera = new OrthographicCamera(-1, 1,  -1, 1,  0.1, 10 );
    orthoCamera.position.set(0, 0, 2);
    orthoCamera.up = new Vector3(0, -1, 0);  // so the mirror flip is about the vertical axis.
    orthoCamera.lookAt(new Vector3);

    if (0) {
        // Use mirror flip shaders for drawing the texture onto the canvas.
        // (It seems to get the gamma correction wrong!)
        const material = new RawShaderMaterial();
        material.uniforms = {
        	blue: { value: 0.2 },
            uTexture: { value: renderTarget.texture },
        };
        material.vertexShader = `
            attribute vec3 position;
            attribute vec2 uv;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.0, 1.0);
            }
        `;
        material.fragmentShader = `
            precision mediump float;
            uniform float blue;
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main() {
                // vec4 texture2D(sampler2D sampler, vec2 coord)  
                gl_FragColor = texture2D(uTexture, vec2(1.0 - vUv.x, vUv.y));
            }
        `;
        const plane = new Mesh(new PlaneGeometry(2, 2), material);
        orthoScene.add(plane);
    }
    else {
        // Use the higher level three.js
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
    // Draw the squares directly without going via a render target.
    renderer.render(scene, camera);
}

// @ts-ignore
window.r = renderer;

// renderer.getContext().getExtension('WEBGL_lose_context')!.loseContext();
// renderer.forceContextLoss();
// renderer.dispose();
// const renderer2 = new WebGLRenderer({ canvas: container!, antialias: true });
// Cannot read properties of null (reading 'precision')
//           if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&

// const glContext = renderer.getContext();
// const renderer2 = new WebGLRenderer({
//     canvas: container!,
//     antialias: true,   // doesn't work - need to dispose of the renderer (and hence the gl).
//     context: glContext,
// });
