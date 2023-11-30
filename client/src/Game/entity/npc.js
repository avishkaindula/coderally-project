import {Entity} from "./entity";
import {Dir} from "../dir";

export class NPC extends Entity {
    #dir = {
        x: Dir.getNone(),
        y: Dir.getNone()
    }
    #velocity = {
        x: 0,
        y: 0
    }
    #speed = 500;
    #initializedRandomMotion = false;
    #isUnderCooldown = false;

    constructor(skinKey, data, targets, context) {
        super(skinKey, data, 0.05);
        // this.initRandomMotion();
        this._data.setCollideWorldBounds(true);
        targets.forEach((target) => {
            context.physics.add.collider(this._data, target.getData(), () => {
                if (!this.#isUnderCooldown) {
                    target.registerDamage(10);
                    this.processCooldown()
                }
            });
        });
    }

    async initRandomMotion () {
        if (!this.#initializedRandomMotion) {
            this.#initializedRandomMotion = true;

            this.randomMotionX();
            this.randomMotionY();
        }
    }

    async randomMotionX() {
        while (!this.isDestroyed()) {
            this.#dir.x = Math.floor(Math.random() * 5);

            if (this.#dir.x === Dir.getRight()) {
                this.#velocity.x = this.#speed
            } else if (this.#dir.x === Dir.getLeft()) {
                this.#velocity.x = this.#speed * -1;
            } else {
                this.#velocity.x = 0;
            }

            try {
                this.move(this.#velocity);
            }
            catch (e) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }

    async randomMotionY () {
        while (!this.isDestroyed()) {
            this.#dir.y = Math.floor(Math.random() * 5);

            if (this.#dir.y === Dir.getUp()) {
                this.#velocity.y = this.#speed;
            } else if (this.#dir.y === Dir.getDown()) {
                this.#velocity.y = this.#speed * -1;
            } else {
                this.#velocity.y = 0;
            }

            try {
                this.move(this.#velocity);
            }
            catch (e) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }

    async processCooldown () {
        this.#isUnderCooldown = true;
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.#isUnderCooldown = false;
    }

    registerDamage(damageIntensity) {
        this.destroy();
    }
}