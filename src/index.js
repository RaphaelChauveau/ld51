"use strict";

// import { Ld51Game } from "./game/Ld51Game.js";
import { BoidGame } from "./test_boids/BoidGame.js";

console.log("APP");
const canvas = document.getElementById("display");
console.log("CANVAS", canvas);
//const game = new Ld50Game(canvas);
const game = new BoidGame(canvas);
console.log("GAME", game);
game.run();


const onWindowResized = (width, height, displayRatio) => {
  console.log("aaa", game)
  game.onWindowResized(width, height, displayRatio);
};

const setCanvasSize = (canvas, viewportWidth, viewportHeight) => {
  console.log("setCanvasSize")

  const widthRatio = viewportWidth / GAME_WIDTH;
  const heightRatio = viewportHeight / GAME_HEIGHT;
  let displayRatio = 1;

  if (widthRatio < heightRatio) {
    displayRatio = widthRatio;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${GAME_HEIGHT * widthRatio}px`;
    canvas.style.marginTop = `${
      (viewportHeight - GAME_HEIGHT * widthRatio) / 2 // TODO auto ?
    }px`;
    canvas.style.marginLeft = 0;
  } else {
    displayRatio = heightRatio;
    canvas.style.width = `${GAME_WIDTH * heightRatio}px`;
    canvas.style.height = `${viewportHeight}px`;
    canvas.style.marginTop = 0;
    canvas.style.marginLeft = `${
      (viewportWidth - GAME_WIDTH * heightRatio) / 2 // TODO auto ?
    }px`;
  }

  onWindowResized(GAME_WIDTH, GAME_HEIGHT, displayRatio);
};

const game_wrapper = document.getElementById("game-wrapper");
setCanvasSize(canvas, game_wrapper.offsetWidth, game_wrapper.offsetHeight);

window.onresize = (e) => {
  const game_wrapper = document.getElementById("game-wrapper");

  const viewPortWidth = game_wrapper.offsetWidth;
  const viewPortHeight = game_wrapper.offsetHeight;
  setCanvasSize(canvas, viewPortWidth, viewPortHeight);
};
