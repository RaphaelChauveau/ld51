import {dif, magnitude, mul, normalize, sum} from '../engine/vector2.js';
import { CircleShape } from './Shapes.js';

class Player extends CircleShape {
    constructor(level, position) {
        super(position, 15, 3);
        this.level = level;
        this.direction = [1, 0];
        this.orientation = 1; // 1 right, -1, left
        this.speed = 120; // px/s
        this.isHuman = true;
        this.level.inputHandler.defineAxis("HZ_MVT", "KeyA", "KeyD");
        this.level.inputHandler.defineAxis("VT_MVT", "KeyW", "KeyS");
        this.level.inputHandler.defineAxis("HZ_ATK", "ArrowLeft", "ArrowRight");
        this.level.inputHandler.defineAxis("VT_ATK", "ArrowUp", "ArrowDown");

        this.isMoving = false;

        this.health = 10;
        this.maxHealth = 10;
        this.isDead = false;


        this.attackRadius = 50;
        this.attackRange = this.attackRadius;
        this.isAttacking = false;
        this.attackDirection;
        this.attackPosition;
        this.attackDuration = 500; // ms
        this.attackedSince = 0;

        this.animationTimer = 0
    }

    hit = () => {
        this.health -= 1;
        if (this.health <= 0) {
            this.health = 0;
            if (!this.isDead) {
                this.isDead = true;
                this.level.gameOver();
            }
        }
    }

    toHuman = () => {
        this.isHuman = true;
        this.radius = 15;
        this.weight = 3;
    }

    toWolf = () => {
        this.isHuman = false;
        this.radius = 25;
        this.weight = 6;
    }

    update = (delta) => {
        this.attackedSince += delta;
        if (this.isDead) {
            return;
        }
        const hzInput = this.level.inputHandler.getAxisValue("HZ_MVT");
        const vtInput = this.level.inputHandler.getAxisValue("VT_MVT");
        if (hzInput) {
            this.orientation = hzInput;
        }
        if (hzInput || vtInput) {
            this.isMoving = true;
            this.direction = normalize([hzInput, vtInput]);
            this.position = sum(this.position, mul(this.direction, this.speed * delta / 1000));
        } else {
            this.isMoving = false;
        }

        if (this.isAttacking) {
            if (this.attackedSince > this.attackDuration) {
                this.isAttacking = false;
            }
        }

        const hzAttackInput = this.level.inputHandler.getAxisValue("HZ_ATK");
        const vtAttackInput = this.level.inputHandler.getAxisValue("VT_ATK");
        if (!this.isHuman && !this.isAttacking) {
            if (hzAttackInput || vtAttackInput) {
                console.log("attacking");
                this.isAttacking = true;
                this.attackedSince = 0;
                this.attackDirection = normalize([hzAttackInput, vtAttackInput]);
                this.attackPosition = sum(this.position, mul(this.attackDirection, this.attackRange));
                for (const enemy of this.level.enemies) {
                    if (magnitude(dif(this.attackPosition, enemy.position)) < this.attackRadius) {
                        enemy.hit();
                    }
                }
                // TODO inflict damage
                // TODO sound if delta % x == 0
            }
        }
    }

    draw = (scene, delta) => {
        this.animationTimer += delta;
        if (this.isDead) {
            return;
        }

        const idling = Math.cos(this.animationTimer / 1000);
        if (!this.isHuman) {
            const footSpeed = 3;
            const footReach = 5;
            let rightFootPos = [this.position[0] - 16 + 16, this.position[1] - 16 + 10]
            let leftFootPos = [this.position[0] - 16 - 16, this.position[1] - 16 + 10]

            if (this.isMoving) {
                rightFootPos = sum(rightFootPos, [this.orientation * Math.cos(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach, Math.sin(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach])
                leftFootPos = sum(leftFootPos, [-this.orientation * Math.sin(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach, Math.cos(this.animationTimer / 1000 * Math.PI * footSpeed) * footReach])
            }
            if (this.orientation > 0) {
                scene.drawImage(this.level.game.resources.wolf_foot, rightFootPos[0], rightFootPos[1], 32, 32);
                scene.drawImage(this.level.game.resources.wolf_body_right, this.position[0] - 48, this.position[1] - 80, 96, 112);
                scene.drawImage(this.level.game.resources.wolf_head_right, this.position[0] - 48, this.position[1] - 80 + idling * 5, 96, 112);
                scene.drawImage(this.level.game.resources.wolf_foot, leftFootPos[0], leftFootPos[1], 32, 32);
            } else {
                scene.drawImage(this.level.game.resources.wolf_foot, leftFootPos[0], leftFootPos[1], 32, 32);
                scene.drawImage(this.level.game.resources.wolf_body_left, this.position[0] - 48, this.position[1] - 80, 96, 112);
                scene.drawImage(this.level.game.resources.wolf_head_left, this.position[0] - 48, this.position[1] - 80 + idling * 5, 96, 112);
                scene.drawImage(this.level.game.resources.wolf_foot, rightFootPos[0], rightFootPos[1], 32, 32);
            }
            
        } else {
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
                scene.drawImage(this.level.game.resources.human_body_right, this.position[0] - 48, this.position[1] - 80, 96, 112);
                scene.drawImage(this.level.game.resources.human_foot, leftFootPos[0], leftFootPos[1], 32, 32);
            } else {
                scene.drawImage(this.level.game.resources.human_foot, leftFootPos[0], leftFootPos[1], 32, 32);
                scene.drawImage(this.level.game.resources.human_body_left, this.position[0] - 48, this.position[1] - 80, 96, 112);
                scene.drawImage(this.level.game.resources.human_foot, rightFootPos[0], rightFootPos[1], 32, 32);
            }
        }
    }
}

export default Player;
