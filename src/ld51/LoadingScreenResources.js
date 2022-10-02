import ResourceLoader from "../engine/resourceLoader.js";

class LoadingScreenResources extends ResourceLoader{
    brandLogo = this.loadImage("res/logo.svg");
}

export default LoadingScreenResources;
