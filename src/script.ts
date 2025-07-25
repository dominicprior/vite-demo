import './style.css';
import Game from './game/game.js';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
new Game(canvas);
