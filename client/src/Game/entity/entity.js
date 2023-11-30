export class Entity {
    _speed = 0;
    _verticalSpeed = 0;
    #scale;
    #destroyed = false;

    // entity object corresponding to phaser
    _data = null;

    // a string which is used to access the image asset
    #skinKey;

    constructor(skin_key, data, scale) {
        this.#scale = scale;
        this.#skinKey = skin_key;
        if (data != null) {
            this._data = data;
            this._data.setScale(this.#scale);
        }
    }

    setData (data) {
        if (this._data == null && data != null) {
            this._data = data;
            this._data.setScale(this.#scale);
            return true;
        }

        return false;
    }

    getSkinKey() {
        return this.#skinKey;
    }

    move(velocity = null) {
        if (velocity !== null) {
            this._speed = velocity.x;
            this._verticalSpeed = velocity.y;
        }

        this._data.setVelocityX(this._speed);
        this._data.setVelocityY(this._verticalSpeed);
    }

    moveLeft () {
        this._data.setVelocityX(-1 * this._speed);
    }

    moveRight() {
        this._data.setVelocityX(this._speed);
    }

    moveUp () {
        this._data.setVelocityY(-1 * this._verticalSpeed);
    }

    moveDown () {
        this._data.setVelocityY(this._verticalSpeed);
    }

    stopMoving (x = true, y = false) {
        if (x) {
            this._data.setVelocityX(0);
        }
        if (y) {
            this._data.setVelocityY(0);
        }
    }

    getData () {
        return this._data;
    }

    getPos () {
        return {
            x: this._data.x,
            y: this._data.y
        };
    }

    setPos(x, y) {
        this._data.x = x;
        this._data.y = y
    }

    setSpeed (x, y) {
        this._speed = x;
        this._verticalSpeed = y;
    }

    updatePosOverNetwork (pos) {
        this._data.setVelocityX(this.calculateVelocityRequired(this.getPos().x, pos.x));
        this._data.setVelocityY(this.calculateVelocityRequired(this.getPos().y, pos.y));
    }

    calculateVelocityRequired (curr, dest) {
        return this._speed * (dest - curr) / 100;
    }

    destroy () {
        this._data.destroy();

        this.#destroyed = true;
    }

    isDestroyed () {
        return this.#destroyed;
    }
}
