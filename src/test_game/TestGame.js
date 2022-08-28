import Game from "../engine/game.js";
import GameResources from "./gameResources.js";
import MenuInterface from "./MenuInterface.js";

class TestGame extends Game {
    constructor(canvas) {
        super(canvas);

        this.updatePerSecond = 10;
        this.drawPerSecond = 10;

        this.menu = new MenuInterface('menu', this);

        this.resources = new GameResources();

        this.isPaused = false;
    }

    update = (delta) => {
        if (this.isPaused) {
            return;
        }
        console.log('update');
    };

    draw = (scene) => {
        if (this.isPaused) {
            return;
        }
    };
}

export default TestGame;
