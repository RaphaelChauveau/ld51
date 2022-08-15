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
    const audio = new Audio(this.uri);
    audio.onload = () => {
      if (this.status !== "LOADED") {
        this.status = "LOADED";
        // TODO update completion (callback)
      }
    }
    audio.onended = () => {
      for (const instance of this.instances) {
        if (instance.audio === audio) {
          console.log('found');
          instance.playing = false;
          // TODO instead of playing : status = PLAYING | ENDED | PAUSED
        }
      } 
    };
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
  constructor(uri) {
    this.uri = uri;
    this.status = "LOADING",
    this.image = new Image();
    this.image.addEventListener('load', () => {
      console.log("IMAGE LOADED", this.uri);
      this.status = "LOADED";
      // TODO update completion (callback)
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
  }

  loadImage = (uri) => {
    // TODO update completion
    this.resources[uri] = new ImageResource(uri);
    return this.resources[uri];
  };

  loadAudio = (uri) => {
    // TODO update completion
    this.resources[uri] = new AudioResource(uri, this);
    return this.resources[uri];
  }


  unloadAsset = (uri) => {
    delete this.resources[uri];
    // TODO not enough, free memory
  }

  // UnloadUnusedAssets
}

export default ResourceLoader;
