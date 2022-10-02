import Game from "../engine/game.js";
import GameResources from "./gameResources.js";
import LoadingScreen from "./LoadingScreen.js";
import MenuInterface from "./interface/MenuInterface.js";
import SidebarInterface from "./interface/SidebarInterface.js";
import Level from "./Level.js";
import MainMenu from "./MainMenu.js";
import Storage from "../engine/storage.js";

const GAME_STATES = {
    LOADING: "LOADING",
    MENU: "MENU",
    TRAITS: "TRAITS",
    GAME: "GAME", // todo level
}

class LD51Game extends Game {
    constructor(canvas) {
        super(canvas);

        this.updatePerSecond = 30;
        this.drawPerSecond = 30;

        //this.menu = new MenuInterface(this, 'menu');
        //this.sidebarInterface = new SidebarInterface(this, 'sidebar', {visible: true});

        this.storage = new Storage("scoone_ld51");

        this.resources = new GameResources();
        this.state = GAME_STATES.LOADING;

        this.loadingScreen = new LoadingScreen(this);
        this.menu = null
        this.level = null;

        // HACK Bypass loading screen
        // this.loadingFinished();
    }

    loadingFinished = () => {
        this.menu = new MainMenu(this);
        this.state = GAME_STATES.MENU;
    }

    startGame = () => {
        this.level = new Level(this);
        this.state = GAME_STATES.GAME;
    }

    update = (delta) => {
        // delta ~= 33
        if (delta > 200) {
            return;
        }
        switch (this.state) {
            case GAME_STATES.LOADING: {
                this.loadingScreen.update(delta);
                break;
            }
            case GAME_STATES.MENU: {
                this.menu.update(delta);
                break;
            }
            case GAME_STATES.GAME: {
                this.level.update(delta);
                break;
            }
        }
    };

    draw = (scene, delta) => {
        switch (this.state) {
            case GAME_STATES.LOADING: {
                this.loadingScreen.draw(scene);
                break;
            }
            case GAME_STATES.MENU: {
                this.menu.draw(scene);
                break;
            }
            case GAME_STATES.GAME: {
                this.level.draw(scene, delta);
                break;
            }
        }
    };
}

export default LD51Game;
