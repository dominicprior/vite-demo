import './style.css'
import { WebGLRenderer, PerspectiveCamera, Scene, Color } from '../three/threebuild/three_module.js';
console.log('dominic!');
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
scene.background = new Color('skyblue');
const camera = new PerspectiveCamera(35, 1, 0.1, 100);
renderer.render(scene, camera);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    hey!
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`
