import {Entity} from "./entity.js";
import {Dir} from "../dir.js";

export class Projectile extends Entity{
    static obsaleteIDs = [];
    #projectileId;
    #power = 10;
    #maxPower = 500;
    #velX = 1000;
    #velY = -1000;
    #dirs = null;
    #targets = [];

    constructor(targets, skin_key, id = null) {
        super(skin_key, null, 0.025);
        this.#targets = targets;
        if (id == null) {
            this.#projectileId = this.genId();
        }
        else {
            this.#projectileId = id;
        }
    }

    genId() {
        let id = Math.random();

        if (Projectile.obsaleteIDs.includes(id)) {
            return id;
        }

        return id;
    }

    release (x, y, dirX, dirY, context) {
        let data = context.physics.add.image(x, y, this.getSkinKey());
        this.setData(data);
        this.#targets.forEach((target) => {
            context.physics.add.collider(this._data, target.getData(), () => {
                this._data.destroy();
                target.registerDamage(this.getPowerAsPerCentOfMaxPower());
            });
        });
        this.setPos(x, y);
        this.#dirs = {
            x: dirX,
            y: dirY
        };
        let tmpSpeedX = 0;
        let tmpSpeedY = 0;
        if (dirX === Dir.getLeft()) {
            tmpSpeedX = -1 * this.#velX;
        }
        if (dirX === Dir.getRight()) {
            tmpSpeedX = this.#velX;
        }
        if (dirY === Dir.getDown()) {
            tmpSpeedY = -1 * this.#velY;
        }
        else if (dirY === Dir.getUp()) {
            tmpSpeedY = this.#velY;
        }
        this.setSpeed(tmpSpeedX, tmpSpeedY);
        this.move();

        (async () => {
            while (this.#power > 1) {
                this.#power--;

                await new Promise(resolve => setTimeout(resolve, 100));
            }

            this.destroy();
        }) ()
    }

    increasePower() {
        if (this.#power < this.#maxPower) {
            this.#power++;
        }
    }

    getPower () {
        return this.#power;
    }
    getPowerAsPerCentOfMaxPower () {
        return this.#power / this.#maxPower * 100;
    }

    getProjectileId () {
        return this.#projectileId
    }

    setPower(power) {
        this.#power = power;
    }

    getDirs () {
        return this.#dirs;
    }
}
