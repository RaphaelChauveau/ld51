import { magnitude } from "../engine/vector2.js";

export class CircleShape {
    constructor(position, radius, weight) {
        this.position = position;
        this.radius = radius;
        this.weight = weight;
    }

    // for qt
    get x() { return this.position[0] - this.radius };
    get y() { return this.position[1] - this.radius };
    get width() { return this.radius + this.radius };
    get height() { return this.radius + this.radius };



    applyPhysics = (others) => {
        let displacementX = 0;
        let displacementY = 0;
        for (const other of others) {
            if (this === other) {
                continue;
            }
            if (other instanceof CircleShape) {
                const toOtherX = other.position[0] - this.position[0];
                const toOtherY = other.position[1] - this.position[1];

                // trying to optimise with approximate dist check
                const radiusSum = this.radius + other.radius;
                if (this.position[0] > other.position[0] + radiusSum
                    || this.position[0] < other.position[0] - radiusSum
                    || this.position[1] > other.position[1] + radiusSum
                    || this.position[1] < other.position[1] - radiusSum) {
                    continue;
                }

                const magn = magnitude([toOtherX, toOtherY]);
                const overlap = this.radius + other.radius - magn;

                if (overlap > 0) {
                    const ratio = overlap / magn;
                    let share = 1;
                    if (other.weight !== -1) { // not unmoveable
                        share = 1 - this.weight / (this.weight + other.weight);
                    }
                    displacementX -= toOtherX * ratio * share;
                    displacementY -= toOtherY * ratio * share;
                }
            } else if (other instanceof RectangularShape) {
                const top = other.position[1] - this.radius;
                const right = other.position[0] + other.width + this.radius;
                const bottom = other.position[1] + other.height + this.radius;
                const left = other.position[0] - this.radius;

                const inRect = bottom > this.position[1] 
                    && top < this.position[1]
                    && right > this.position[0] 
                    && left < this.position[0];
                if (!inRect) {
                    continue;
                }
                const bottomDiff = bottom - this.position[1];
                const topDiff = this.position[1] - top;
                const rightDiff = right - this.position[0];
                const leftDiff = this.position[0] - left;
                
                const minDiff = Math.min(bottomDiff, topDiff, rightDiff, leftDiff);
                if (rightDiff === minDiff) {
                    displacementX += rightDiff;
                } else if (leftDiff === minDiff) {
                    displacementX -= leftDiff;
                } else if (bottomDiff === minDiff) {
                    displacementY += bottomDiff;
                } else if (topDiff === minDiff) {
                    displacementY -= topDiff;
                }
            }
        }

        this.position[0] += displacementX;
        this.position[1] += displacementY;
    }

    draw = (scene) => {
        scene.ctx.strokeStyle = '#FF9900';
        scene.ctx.beginPath();
        scene.ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
        scene.ctx.closePath();
        scene.ctx.stroke();
    };
};

export class RectangularShape {
    constructor(position, width, height, weight) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.weight = weight;
    }

    // for qt
    get x() { return this.position[0] };
    get y() { return this.position[1] };

    applyPhysics = (others) => {
        // osef, always collider here
    }

    draw = (scene) => {
        scene.ctx.strokeStyle = '#FF9900';
        scene.ctx.strokeRect(...this.position, this.width, this.height);
    };
}
