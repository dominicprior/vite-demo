import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { square } from './foo.js'
import { WebGLRenderer, PerspectiveCamera, Scene, Color } from '../three/threebuild/three_module.js';
console.log(WebGLRenderer);
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
scene.background = new Color('skyblue');
const camera = new PerspectiveCamera(35, 1, 0.1, 100);
renderer.render(scene, camera);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

console.log(square(5))