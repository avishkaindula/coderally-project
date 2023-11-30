import {Entity} from "./entity.js";
import {Projectile} from "./projectile.js";
import {Dir} from "../dir.js";
import {HealthBar} from "../bars/health_bar";
import {PowerBar} from "../bars/power_bar";

export class Player extends Entity{
    static barSymbolKeys = {
        health: {
            key: "healthBarSymbolKey",
            res: "https://i.imgur.com/FMrnoLd.png"
        },
        power: {
            key: "powerBarSymbolKey",
            res: "https://i.imgur.com/uoLQeai.png"
        }
    }
    static _players = [];

    #gravity = 1000;
    _health = 100;
    #doubleJump = true;
    #numConsecutiveJumps = 0;
    #playerName;
    #playerUID;
    _context;
    _currentProjectile = null;
    _releasedProjectiles = [];
    _projectileResKey;
    connectionId = null;
    #lookingDir = {
        x: Dir.getRight(),
        y: Dir.getNone(),
        horizontalKeyIsDown: false
    }
    _healthBar;
    #powerBar;
    #enemyNPCs = [];

    constructor(
        playerName,
        skin_key,
        projectileResKey,
        context,
        data,
        connectionId,
        healthBarPos = {x: 50, y: 20}
    ) {
        super(skin_key, data, 0.1);
        this.#playerUID = this.#playerName;
        this._projectileResKey = projectileResKey;
        this.#playerName = playerName;
        this._context = context;
        this._data.setCollideWorldBounds(true);
        this._speed = 500;
        this._verticalSpeed = 500;
        this.connectionId = connectionId;
        this._healthBar = new HealthBar(Player.barSymbolKeys.health.key, healthBarPos, this._context);
        this.#powerBar = new PowerBar(
            Player.barSymbolKeys.power.key,
            {x: healthBarPos.x, y: healthBarPos.y + 50},
            this._context
        );

        Player._players.push(this);
    }

    addEnemyNPCs (npcs) {
        npcs.forEach()
    }

    moveUp() {
        if (this._data.gravity === this.#gravity) {
            this._data.setVelocityY(-2 * this._speed);
        }
        else {
            super.moveUp();
        }
    }

    moveDown() {
        if (this._data.gravity === this.#gravity) {
            this._data.setVelocityY(0.5 * this._speed);
        }
        else {
            super.moveDown();
        }
    }

    moveLeft(changeLookingDir = true) {
        super.moveLeft();
        if (changeLookingDir) {
            this.#lookingDir.x = Dir.getLeft();
        }
    }

    moveRight(changeLookingDir = true) {
        super.moveRight();
        if (changeLookingDir) {
            this.#lookingDir.x = Dir.getRight();
        }
    }

    loadProjectile() {
        if (this._currentProjectile === null) {
            let tmpPlayerList = [];
            Player._players.forEach((player) => {
                if (player !== this) {
                    tmpPlayerList.push(player);
                }
            })
            this.#enemyNPCs.forEach((npc) => {
                tmpPlayerList.push(npc);
            })
            this._currentProjectile = new Projectile(tmpPlayerList, this._projectileResKey);
        }

        this.increasePower();
    }

    releaseProjectile() {
        // console.log(this._currentProjectile)
        if (this._currentProjectile !== null) {
            this._currentProjectile.release(
                this.getPos().x,
                this.getPos().y,
                this.#lookingDir.horizontalKeyIsDown || this.#lookingDir.y === Dir.getNone() ? this.#lookingDir.x : Dir.getNone(),
                this.#lookingDir.y,
                this._context
            );

            this._releasedProjectiles.push(this._currentProjectile);
            this._currentProjectile = null;
            this.resetPower();
        }

        this._releasedProjectiles.forEach((projectile) => {
            if (projectile.isDestroyed()) {
                this._releasedProjectiles.splice(this._releasedProjectiles.indexOf(projectile), 1);
            }
        });
    }

    setLookingDir(lookingDir) {
        if (lookingDir === Dir.getLeft() || lookingDir === Dir.getRight()) {
            this.#lookingDir.x = lookingDir;
            this.#lookingDir.horizontalKeyIsDown = true;
        }
        else {
            this.#lookingDir.y = lookingDir;
        }

        if (this.#lookingDir.x === Dir.getLeft() && !this._data.flipX) {
            this._data.flipX = true;
        }
        else if (this.#lookingDir.x === Dir.getRight() && this._data.flipX) {
            this._data.flipX = false;
        }
    }

    setHorizontalKeyUp() {
        this.#lookingDir.horizontalKeyIsDown = false;
    }


    isUpdated(playerJSONObj) {
        let isProjectilesUpdated = false;
        if (playerJSONObj.projectiles !== null) {
            this._releasedProjectiles.forEach((releasedProjectile) => {
                playerJSONObj.projectiles.forEach((projectile) => {
                    if (releasedProjectile.getProjectileId() !== projectile.id) {
                        isProjectilesUpdated = true;
                    }
                });
            });
        }

        if (playerJSONObj.health === null) {
            playerJSONObj.health = this._health;
        }

        return playerJSONObj.pos.x !== this._data.x ||
            playerJSONObj.pos.y !== this._data.y ||
            isProjectilesUpdated ||
            playerJSONObj.health !== this._health;

        // return true;
    }

    enableGravity () {
        this._data.setGravityY(this.#gravity);
    }

    getProjectiles () {
        return this._releasedProjectiles;
    }

    registerDamage (damageIntensity) {
        // this._health -= damageIntensity;
        let newHealth = this._health - damageIntensity;

        this.updateHealth(newHealth);
        if (this._health <= 0) {
            this._health = 0;

            Player.playerDeathEvent();
        }
        console.log(this.#playerName + " is at " + this._health + "%");
    }

    static playerDeathEvent () {
        Player._players.forEach((player) => {
            if (player._health === 0) {

                Player._players.splice(this._players.indexOf(player), 1);
                player.destroy();
            }
        });

        // Player._players.forEach((player) => {
        //     console.log("player " + player.name + " won!");
        // });
    }

    updateHealth (newHealth) {
        this._health = newHealth;

        this._healthBar.setValueAnimated(this._health);
    }

    increasePower () {
        this._currentProjectile.increasePower();
        if (this.#powerBar !== null) {
            this.#powerBar.setValue(this._currentProjectile.getPowerAsPerCentOfMaxPower());
        }
    }
    resetPower () {
        if (this.#powerBar !== null) {
            this.#powerBar.setValue(0);
        }
    }

    disablePowerBar () {
        if (this.#powerBar !== null) {
            this.#powerBar.destroy();
        }
        this.#powerBar = null;
    }

    setEnemyNpcs (npcs) {
        this.#enemyNPCs = npcs;
    }

    getLookingDir () {
        return this.#lookingDir;
    }

    getPlayerId(){
        return this.#playerUID;
    }
    
    getHealth () {
        return this._health;
    }
}

