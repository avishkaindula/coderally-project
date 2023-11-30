export class Bar{
    #data;
    #icon
    #color;
    #pos;
    #dimensions
    _value;
    
    constructor (symbol, color, pos, dimensions, scene, scale = 0.1) {
        this.#pos = pos;
        this.#dimensions = dimensions;
        this.#data = scene.add.graphics();
        this.#icon = scene.add.image(pos.x - 25, pos.y + 10, symbol);
        this.#icon.setScale(scale);

        this.#data.fillStyle(color);
        this.#data.fillRect(0, 0, dimensions.width, dimensions.height);
        this.#data.x = pos.x;
        this.#data.y = pos.y;
        this._value = 100;
    }

    destroy () {
        this.#icon.destroy();
        this.#data.destroy();
    }

    setValue (percentage) {
        this._value = percentage;
        this.#data.scaleX = this._value / 100;
    }

    setColor (color) {
        this.#color = color;
        this.#data.clear();
        this.#data.fillStyle(color);
        this.#data.fillRect(0, 0, this.#dimensions.width, this.#dimensions.height);

        this.#data.scaleX = this._value / 100;
    }
}