import Game from "../engine/game.js";
import { BoidGame } from "../test_boids/BoidGame.js";
import GameResources from "./gameResources.js";
import LoadingScreen from "./LoadingScreen.js";
import MenuInterface from "./MenuInterface.js";
import TestLevel from "./TestLevel.js";

const GAME_STATES = {
    LOADING: "LOADING",
    GAME: "GAME", // badly named
}

class TestGame extends Game {
    constructor(canvas) {
        super(canvas);

        this.updatePerSecond = 60;
        this.drawPerSecond = 60;

        this.menu = new MenuInterface('menu', this);
        // this.tools = TODO

        this.resources = new GameResources();
        this.state = GAME_STATES.LOADING;

        this.loadingScreen = new LoadingScreen(this);
        this.level = null;
    }

    loadingFinished = () => {
        this.level = new BoidGame(this);
        this.state = GAME_STATES.GAME;
    }

    update = (delta) => {
        switch (this.state) {
            case GAME_STATES.LOADING: {
                this.loadingScreen.update(delta);
                break;
            }
            case GAME_STATES.GAME: {
                this.level.update(delta);
                break;
            }
        }
    };

    draw = (scene) => {
        switch (this.state) {
            case GAME_STATES.LOADING: {
                this.loadingScreen.draw(scene);
                break;
            }
            case GAME_STATES.GAME: {
                this.level.draw(scene);
                break;
            }
        }
    };
}

export default TestGame;
