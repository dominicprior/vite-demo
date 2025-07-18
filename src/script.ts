import './style.css';
import Game from './game/game.js';

new Game(document.querySelector('canvas.webgl') as HTMLCanvasElement, false);

const newDiv = document.createElement("div");
newDiv.innerHTML = "+";
newDiv.style.zIndex = "3";
newDiv.style.position = "absolute";
newDiv.style.left = "50%";
newDiv.style.top = "50%";
// newDiv.style.backgroundColor = "white";
newDiv.style.color = "red";
document.body.appendChild(newDiv);
