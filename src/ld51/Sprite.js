import { sum } from "../engine/vector2.js";

class Sprite {
    constructor(texture, position, textureOffset, width, height) {
        this.texture = texture;
        this.position = position;
        this.textureOffset = textureOffset;
        this.width = width;
        this.height = height;
    }

    draw = (scene) => {
        const texturePosition = sum(this.position, this.textureOffset);
        scene.drawImage(this.texture, texturePosition[0], texturePosition[1], this.width, this.height);
    }
}

export default Sprite;
