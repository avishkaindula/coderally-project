export class GameRoom {
    #hostPlayerId;
    players = [];
    #roomId;
    #roomKey;
    #roomIsPublic = true;

    static rooms = [];

    constructor(hostPlayerData, roomId, roomKey = null) {
        this.#hostPlayerId = hostPlayerData.id;
        this.players.push(hostPlayerData);
        this.#roomId = roomId;
        this.#roomKey = roomKey;

        GameRoom.rooms.push(this);
    }

    joinPlayer (player) {
        this.players.push(player);
    }

    getRoomId () {
        return this.#roomId;
    }

    getPlayer (player) {
        let player1 = null;

        this.players.forEach((lPlayer) => {
            if (this.cmpPlayer(player, lPlayer)) {
                player1 = lPlayer;

                return null;
            }
        })

        return player1;
    }

    getHostId () {
        return this.#hostPlayerId;
    }

    getPlayerIds() {
        let playerIds = [];
        this.players.forEach((player) => {
            playerIds.push(player.getPlayerUID());
        });

        return playerIds;
    }

    removePlayerById (deletePlayer) {
        if (deletePlayer.id === this.#hostPlayerId) {
            // TODO
            // destroy gme room
        }
        this.players.forEach((player) => {
           if (player.id === deletePlayer.id) {
            this.players.splice(this.players.indexOf(player), 1);
           }
        });
    }

    cmpPlayer (player1, player2) {
        return player1.playerId === player2.playerId;
    }

    static getRoomByRoomId (roomId) {
        let room = null;
        GameRoom.rooms.forEach((lRoom) => {
            if (lRoom.getRoomId() === roomId) {
                room = lRoom;
            }
        })

        return room;
    }

    getOtherPlayers (player) {
        let otherPlayers = [];

        this.players.forEach((lPlayer) => {
           if (!this.cmpPlayer(player, lPlayer)) {
               otherPlayers.push(player);
           }
        });

        return otherPlayers;
    }

    static updatePlayer (player) {
        let room = GameRoom.getRoomByRoomId(player.roomId);
        // .getPlayer(player) = player;
        room.removePlayerById(player.playerId);
        room.players.push(player);
    }
}