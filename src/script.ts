import './style.css';
import Game from './game/game.js';
new Game(document.querySelector('canvas.webgl') as HTMLCanvasElement);
