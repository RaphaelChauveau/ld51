class MainMenu {
    constructor(game) {
        this.game = game;
        this.isBeingClicked = false;
    }

    update = (delta) => {
        // just pressed
        if (this.game.inputHandler.getKeyDown('MOUSE_CLICK')) {
            this.isBeingClicked = true;
        }
        // just released
        if (this.isBeingClicked && !this.game.inputHandler.getKey('MOUSE_CLICK')) {
            this.isBeingClicked = false;
            this.game.startGame();
        }
    };
    
    draw = (scene) => {
        scene.drawImage(this.game.resources.mainMenuBg, 0, 0, 800, 600);
    }
}

export default MainMenu;