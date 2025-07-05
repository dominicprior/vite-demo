// A quilted hexagon with shadows.
import { World } from './world.js';

function main() {
    const container = document.querySelector('canvas.webgl');
    const world = new World(container!);
    world.start();
}

main();

Object.defineProperty(window, 'foo', { value: 3, writable: true, });
