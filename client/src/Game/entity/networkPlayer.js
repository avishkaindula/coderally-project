import {Player} from "./player";
import {Projectile} from "./projectile";

export class NetworkPlayer extends Player{
    constructor(playerName, skin_key, projectileResKey, context, data, connectionId, healthBarPos) {
        super(playerName, skin_key, projectileResKey, context, data, connectionId, healthBarPos);
        this.disablePowerBar();
    }

    updatePlayerOverNetwork (playerJSONObj) {
        this.updatePosOverNetwork(playerJSONObj.pos);
        if (playerJSONObj.lookingDir != null) {
            this.setLookingDir(playerJSONObj.lookingDir.x);
            this.setLookingDir(playerJSONObj.lookingDir.y);
        }
        if (playerJSONObj.health !== null) {
            this._health = playerJSONObj.health;
        }

        if (playerJSONObj.projectiles.length !== 0) {
            playerJSONObj.projectiles.forEach((projectile) => {
                this.releaseProjectileOverNetwork(projectile);
            });
        }
    }

    releaseProjectileOverNetwork (projectile) {
        let projectileAlreadyExists = false;
        this._releasedProjectiles.forEach((releasedProjectile) => {
            if (releasedProjectile.getProjectileId() === projectile.id) {
                projectileAlreadyExists = true;
            }
        });

        if (!projectileAlreadyExists) {
            let tmpPlayerList = [];
            Player._players.forEach((player) => {
                if (player !== this) {
                    tmpPlayerList.push(player);
                }
            })
            this._currentProjectile = new Projectile(tmpPlayerList, this._projectileResKey, projectile.id);
            this._currentProjectile.setPower(projectile.power);

            this._currentProjectile.release(
                projectile.pos.x,
                projectile.pos.y,
                projectile.dirs.x,
                projectile.dirs.y,
                this._context
            );

            this._releasedProjectiles.push(this._currentProjectile);

            this._currentProjectile = null;
        }

        this._releasedProjectiles.forEach((releasedProjectile)=> {
            if (releasedProjectile.isDestroyed()) {
                this._releasedProjectiles.splice(this._releasedProjectiles.indexOf(releasedProjectile), 1);
            }
        })
    }
}