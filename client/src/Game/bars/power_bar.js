import {Bar} from "./bar";

export class PowerBar extends Bar {
    #color;
    constructor(symbol, pos, scene, dimensions = {width: 200, height: 25}) {
        let color = "0xFF0000";
        super(symbol, color, pos, dimensions, scene, 0.02);

        this.setValue(0);
        this.#color = color;
    }

    setValue(percentage) {
        if (percentage < 25) {
            this.setColor("0xbff000");
        }
        else if (percentage < 50) {
            this.setColor("0xFFFF00");
        }
        else if (percentage < 75) {
            this.setColor("0xFFA500");
        }
        else {
            this.setColor("0xFF0000");
        }

        super.setValue(percentage);
    }
}