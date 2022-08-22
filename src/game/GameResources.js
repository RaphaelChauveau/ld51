import ResourceLoader from "../engine/resourceLoader.js";

class GameResources extends ResourceLoader {
    image1 = this.loadImage("res/image1.png");
    image2 = this.loadImage("res/image2.png");
    image3 = this.loadImage("res/image3.png");
    image4 = this.loadImage("res/image4.png");

    sound1 = this.loadAudio("res/hourglass.ogg");
    sound2 = this.loadAudio("res/game_over.ogg");
}

export default GameResources;
