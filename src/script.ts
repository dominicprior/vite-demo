import './style.css';
// @ts-ignore
import Game from './game/game.js';

const game = new Game(document.querySelector('canvas.webgl') as HTMLCanvasElement);
