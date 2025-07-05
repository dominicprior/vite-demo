import './style.css';
import Game from './game/game.js';
// @ts-ignore
const game = new Game(document.querySelector('canvas.webgl') as HTMLCanvasElement);
