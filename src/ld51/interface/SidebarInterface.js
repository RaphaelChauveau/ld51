import Interface from "../../engine/interface/Interface.js";

class SidebarInterface extends Interface {
    constructor(game, elementId, options) {
        super(game, elementId, options);

        this.brushSize = 1;
        this.selectedColor = 0;

        this.buildInterface();
    }

    // TODO
    // MAP UI
    // Action : paint(, height, light)
    // Tool : brush(, bucket)
    // Tool Options : brush size(, shape, curve)
    // Load / Download

    buildInterface = () => {
        this.brushSizeInput = this.registerNumberInput("brush-size-input", this.handleBrushSizeChange);

        const colors = [0, 1, 2];
        for (const color of colors) {
            this.createButton(`Color ${color}`, (e) => this.handleColorSelected(color));
        }
    }

    handleBrushSizeChange = (brushSize) => {
        console.log("Selected brush size", brushSize);
        this.game.level.map.brushSize = brushSize;
    }

    handleColorSelected = (color) => {
        console.log("Selected color", color);
        this.game.level.map.brushColor = color;
    }
}

export default SidebarInterface;