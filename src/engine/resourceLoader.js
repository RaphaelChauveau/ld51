// basically a big dict to handle resource loading/unloading

// struct schema
/*
const struct = {
  "res/image1": {
    type: "IMAGE",
    status: "LOADED",
    resource: new Image(),
  },
  "res/sounds/sound1": {
    type: "SOUND",
    status: "LOADED",
    instances: [{
      playing: false,
      audio: new Audio(),
    }, {
      playing: true,
      audio: new Audio(),
    }, {
      playing: false,
      audio: new Audio(),
    }]
  }
}
*/

class AudioResource {
  constructor(uri, loader) {
    this.uri = uri;
    this.loader = loader;
    this.status = "LOADING",
    this.instances = [];
    this.addAudioInstance()
  }

  addAudioInstance = () => {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      if (this.status !== "LOADED") {
        this.status = "LOADED";
        this.loader.updateProgress();
      }
    }
    audio.onended = () => {
      for (const instance of this.instances) {
        if (instance.audio === audio) {
          console.log('found');
          instance.playing = false;
          // TODO instead of playing : status = PLAYING | ENDED | PAUSED ?
        }
      }
    };
    audio.src = this.uri;
    const track = this.loader.audioContext.createMediaElementSource(audio);
    track.connect(this.loader.audioContext.destination);

    const instance = {
      playing: false,
      audio: audio,
    };

    this.instances.push(instance);
    return instance;
  }

  play = () => {
    if (this.loader.audioContext.state === 'suspended') {
      this.loader.audioContext.resume();
    }

    const readyInstances = this.instances.filter((instance) => instance.playing == false);
    const instance = readyInstances.length > 0 ? readyInstances[0] : this.addAudioInstance();
  
    instance.playing = true;
    instance.audio.play();
  };
}

class ImageResource {
  constructor(uri, loader) {
    this.uri = uri;
    this.loader = loader;
    this.status = "LOADING",
    this.image = new Image();
    this.image.addEventListener('load', () => {
      console.log("IMAGE LOADED", this.uri);
      this.status = "LOADED";
      this.loader.updateProgress();
    }, false);
    this.image.src = this.uri
  }
}

class ResourceLoader {
  constructor() {
    this.resources = {};

    // for legacy browsers
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();

    this.progress = 0;
    console.log(this);
    console.log(Object.getPrototypeOf(this));
    
    //this.loadResources();
    // this.updateProgress();
    console.log("R", this.resources);
  }

  updateProgress = () => {
    const resourceList = Object.values(this.resources)
    const readyResources = resourceList.filter(
      (resource) => resource.status == "LOADED"
    );
    this.progress = readyResources.length / resourceList.length;
    console.log("PROGRESS UPDATE", this.progress, '(', readyResources.length, '/', resourceList.length, ')');
  }

  loadImage = (uri) => {
    this.resources[uri] = new ImageResource(uri, this);
    this.updateProgress()
    return this.resources[uri];
  };

  loadAudio = (uri) => {
    this.resources[uri] = new AudioResource(uri, this);
    this.updateProgress()
    return this.resources[uri];
  }

  // TODO override (call loadImage / loadAudio)
  /*loadResources = () => {
    console.log("bbbbb");
  }*/


  unloadAsset = (uri) => {
    delete this.resources[uri];
    // TODO not enough, free memory
  }

  // UnloadUnusedAssets
}

export default ResourceLoader;
