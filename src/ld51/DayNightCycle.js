const DAY_BRIGHTNESS = 1;
const NIGHT_BRIGHTNESS = 0.8;

class DayNightCycle {
    constructor(level) {
        this.level = level;

        this.transitionTime = 1000;

        this.dayDuration = 1000 * 10;//10;
        this.nightDuration = 1000 * 10;//10;
        this.cycleDuration = this.dayDuration + this.nightDuration;

        this.playingSince = 0;
        this.cycleSince = 0;
        this.isDay = true;
    }

    update = (delta) => {
        this.playingSince += delta;
        this.cycleSince = this.playingSince % this.cycleDuration;
        if (this.isDay && this.cycleSince > this.dayDuration) {
            this.isDay = false;
            this.level.setNight();
        } else if (!this.isDay && this.cycleSince < this.dayDuration) {
            this.isDay = true;
            this.level.setDay();
        }
    }

    draw = (scene) => {
        const DayColor = [255, 239, 231];
        const NightColor = [0, 0, 255];
        let color;
        if (this.cycleSince < this.transitionTime) {
            const transitionSince = this.cycleSince + this.transitionTime;
            const transitionCoeff = (Math.cos(Math.PI + transitionSince / (this.transitionTime * 2) * Math.PI) + 1) / 2
            const opCoeff = 1 - transitionCoeff;
            const brightness = transitionCoeff * DAY_BRIGHTNESS + opCoeff * NIGHT_BRIGHTNESS
            color = [
                transitionCoeff * DayColor[0] + opCoeff * NightColor[0],
                transitionCoeff * DayColor[1] + opCoeff * NightColor[1],
                transitionCoeff * DayColor[2] + opCoeff * NightColor[2],
            ]
            // console.log('humm going light !');
            scene.ctx.filter = `brightness(${brightness})`;
        } else if (this.cycleDuration - this.cycleSince < this.transitionTime) {
            const transitionSince = this.transitionTime - (this.cycleDuration - this.cycleSince);
            const transitionCoeff = (Math.cos(Math.PI + transitionSince / (this.transitionTime * 2) * Math.PI) + 1) / 2
            const opCoeff = 1 - transitionCoeff;
            const brightness = transitionCoeff * DAY_BRIGHTNESS + opCoeff * NIGHT_BRIGHTNESS
            color = [
                transitionCoeff * DayColor[0] + opCoeff * NightColor[0],
                transitionCoeff * DayColor[1] + opCoeff * NightColor[1],
                transitionCoeff * DayColor[2] + opCoeff * NightColor[2],
            ]
            // console.log('humm going light !');
            scene.ctx.filter = `brightness(${brightness})`;
        } else if (Math.abs(this.dayDuration - this.cycleSince) < this.transitionTime) {
            const transitionSince = this.cycleSince - this.dayDuration + this.transitionTime;
            const transitionCoeff = (Math.cos(Math.PI + transitionSince / (this.transitionTime * 2) * Math.PI) + 1) / 2
            const opCoeff = 1 - transitionCoeff;
            const brightness = transitionCoeff * NIGHT_BRIGHTNESS + opCoeff * DAY_BRIGHTNESS
            color = [
                transitionCoeff * NightColor[0] + opCoeff * DayColor[0],
                transitionCoeff * NightColor[1] + opCoeff * DayColor[1],
                transitionCoeff * NightColor[2] + opCoeff * DayColor[2],
            ]
            // console.log('going dark !');
            scene.ctx.filter = `brightness(${brightness})`;
        } else if (this.cycleSince > this.dayDuration) {
            //console.log('dark');
            scene.ctx.filter = `brightness(${NIGHT_BRIGHTNESS})`
            color = NightColor;
        } else {
            //console.log('light');
            scene.ctx.filter = `brightness(${DAY_BRIGHTNESS})`
            color = DayColor;
        }
        
        scene.ctx.fillStyle = `rgba(${color.join(',')}, 0.2)`;
        scene.ctx.fillRect(0, 0, 800, 600);
    }

    draw2 = (scene) => {
        const dayElapsed = Math.min(this.cycleSince, this.dayDuration);
        const nightElapsed = Math.max(this.cycleSince - this.dayDuration, 0);


        const x = dayElapsed / this.dayDuration + nightElapsed / this.nightDuration // 0->2
        let y = Math.sin(x * Math.PI); // -1 => 1
        y = (y + 1) / 2 // 0 => 1
        const brightness = y

        console.log(brightness, this.cycleSince, dayElapsed, nightElapsed);
        scene.ctx.filter = `brightness(${brightness})`;
    }
}

export default DayNightCycle;
