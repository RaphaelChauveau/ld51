import { dif, div, magnitude, mul, sum } from "../engine/vector2.js";
import { TILE_WIDTH } from "./map/Map.js";
import { CircleShape } from "./Shapes.js";

const EnemyState = {
    SEEK: "SEEK",
    ATTACK: "ATTACK",
    DEAD: "DEAD",
}

const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
]

class Enemy extends CircleShape {
    constructor(level, position) {
        super(position, 15, 1);
        this.level = level;
        this.player = this.level.player;
        this.direction = [1, 0];
        this.orientation = 1; // 1 right, -1, left
        this.range = 10;
        this.speed = 90;
        this.health = 3;

        this.state = EnemyState.SEEK

        
        this.attackDuration = 1000; // ms
        this.attackCooldown = 3000; // ms
        this._timeSinceLastAttack = 0;

        this.animationTimer = 0;
    }

    get isDead() {
        return this.state === EnemyState.DEAD;
    }

    hit = () => {
        this.health -= 1;
        if (this.health <= 0) {
            this.state = EnemyState.DEAD;
        }
    }

    update = (delta) => {
        this._timeSinceLastAttack += delta;
        this.isMoving = false;

        if (this.state === EnemyState.SEEK) {
            const toTarget = dif(this.player.position, this.position)
            const magn = magnitude(toTarget);

            if (magn < this.range + this.radius + this.player.radius) {
                if (this._timeSinceLastAttack > this.attackCooldown) {
                    console.log("ATK");
                    this._timeSinceLastAttack = 0;
                    this.state = EnemyState.ATTACK;
                    this.level.player.hit();
                    // resources.sound1.play();
                }
            } else {
                this.direction = div(toTarget, magn); // == normalize
                this.orientation = this.direction[0] > 0 ? 1 : -1;
                this.isMoving = true;
                const timedVelocity = this.speed * delta / 1000;
                this.position = sum(this.position, mul(this.direction, timedVelocity));
            }
        } else if (this.state === EnemyState.ATTACK) {
            if (this._timeSinceLastAttack > this.attackDuration) {
                this.state = EnemyState.SEEK;
            }
        }
    }

    draw = (scene, delta) => {
        if (this.state === EnemyState.DEAD) {
            return;
        }
        this.animationTimer += delta;

        /*scene.ctx.beginPath();
        scene.ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
        scene.ctx.moveTo(this.position[0] + this.direction[0] * this.radius * 2,
                this.position[1] + this.direction[1] * this.radius * 2);
        scene.ctx.lineTo(this.position[0], this.position[1]);
        scene.ctx.closePath();
        if (this.state === EnemyState.ATTACK) {
            scene.ctx.fillStyle = "#FF0000";
            scene.ctx.fill();
        }
        scene.ctx.strokeStyle = "#FF0000";
        scene.ctx.stroke();*/


        const footSpeed = 5;
        const footReach = 3;
        let rightFootPos = [this.position[0] - 16 + 12, this.position[1] - 16 + 10]
        let leftFootPos = [this.position[0] - 16 - 12, this.position[1] - 16 + 10]
        if (this.isMoving) {
            rightFootPos = sum(rightFootPos, [this.orientation * Math.cos(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach, Math.sin(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach])
            leftFootPos = sum(leftFootPos, [-this.orientation * Math.sin(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach, Math.cos(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach])
        }

        if (this.orientation > 0) {
            scene.drawImage(this.level.game.resources.human_foot, rightFootPos[0], rightFootPos[1], 32, 32);
            scene.drawImage(this.level.game.resources.enemy_body_right, this.position[0] - 48, this.position[1] - 80, 96, 112);
            scene.drawImage(this.level.game.resources.human_foot, leftFootPos[0], leftFootPos[1], 32, 32);
        } else {
            scene.drawImage(this.level.game.resources.human_foot, leftFootPos[0], leftFootPos[1], 32, 32);
            scene.drawImage(this.level.game.resources.enemy_body_left, this.position[0] - 48, this.position[1] - 80, 96, 112);
            scene.drawImage(this.level.game.resources.human_foot, rightFootPos[0], rightFootPos[1], 32, 32);
        }
        
        const pitchForkPosition = [
            this.position[0]  + this.orientation * 20,
            this.position[1]  - 24,
        ]

        if (this.state === EnemyState.ATTACK) {
            scene.ctx.save();
            scene.ctx.translate(pitchForkPosition[0], pitchForkPosition[1]);
            let angle = Math.acos(this.direction[0]) + Math.PI / 2;
            if (this.direction[1] < 0) {
              angle = 1 * Math.PI - angle;
            }
            scene.ctx.rotate(angle);
            scene.ctx.translate(-pitchForkPosition[0], -pitchForkPosition[1]);
            scene.drawImage(this.level.game.resources.pitchfork,
              pitchForkPosition[0] - 16, pitchForkPosition[1] - 40, 32, 80);
            scene.ctx.restore();
        } else {
            scene.drawImage(this.level.game.resources.pitchfork, pitchForkPosition[0] - 16, pitchForkPosition[1] - 40, 32, 80)
        }
    }

    drawHealth = (scene) => {
        if (this.health === 3) {
            return;
        }
        scene.ctx.fillStyle = "#00000055";
        scene.ctx.fillRect(this.position[0] - 32, this.position[1] - 64, 64, 8);
        scene.ctx.fillStyle = "#FF000055";
        scene.ctx.fillRect(this.position[0] - 30, this.position[1] - 63, 60 * this.health / 3, 6);
    }
}

export default Enemy;
