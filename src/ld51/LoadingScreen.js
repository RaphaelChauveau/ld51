import LoadingScreenResources from "./LoadingScreenResources.js";

const LOGO_WIDTH = 200;

// TODO, this class is a mess, use variables to define the different timings

class LoadingScreen {
    constructor(game) {
        this.game = game;
        this.game._scene.bgColor = "#111111"; // TODO should make scene public (or bgColor accessor)?
        this.resources = new LoadingScreenResources();
        this.isLogoLoaded = false;
        this._transitionSince = 0
        this.areGameResourcesLoaded = false;
    }

    update = (delta) => {
        if (!this.isLogoLoaded && this.resources.progress === 1) {
            this.isLogoLoaded = true;
        }
        if (!this.areGameResourcesLoaded && this.game.resources.progress === 1 
            && this._transitionSince > 1500) {
            this.areGameResourcesLoaded = true;
            this._transitionSince = 0;
        }
        if (this.isLogoLoaded) {
            this._transitionSince += delta;
        }
        if (this.areGameResourcesLoaded && this._transitionSince > 1500) {
            this.game.loadingFinished();
        }
    }

    draw = (scene) => {
        if (this.areGameResourcesLoaded) {
            scene.ctx.globalAlpha = Math.cos(Math.min(1, this._transitionSince / 1000) * Math.PI / 2);
        } else if (this.isLogoLoaded) {
            scene.ctx.globalAlpha = Math.sin(Math.min(1, this._transitionSince / 1000 / 1.5) * Math.PI / 2);
        }
        scene.drawImage(this.resources.brandLogo, (this.game.gameWidth - LOGO_WIDTH) / 2 ,
             (this.game.gameHeight - LOGO_WIDTH) / 2, LOGO_WIDTH, LOGO_WIDTH);
        scene.ctx.globalAlpha = 1;
    }
}

export default LoadingScreen;
