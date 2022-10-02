class Input {
  constructor(game) {
    this.game = game;
    this._keyStates = {};
    this._justUpdated = {};
    this._actionsByKeys = {};
    this._axis = {};
    this._mousePosition = [0, 0]; // init value
    this._attachEvents();
  }

  _attachEvents = () => {
    window.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("keyup", this._handleKeyUp);
    this.game.canvas.addEventListener("mousemove", this._handleMouseMove);
    this.game.canvas.addEventListener("mouseclick", this._handleMouseMove);
    this.game.canvas.addEventListener("mousedown", this._handleMouseDown);
    this.game.canvas.addEventListener("mouseup", this._handleMouseUp);
  };

  _handleMouseDown = (e) => {
    // TODO copied from _handleKeyDown (ughhh)
    const keyCode = "MOUSE_CLICK";
    console.log(keyCode);
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (!wasKeyPressed) {
      this._keyStates[keyCode] = true;
      this._justUpdated[keyCode] = true;
    }
  };

  _handleMouseUp = (e) => {
    // TODO same
    const keyCode = "MOUSE_CLICK";
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (wasKeyPressed) {
      this._keyStates[keyCode] = false;
      this._justUpdated[keyCode] = false;
    }
  };

  _handleKeyDown = (e) => {
    const keyCode = e.code;
    console.log(keyCode);
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (!wasKeyPressed) {
      for (const keyOrAction of [keyCode, ...(this._actionsByKeys[keyCode] || [])]) {
        this._keyStates[keyOrAction] = true;
        this._justUpdated[keyOrAction] = true;
      }
    }
  };

  _handleKeyUp = (e) => {
    const keyCode = e.code;
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (wasKeyPressed) {
      for (const keyOrAction of [keyCode, ...(this._actionsByKeys[keyCode] || [])]) {
        this._keyStates[keyOrAction] = false;
        this._justUpdated[keyOrAction] = false;
      }
    }
  };

  _handleMouseMove = (e) => {
    this._mousePosition = [
      e.offsetX / this.game.displayRatio,
      e.offsetY / this.game.displayRatio,
    ];
  };

  _computeAxis = () => {
    for (const axis of Object.values(this._axis)) {
      const [keyMin, keyPos] = axis.keys;
      if (axis.value < 0) {
        if (!this.getKey(keyMin)) {
          axis.value = 0;
          if (this.getKey(keyPos)) {
            axis.value = 1;
          }
        }
      } else if (axis.value > 0) {
        if (!this.getKey(keyPos)) {
          axis.value = 0;
          if (this.getKey(keyMin)) {
            axis.value = -1;
          }
        }
      }
      if (this.getKeyDown(keyPos)) {
        axis.value = 1;
      } else if (this.getKeyDown(keyMin)) {
        axis.value = -1;
      }
    }
  }

  newFrame = () => {
    this._computeAxis();
    this._justUpdated = {};
  };

  clean() {
    // TODO remove listeners
    // window.removeEventListener('toot', this._handleKeyDown);
  }

  getKey = (keyCode) => {
    return this._keyStates[keyCode] || false;
  };

  getKeyDown = (keyCode) => {
    return this._justUpdated[keyCode] === true;
  };

  getKeyUp = (keyCode) => {
    return this._justUpdated[keyCode] === false;
  };

  getMousePosition = () => {
    return this._mousePosition;
  };

  defineAxis = (axisName, keyCode1, keyCode2) => {
    this._axis[axisName] = {keys: [keyCode1, keyCode2], value: 0};
  }

  getAxisValue = (axisName) => {
    return this._axis[axisName].value;
  }

  defineAction = (actionName, keyCodes) => {
    const actionCode = Input.getAction(actionName);
    for (const key of Array.isArray(keyCodes) ? keyCodes : [keyCodes]) {
      if (!(key in this._actionsByKeys)) {
        this._actionsByKeys[key] = []
      }
      this._actionsByKeys[key].push(actionCode);
    }
  }
  // TODO also hadle re-defining actions (support input remapping)

  static getAction = (actionName) => {
    return `ACTION_${actionName}`;
  }
}

/*
  inputHandler.defineAction("JUMP", ["keyZ", "arrowUP"]);
  inputHandler.defineAction("DASH", "keyE");

  inputHandler.defineAxis("MOVE", "keyQ", "keyD"); // naming
  // / => 0
  // keyQ => -1
  // keyD => 1
  // keyQ -> keyD => 1
  // keyD -> keyQ => -1
*/

export default Input;
