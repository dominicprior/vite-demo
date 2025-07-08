// Some lighting.
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, Mesh, AmbientLight, PointLight,
    SphereGeometry, BoxGeometry, TorusGeometry, AxesHelper, HemisphereLightHelper,
    DirectionalLightHelper,
    MeshStandardMaterial, Clock, DirectionalLight, HemisphereLight,
    PointLightHelper,
} from '../../three/threebuild/three_module.js';
import { OrbitControls } from '../../three/threebuild/OrbitControls.js';

// Scene
const scene = new Scene()

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0x00fffc, 1);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);
scene.add(new DirectionalLightHelper(directionalLight, 0.2))

const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 1.0);
scene.add(hemisphereLight);
scene.add(new HemisphereLightHelper(hemisphereLight, 0.2))

const pointLight = new PointLight(0xff9900, 50, 0, 4)
pointLight.position.x = .5
pointLight.position.y = 1
pointLight.position.z = 2
scene.add(pointLight)
scene.add(new PointLightHelper(pointLight, 0.2))

scene.add(new AxesHelper(1))

/**
 * Objects
 */
// Material
const material = new MeshStandardMaterial()
material.roughness = 0.4
// material.metalness = 1.0

// Objects
const sphere = new Mesh(
    new SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new Mesh(
    new BoxGeometry(0.75, 0.75, 0.75, 10, 10, 10),
    material
)

const torus = new Mesh(
    new TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new Mesh(
    new PlaneGeometry(5, 5, 10,10),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */
const container = document.querySelector('canvas.webgl');
const renderer = new WebGLRenderer({
    antialias: true,
    canvas: container!,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Animate
 */
const clock = new Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()