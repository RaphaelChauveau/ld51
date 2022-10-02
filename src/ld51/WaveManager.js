class WaveManager {
    constructor(level) {
        this.level = level;
        this.spawnPoints = [
            [400, 16],
            [800, 300 - 12],
            [400, 600],
            [0, 300 - 12],
        ]

        this.timeSinceLastWave = 0;//-10 * 1000;
        this.wavesInterval = 20 * 1000;
        this.waveCount = 0;

        this.enemiesToSpawn = [];
    }

    spawnTop = (nbUnitsToSpawn) => {
        for (let i = 0; i < nbUnitsToSpawn; i += 1) {
            this.enemiesToSpawn.push([0, i * 0.5 * 1000]);
        }
    }

    spawnEverywhere = (nbUnitsToSpawn) => {
        for (let i = 0; i < nbUnitsToSpawn; i += 1) {
            console.log(this.spawnPoints[i % 4], Math.floor(i / 4) * 0.5 * 1000);
            this.enemiesToSpawn.push([i % 4, Math.floor(i / 4) * 0.5 * 1000]);
        }
    }

    spawnSides = (nbUnitsToSpawn) => {
        for (let i = 0; i < nbUnitsToSpawn; i += 1) {
            this.enemiesToSpawn.push([((i % 2) * 2) + 1, Math.floor(i / 2) * 0.5 * 1000]);
        }
    }

    spawnTB = (nbUnitsToSpawn) => {
        for (let i = 0; i < nbUnitsToSpawn; i += 1) {
            this.enemiesToSpawn.push([(i % 2) * 2, Math.floor(i / 2) * 0.5 * 1000]);
        }
    }

    spawnSpiral = (nbUnitsToSpawn) => {
        for (let i = 0; i < nbUnitsToSpawn; i += 1) {
            this.enemiesToSpawn.push([i % 4, i * 0.5 * 1000]);
        }
    }

    spawnFunctions = [
        this.spawnTop,
        this.spawnSides,
        this.spawnEverywhere,
        this.spawnTB,
        this.spawnSpiral,
    ]

    spawnWave = () => {
        this.enemiesToSpawn = [];
        const nbUnitsToSpawn = 4 + this.waveCount * 2;
        this.spawnFunctions[this.waveCount % this.spawnFunctions.length](nbUnitsToSpawn);
        // this.spawnOnePoint(0, nbUnitsToSpawn);
    }

    update = (delta) => {
        if (this.level.player.isDead) {
            return;
        }
        
        this.timeSinceLastWave += delta;

        if (this.enemiesToSpawn.length) {
            if (this.enemiesToSpawn[0][1] < this.timeSinceLastWave) {
                const [spi, _] = this.enemiesToSpawn.shift()
                this.level.addEnemy(this.spawnPoints[spi]);
            }
        }

        if (this.timeSinceLastWave > this.wavesInterval) {
            this.spawnWave();
            this.waveCount += 1;
            this.timeSinceLastWave = 0;
        }
    }

    draw = (scene) => {
        for (const [px, py] of this.spawnPoints) {
            scene.ctx.fillRect(px - 20, py - 20, 40, 40);
        }
    }
}

export default WaveManager;
