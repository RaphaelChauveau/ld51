export const TILE_WIDTH = 32;
const SQRT_2 = Math.sqrt(2);
const SQRT_5 = Math.sqrt(5);

class Map {
    constructor(game, position, width, height) {
        this.game = game;
        this.position = position;
        this.width = width;
        this.height = height;
        this._tileMap = this._makeMatrix(this.width, this.height);
        this._initMatrix(this._tileMap, 0);
        
        this._hoveredTile = null;

        this.editMode = true;
        this.brushSize = 1;
        this.brushColor = 0; // TODO null for no brush ?
        
        this._tileMap = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]

        this.playerCell = [-1, -1]
        this.playerDistField = null;//this._makePlayerDistField()
        console.log(this.playerDistField);
    }

    // should be in utils
    _makeMatrix = (w, h) => {
        const matrix = new Array(h);
        for (let l = 0; l < h; l++) {
            matrix[l] = new Array(w);
        }
        return matrix;
    };
    _initMatrix = (m, d) => {
        for (const line of m) {
            line.fill(d);
        }
    };

    _makePlayerDistField = () => {
        const pdf = this._makeMatrix(this.width, this.height);
        for (let y = 0; y < this.height; y += 1) {
            pdf[y].fill(99999); // inf
            for (let x = 0; x < this.width; x += 1) {
                if (this._tileMap[y][x] == 1) {
                    pdf[y][x] = -1; //
                }
            }
        }
        return pdf;
    }

    _updatePlayerDistField = () => {
        const newPDF = this._makePlayerDistField()
        this._populateDist(newPDF, this.playerCell)

        this.playerDistField = newPDF;

        console.log(this.playerDistField);
    }

    _populateDist = (pdf, startCell) => {
        const queue = [[...startCell, 0]];

        let nbOverride  = 0
        while (queue.length) {
            //console.log('iter');
            const [cX, cY, maybeNewValue] = queue.shift();
            if (cX < 0 || cY < 0 || cX >= this.width || cY >= this.height) {
                continue;
            }

            const currentValue = pdf[cY][cX];
            if (currentValue === -1 || maybeNewValue >= currentValue) {
                continue;
            }

            nbOverride += 1

            pdf[cY][cX] = maybeNewValue;
            const straightNextValue = 1 + maybeNewValue;
            const diagNextValue = SQRT_2 + maybeNewValue;
            // const straightDiagValue = SQRT_5 + maybeNewValue;
            queue.push([cX + 1, cY, straightNextValue]);
            queue.push([cX - 1, cY, straightNextValue]);
            queue.push([cX, cY + 1, straightNextValue]);
            queue.push([cX, cY - 1, straightNextValue]);

            queue.push([cX + 1, cY + 1, diagNextValue]);
            queue.push([cX - 1, cY + 1, diagNextValue]);
            queue.push([cX + 1, cY - 1, diagNextValue]);
            queue.push([cX - 1, cY - 1, diagNextValue]);

            /*if (cX < this.width - 2 && !this._tileMap[cY][cX + 1] && !this._tileMap[cY][cX + 2]) {
                queue.push([cX + 2, cY + 1, straightDiagValue]);
                queue.push([cX + 2, cY - 1, straightDiagValue]);
            }
            if (cX > 2 && !this._tileMap[cY][cX - 1] && !this._tileMap[cY][cX - 2]) {
                queue.push([cX - 2, cY + 1, straightDiagValue]);
                queue.push([cX - 2, cY - 1, straightDiagValue]);
            }
            if (cY < this.height - 2 && !this._tileMap[cY + 1][cX] && !this._tileMap[cY + 2][cX]) {
                queue.push([cX + 1, cY + 2, straightDiagValue]);
                queue.push([cX - 1, cY + 2, straightDiagValue]);
            }
            if (cY > 2 && !this._tileMap[cY - 1][cX] && !this._tileMap[cY - 2][cX]) {
                queue.push([cX + 1, cY - 2, straightDiagValue]);
                queue.push([cX - 1, cY - 2, straightDiagValue]);
            }*/
        }
        console.log('OVerrides', nbOverride);
    }

    update = () => {
        const currentPlayerCell = [
            Math.floor((this.game.player.position[0] - this.position[0]) / TILE_WIDTH),
            Math.floor((this.game.player.position[1] - this.position[1]) / TILE_WIDTH),
        ]

        if (currentPlayerCell[0] !== this.playerCell[0]
            || currentPlayerCell[1] !== this.playerCell[1]) {
            // console.log("NEW P cell", currentPlayerCell);
            this.playerCell = currentPlayerCell;
            // this._updatePlayerDistField(); // TODO that asyncronously ?
        }


        /*const [mouseX, mouseY] = this.game.inputHandler.getMousePosition();
        if (mouseX >= this.position[0] && mouseX < this.position[0] + this.width * TILE_WIDTH
            && mouseY >= this.position[1] && mouseY < this.position[1] + this.height * TILE_WIDTH) {
            this._hoveredTile = [Math.floor((mouseX - this.position[0]) / TILE_WIDTH),
             Math.floor((mouseY - this.position[1]) / TILE_WIDTH)];
        } else {
            this._hoveredTile = null
        }*/
        

        /*if (!this.editMode) {
            return;
        }
        if (this.game.inputHandler.getKey("MOUSE_CLICK") && this._hoveredTile) {
            this._tileMap[this._hoveredTile[1]][this._hoveredTile[0]] = this.brushColor;
        }*/
    };

    _drawTile = (scene, l, c) => {
        switch (this._tileMap[l][c]) {
            case 1:
                scene.ctx.fillStyle = "#44FF44";
                scene.ctx.fillRect(this.position[0] + c * TILE_WIDTH,
                    this.position[1] + l * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
                break;
            case 2:
                scene.ctx.fillStyle = "#4444FF";
                scene.ctx.fillRect(this.position[0] + c * TILE_WIDTH,
                    this.position[1] + l * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
                break;
            default:
                // scene.ctx.fillStyle = "transparent";
                break;
        }

        if (!this.editMode) {
            return;
        }
        if (this._hoveredTile && this._hoveredTile[0] == c && this._hoveredTile[1] == l) {
            scene.ctx.strokeStyle = "#000000";
            scene.ctx.strokeRect(this.position[0] + c * TILE_WIDTH,
                this.position[1] + l * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
        }
    };

    draw = (scene) => {
        for (let l = 0; l < this._tileMap.length; l++) {
            for (let c = 0; c < this._tileMap[l].length; c++) {
                this._drawTile(scene, l, c);
            }
        }
    };

    /* EDIT FUNCTIONS */

}

export default Map;
