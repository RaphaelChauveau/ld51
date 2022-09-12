import { Boid } from "./Boid.js";
import Obstacle from "./Obstacle.js";
import Player from "./Player.js";
import RangeBoid from "./RangeBoid.js";
import Effect from "./Effect.js";
import {magnitude} from "../engine/vector2.js";

export class BoidGame {
  constructor(game) {
    this.game = game;
    this.game._scene.bgColor = "#FFFFFF";

    this.colliders = [];
    this.boids = [];
    this.obstacles = [];

    this.player = new Player(500, 300);
    this.colliders.push(this.player);

    this.createObstacle(0, 0, 20);
    this.createObstacle(200, 300, 20);
    this.createObstacle(220, 300, 30);
    this.createObstacle(230, 270, 10);
    this.createObstacle(400, 300, 10);

    // TOP
    this.createObstacle(400, -100000, 100010);

    this.createRangeBoid(200, 200);

    // spaced
    this.createBoid(100, 100);
    this.createBoid(200, 100, 20, 5); // fat boi
    this.createBoid(100, 200);

    // overlapping
    this.createBoid(100, 301);
    this.createBoid(100, 302);
    this.createBoid(100, 303);
    this.createBoid(100, 304);
    this.createBoid(100, 305);

    // close
    this.createBoid(100, 400);
    this.createBoid(120, 400);
    this.createBoid(100, 420);
    this.createBoid(120, 420);
    this.createBoid(100, 440, 15, 2); // big boy
    this.createBoid(120, 440);
    this.createBoid(100, 460);
    this.createBoid(120, 460);
  }

  createBoid = (x, y, r, w) => {
    const boid = new Boid(x, y, r, w);
    this.boids.push(boid);
    this.colliders.push(boid);
  };

  createRangeBoid = (x, y) => {
    const boid = new RangeBoid(x, y);
    this.boids.push(boid);
    this.colliders.push(boid);
  };

  createObstacle = (x, y, r) => {
    const obstacle = new Obstacle(x, y, r);
    this.obstacles.push(obstacle);
    this.colliders.push(obstacle);
  };

  update = (delta) => {
    if (delta > 20) {
      // TODO if delta too high (> (2?) * classic delta) => pause
      // console.log(delta);
    }
    this.player.update(delta, this.game.inputHandler);
    for (const boid of this.boids) {
      boid.update(delta, this.player, this.game.resources);
    }
    this.player.expand(this.colliders);
    for (const boid of this.boids) {
      boid.expand(this.colliders);
    }

    // test // TODO in player ?
    if (this.game.inputHandler.getKeyDown('Space')) {
      this.game.resources.sound2.play();
      for (const boid of this.boids) {
        const fromPlayerX = boid.positionX - this.player.positionX;
        const fromPlayerY = boid.positionY - this.player.positionY;
        const ratio = 100 / magnitude([fromPlayerX, fromPlayerY]);
        // TODO affected by entity weight ?
        boid.addEffect(new Effect(500, [fromPlayerX * ratio, fromPlayerY * ratio])); // away from player
      }
    }
  };

  draw = (scene) => {
    for (const boid of this.boids) {
      boid.draw(scene, this.game.resources);
    }
    for (const obstacle of this.obstacles) {
      obstacle.draw(scene);
    }
    this.player.draw(scene);
  };
}
