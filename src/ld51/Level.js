import DayNightCycle from "./DayNightCycle.js";
import Player from "./Player.js";
import Map from "./map/Map.js";
import { RectangularShape } from "./Shapes.js";
import Enemy from "./Enemy.js";
import WaveManager from "./WaveManager.js";
import Quadtree from "../engine/qt.js";
import Sprite from "./Sprite.js";

class Level {
    constructor(game) {
        this.game = game;
        this.game._scene.bgColor = "#FFFFFF";
        this.inputHandler = this.game.inputHandler;

        this.dayNightCycle = new DayNightCycle(this);

        this.player = new Player(this, [400, 300]);
        this.enemies = [
            //new Enemy(this, [390, 20]),
            //new Enemy(this, [410, 20]),
        ]
        this.obstacles = [
            new RectangularShape([0, -16], 11 * 32, 64, -1),
            new RectangularShape([14 * 32, -16], 11 * 32, 64, -1),
            new RectangularShape([0, 17.5 * 32], 11 * 32, 64, -1),
            new RectangularShape([14 * 32, 17.5 * 32], 11 * 32, 64, -1),

            new RectangularShape([-32, 48], 64, 6 * 32, -1),
            new RectangularShape([-32, 10.5 * 32], 64, 7 * 32, -1),
            new RectangularShape([24 * 32, 48], 64, 6 * 32, -1),
            new RectangularShape([24 * 32, 10.5 * 32], 64, 7 * 32, -1),

            new RectangularShape([8 * 32, 5.5 * 32], 32 * 3, 32),
            new RectangularShape([8 * 32, 6.5 * 32], 32, 32),
            new RectangularShape([14 * 32, 5.5 * 32], 32 * 3, 32),
            new RectangularShape([16 * 32, 6.5 * 32], 32, 32),

            new RectangularShape([8 * 32, 11.5 * 32], 32 * 3, 32),
            new RectangularShape([8 * 32, 10.5 * 32], 32, 32),
            new RectangularShape([14 * 32, 11.5 * 32], 32 * 3, 32),
            new RectangularShape([16 * 32, 10.5 * 32], 32, 32),

            // exits
            new RectangularShape([300, 0 - 64], 200, 50),
            new RectangularShape([300, 550 + 64], 200, 50),
            new RectangularShape([-50, 175], 50, 200),
            new RectangularShape([800, 225], 50, 200),
        ]
        this.entities = [ // for draw
            this.player,
            ...this.enemies,
            
            new Sprite(this.game.resources.barrier_large, [304, 208 - 16], [-48, -32], 32 * 3, 48),
            new Sprite(this.game.resources.barrier_large, [496, 208 - 16], [-48, -32], 32 * 3, 48),
            new Sprite(this.game.resources.barrier_large, [304, 400 - 16], [-48, -32], 32 * 3, 48),
            new Sprite(this.game.resources.barrier_large, [496, 400 - 16], [-48, -32], 32 * 3, 48),

            new Sprite(this.game.resources.barrier_small, [272, 240 - 16], [-16, -32], 32, 48),
            new Sprite(this.game.resources.barrier_small, [528, 240 - 16], [-16, -32], 32, 48),
            new Sprite(this.game.resources.barrier_small, [272, 368 - 16], [-16, -32], 32, 48),
            new Sprite(this.game.resources.barrier_small, [528, 368 - 16], [-16, -32], 32, 48),
        ]
        this.colliders = [ // for physics
            this.player,
            ...this.enemies,
            ...this.obstacles,
        ];

        this.collidersQt = new Quadtree({
            x: -50,
            y: -50,
            width: 900,
            height: 700,
        });

        this.waveManager = new WaveManager(this);

        this.map = new Map(this, [0, 16], 25, 18);
    }

    addEnemy = (position) => {
        const enemy = new Enemy(this, position);
        this.enemies.push(enemy);
        this.colliders.push(enemy);
        this.entities.push(enemy);
    }

    gameOver = () => {
        this.score = Math.floor(this.dayNightCycle.playingSince / 100);
        this.highscore = parseInt(this.game.storage.getValue("score") || "0");
        this.highscore = Math.max(this.highscore, this.score);
        this.game.storage.setValue("score", this.score);
    }

    setDay = () => {
        this.player.toHuman();
    }

    setNight = () => {
        this.player.toWolf();
    }


    update = (delta) => {
        this.enemies = this.enemies.filter((e) => !e.isDead);
        this.entities = this.entities.filter((e) => !e.isDead);// || !e.isDead());
        this.colliders = this.colliders.filter((e) => !e.isDead);// || !e.isDead());

        this.dayNightCycle.update(delta);
        this.waveManager.update(delta);
        this.map.update();
        this.player.update(delta);
        for (const enemy of this.enemies) {
            enemy.update(delta);
        }

        //console.time("physics");
        this.collidersQt.clear();
        for (const collider of this.colliders) {
            this.collidersQt.insert(collider);
        }
        for (const collider of this.colliders) {
            const others = this.collidersQt.retrieve(collider)
            collider.applyPhysics(others);
        }

        if (this.player.isDead) {
            if (this.game.inputHandler.getKeyDown('Enter')) {
                this.game.startGame();
            }
        }
    }

    draw = (scene, delta) => {
        scene.drawImage(this.game.resources.levelBg, 0, 0, 800, 600);

        this.entities.sort((a, b) => a.position[1] - b.position[1]);
        for (const entity of this.entities) {
            entity.draw(scene, delta);
        }

        for (const entity of this.entities) {
            entity.drawHealth && entity.drawHealth(scene);
        }

        /* SFX */
        if (this.player.isAttacking && this.player.attackedSince < 110) {
            const [aX, aY] = this.player.attackPosition;
            const arcWidth = Math.max(100 - this.player.attackedSince, 20);
            const [oX, oY] = [aX - this.player.attackDirection[0] * arcWidth,
              aY - this.player.attackDirection[1] * arcWidth]

            let angle = Math.acos(this.player.attackDirection[0]);
            if (this.player.attackDirection[1] < 0) {
                angle = 2 * Math.PI - angle;
            }
            scene.ctx.fillStyle = '#FFFFFFAA';
            scene.ctx.beginPath();
            scene.ctx.arc(aX, aY, this.player.attackRadius, angle + Math.PI / 2, angle + Math.PI * 1.5, true);
            scene.ctx.arc(oX, oY, this.player.attackRadius, angle + Math.PI * 1.5, angle + Math.PI / 2);
            scene.ctx.closePath();
            scene.ctx.fill();
        }


        // player health
        scene.ctx.fillStyle = "#000000";
        scene.ctx.fillRect(80, 15, 100, 24);
        scene.ctx.fillStyle = "#FF0000";
        scene.ctx.fillRect(82, 17, 96 * this.player.health / this.player.maxHealth, 20);

        //this.waveManager.draw(scene);
        this.dayNightCycle.draw(scene);

        if (this.player.isDead) {
            scene.ctx.font = "60px Arial Black";
            scene.ctx.fillStyle = "black";
            scene.ctx.textAlign = "center";
            scene.ctx.fillText(`Press Enter to restart`, 400, 400);
            scene.ctx.fillText(`The villagers won !`, 400, 80);
    
            scene.ctx.font = "40px Arial Black";
            scene.ctx.fillText(`Your score : ${this.score}`, 400, 180);
            scene.ctx.fillText(`Highscore : ${this.highscore}`, 400, 240);
    
            scene.ctx.font = "20px Arial Black";
            scene.ctx.fillText(`(dev : 920)`, 400, 280);
        }
    }
}

export default Level;
