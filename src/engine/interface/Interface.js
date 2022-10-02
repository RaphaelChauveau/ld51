const INTERFACE_NOT_VISIBLE_CLASS = "interface-not-visible"

const defaultOptions = {
    visible: true,
}

class Interface {
    constructor(game, elementId, options) {
        this.element = document.getElementById(elementId);
        this.game = game;

        const actualOptions = {...defaultOptions, ...options};

        this.isVisible = actualOptions.visible;

        this.updateVisibility();
    }

    updateVisibility = () => {
        if (this.isVisible) {
            this.element.classList.remove(INTERFACE_NOT_VISIBLE_CLASS);
        } else {
            // TODO if ?this.element.classList.contains(INTERFACE_NOT_VISIBLE_CLASS);
            this.element.classList.add(INTERFACE_NOT_VISIBLE_CLASS);
        }
    }

    // from parent
    registerButton = (buttonId, callback) => {
        const button = document.getElementById(buttonId);
        button.onclick = (e) => callback(e);
        return button;
    }

    registerNumberInput = (inputId, callback) => {
        const input = document.getElementById(inputId);
        input.onchange = (e) => callback(parseInt(e.target.value));
        return input;
    }

    createButton = (buttonText, callback) => {
        const button = document.createElement('button');
        button.innerText = buttonText;
        button.onclick = (e) => callback(e);
        this.element.appendChild(button);
        return button;
    }

}

export default Interface;
