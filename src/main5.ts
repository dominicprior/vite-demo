import {
    Scene, Color, PerspectiveCamera, WebGLRenderer,
    PlaneGeometry, Mesh, AmbientLight, PointLight,
    SphereGeometry, BoxGeometry, TorusGeometry,
    MeshStandardMaterial, Clock,
    ShaderMaterial, TextureLoader,
} from '../three/threebuild/three_module.js';
import { OrbitControls } from './OrbitControls.js';
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new Scene()

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const pointLight = new PointLight(0xffffff, 50)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Objects
 */
// Material
const material = new MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new Mesh(
    new SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new Mesh(
    new BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new Mesh(
    new TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new Mesh(
    new PlaneGeometry(5, 5),
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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */
const container = document.querySelector('#scene-container');
const renderer = new WebGLRenderer({
    antialias: true,
})
container!.append(renderer.domElement);
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