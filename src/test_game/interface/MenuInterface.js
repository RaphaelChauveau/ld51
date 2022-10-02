import Interface from "../../engine/interface/Interface.js";

class MenuInterface extends Interface {
    constructor(game, elementId, options) {
        super(game, elementId, options);

        this.buildInterface();
    }

    buildInterface = () => {
        this.playPauseButton = this.registerButton("play-pause", this.handleClickPlayPause);
        this.toggleSidebarButton = this.registerButton("toggle-sidebar", this.handleClickToggleSidebar);
        
    }

    // user_defined
    handleClickPlayPause = (e) => {
        console.log(this.game, e);
        if (this.game._isPaused) {
            this.game._isPaused = false;
            this.playPauseButton.textContent = "PAUSE";
        } else {
            this.game._isPaused = true;
            this.playPauseButton.textContent = "PLAY";
        }
    }

    handleClickToggleSidebar = (e) => {
        if (this.game.sidebarInterface.isVisible) {
            this.game.sidebarInterface.isVisible = false;
            this.game.level.map.editMode = false;
        } else {
            this.game.sidebarInterface.isVisible = true;
            this.game.level.map.editMode = true;
        }
        this.game.sidebarInterface.updateVisibility();
    }
}

export default MenuInterface;
