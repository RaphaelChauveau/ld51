import ResourceLoader from "../engine/resourceLoader.js";

class GameResources extends ResourceLoader {
    mainMenuBg = this.loadImage("res/main_menu_mockup.png");
    levelBg = this.loadImage("res/level_mockup.png");
    barrier_large = this.loadImage("res/barrier_large_down.png");
    barrier_small = this.loadImage("res/barrier_small.png");

    wolf_body_right = this.loadImage("res/wolf_body_right.png");
    wolf_head_right = this.loadImage("res/wolf_head_right.png");
    wolf_body_left = this.loadImage("res/wolf_body_left.png");
    wolf_head_left = this.loadImage("res/wolf_head_left.png");
    wolf_foot = this.loadImage("res/wolf_foot.png");

    human_body_right = this.loadImage("res/human_body_right.png");
    human_body_left = this.loadImage("res/human_body_left.png");
    enemy_body_right = this.loadImage("res/enemy_body_right.png");
    enemy_body_left = this.loadImage("res/enemy_body_left.png");
    human_foot = this.loadImage("res/wolf_foot.png");

    pitchfork = this.loadImage("res/pitchfork.png");

    sound1 = this.loadAudio("res/hourglass.ogg");
    sound2 = this.loadAudio("res/game_over.ogg");
}

export default GameResources;
