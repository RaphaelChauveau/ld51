
class MenuInterface {
    constructor(elementId, game) {
        this.element = document.getElementById(elementId);
        this.game = game;

        this.buildInterface();
    }

    // overrideable
    buildInterface = () => {
        this.playPauseButton = this.registerButton("play-pause", this.handleClickPlayPause);
    }

    // from parent
    registerButton = (buttonId, callback) => {
        const button = document.getElementById(buttonId);
        button.onclick = (e) => callback(e);
        return button;
    }

    // user_defined
    handleClickPlayPause = (e) => {
        console.log(this.game, e);
        if (this.game.isPaused) {
            this.game.isPaused = false;
            this.playPauseButton.textContent = "PAUSE";
        } else {
            this.game.isPaused = true;
            this.playPauseButton.textContent = "PLAY";
        }
    }
}

export default MenuInterface;
