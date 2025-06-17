import './style.css'
import { World } from './world.js';
console.log('dominic!');

const appElement = document.querySelector<HTMLDivElement>('#app');
appElement!.innerHTML = `
  <div>
    hey!
  </div>
`
  const world = new World(appElement!);
  world.start();
