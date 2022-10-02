"use strict";

import LD51Game from "./ld51/LD51Game.js";
// import TestGame from "./test_game/TestGame.js";

console.log("APP");
const canvas = document.getElementById("display");
console.log("CANVAS", canvas);
const game = new LD51Game(canvas);
window.game = game;
//const game = new TestGame(canvas);
console.log("GAME", game);
game.run();


const onWindowResized = (width, height, displayRatio) => {
  game.onWindowResized(width, height, displayRatio);
};

const setCanvasSize = (canvas, viewportWidth, viewportHeight) => {
  const widthRatio = viewportWidth / GAME_WIDTH;
  const heightRatio = viewportHeight / GAME_HEIGHT;
  let displayRatio = 1;

  if (widthRatio < heightRatio) {
    displayRatio = widthRatio;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${GAME_HEIGHT * widthRatio}px`;
  } else {
    displayRatio = heightRatio;
    canvas.style.width = `${GAME_WIDTH * heightRatio}px`;
    canvas.style.height = `${viewportHeight}px`;
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
