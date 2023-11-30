import {Bar} from "./bar";

export class HealthBar extends Bar{
    #color;
    constructor(symbol, pos, scene, dimensions = {width: 200, height: 25}) {
        let color = "0xbff000";
        super(symbol, color, pos, dimensions, scene, 0.05);

        this.#color = color;
    }

    async setValueAnimated(percentage) {
        let tmpPercentage = this._value;
        while (tmpPercentage > percentage) {
            this.setValue(tmpPercentage)
            tmpPercentage -= 1;

            await new Promise(resolve => setTimeout(resolve, 1000 / 60));
        }
    }

    setValue(percentage) {
        if (percentage > 75) {
            this.setColor("0xbff000");
        }
        else if (percentage > 50) {
            this.setColor("0xFFFF00");
        }
        else if (percentage > 25) {
            this.setColor("0xFFA500");
        }
        else {
            this.setColor("0xFF0000");
        }

        super.setValue(percentage);
    }
}