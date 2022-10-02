const TILE_WIDTH = 50;

class Map {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x; // TODO pos arrray ?
        this.y = y;
        this.width = width;
        this.height = height;
        this._tileMap = this._makeMatrix(width, height);
        this._initMatrix(this._tileMap, 1);
        
        this._hoveredTile = null;

        this.editMode = true;
        this.brushSize = 1;
        this.brushColor = 0; // TODO null for no brush ?
        
        // tests
        this._tileMap = [
            [0, 2, 2, 2, 2, 2, 2, 2],
            [0, 2, 1, 1, 1, 1, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [2, 2, 1, 1, 1, 1, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2],
        ]
        this.width = 8;
        this.height = 6;
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
        for (let l = 0; l < m.length; l++) {
            for (let c = 0; c < m[l].length; c++) {
                m[l][c] = d;
            }
        }
        // TODO new Array(A[0].length).fill(0)
    };

    update = () => {
        const [mouseX, mouseY] = this.game.inputHandler.getMousePosition();
        if (mouseX >= this.x && mouseX < this.x + this.width * TILE_WIDTH
            && mouseY >= this.y && mouseY < this.y + this.height * TILE_WIDTH) {
            this._hoveredTile = [Math.floor((mouseX - this.x) / TILE_WIDTH),
             Math.floor((mouseY - this.y) / TILE_WIDTH)];
        } else {
            this._hoveredTile = null
        }
        

        if (!this.editMode) {
            return;
        }
        if (this.game.inputHandler.getKey("MOUSE_CLICK") && this._hoveredTile) {
            this._tileMap[this._hoveredTile[1]][this._hoveredTile[0]] = this.brushColor;
        }
    };

    _drawTile = (scene, l, c) => {
        switch (this._tileMap[l][c]) {
            case 1:
                scene.ctx.fillStyle = "#44FF44";
                break;
            case 2:
                scene.ctx.fillStyle = "#4444FF";
                break;
            default:
                scene.ctx.fillStyle = "transparent";
                break;
        }
        scene.ctx.fillRect(this.x + c * TILE_WIDTH,
            this.y + l * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);


        if (!this.editMode) {
            return;
        }
        if (this._hoveredTile && this._hoveredTile[0] == c && this._hoveredTile[1] == l) {
            scene.ctx.strokeStyle = "#000000";
            scene.ctx.strokeRect(this.x + c * TILE_WIDTH,
                this.y + l * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH);
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
