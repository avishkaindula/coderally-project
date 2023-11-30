import io from "socket.io-client";
import { Player } from "../Game/entity/player";
import { Dir } from "../Game/dir";
import { useEffect, useState } from "react";
import Phaser from "phaser";
import {NetworkPlayer} from "../Game/entity/networkPlayer";

export const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: "arcade",
  },
};

const windowResolution = config.width / config.height;
// defining imageKeys
const BACKGROUND_IMG_KEY = "background";
const FLOOR_IMG_KEY = "floor";
let cursors;
let background;
let mainCharacter;
let invader;
let socket;
let connId = null;
let playerJSONObj = {
  roomId: "cerver-room",
  playerId: 0,
  name: "unknown",
  isReady: false,
  pos: {
    x: 500,
    y: 500,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  projectiles: [],
  hasPlayerWon: false
};
let enemyJSONObj = null;
let playerObj;
let invaderObj;
let floorRes;
let backgroundRes;
let funcSetPlayerWin;

function preload() {
  // Load the player sprite image
  this.load.image(BACKGROUND_IMG_KEY, backgroundRes);
  this.load.image(FLOOR_IMG_KEY, floorRes);

  this.load.image(playerObj.skinKey, playerObj.skin);
  this.load.image(invaderObj.skinKey, invaderObj.skin);
  this.load.image(playerObj.projectileResKey, playerObj.projectileRes);
  this.load.image(invaderObj.projectileResKey, invaderObj.projectileRes);

  this.load.image(Player.barSymbolKeys.health.key, Player.barSymbolKeys.health.res);
  this.load.image(Player.barSymbolKeys.power.key, Player.barSymbolKeys.power.res);
}

function create() {
  // Create the player sprite at (400, 300)
  background = this.add.image(0, 0, BACKGROUND_IMG_KEY);
  background.setScale(
    (() => {
      if (windowResolution > 1) {
        return (config.width * 2) / background.width;
      } else {
        return (config.height * 2) / background.height;
      }
    })()
  );

  mainCharacter = new Player(
      playerObj.name,
      playerObj.skinKey,
      playerObj.projectileResKey,
      this,
      this.physics.add.image(
          playerJSONObj.pos.x,
          playerJSONObj.pos.y,
          playerObj.skinKey
      ),
      connId,
  );

  invader = new NetworkPlayer(
      invaderObj.name,
      invaderObj.skinKey,
      invaderObj.projectileResKey,
      this,
      this.physics.add.image(
          enemyJSONObj.pos.x,
          enemyJSONObj.pos.y,
          invaderObj.skinKey
      ),
      enemyJSONObj.playerId,
      {x: 350, y: 20}
  );

  mainCharacter.enableGravity();

  cursors = this.input.keyboard.createCursorKeys();
  let floor = this.physics.add.staticGroup();
  for (let i = 0; i < config.width / 32 + 1; i++) {
    floor.create(i * 32, config.height - 16, FLOOR_IMG_KEY).setScale(2);
  }
  this.physics.add.collider(mainCharacter.getData(), floor);
  this.physics.add.collider(invader.getData(), floor);
}

function update() {
  if (mainCharacter.isDestroyed() || enemyJSONObj.hasPlayerWon) {
    this.scene.stop();
    funcSetPlayerWin(false);
  }
  else if (invader.isDestroyed()) {
    this.scene.stop();
    funcSetPlayerWin(true);
    playerJSONObj.hasPlayerWon = true;
  }
  else {
    // Update player movement based on keyboard input
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
      if (cursors.left.isDown || cursors.right.isDown) {
        mainCharacter.moveLeft(false);
      } else {
        mainCharacter.moveLeft();
      }
    } else if (
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown
    ) {
      if (cursors.left.isDown || cursors.right.isDown) {
        mainCharacter.moveRight(false);
      } else {
        mainCharacter.moveRight();
      }
    } else {
      mainCharacter.stopMoving();
    }

    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
      mainCharacter.moveUp();
    } else if (
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown
    ) {
      mainCharacter.moveDown();
    }

    if (cursors.space.isDown) {
      mainCharacter.stopMoving(false, true);
    }

    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown) {
      mainCharacter.loadProjectile();
    } else if (
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isUp
    ) {
      mainCharacter.releaseProjectile();
    }

    if (cursors.left.isDown) {
      mainCharacter.setLookingDir(Dir.getLeft());
    } else if (cursors.right.isDown) {
      mainCharacter.setLookingDir(Dir.getRight());
    } else {
      mainCharacter.setHorizontalKeyUp();
    }

    if (cursors.up.isDown) {
      mainCharacter.setLookingDir(Dir.getUp());
    } else if (cursors.down.isDown) {
      mainCharacter.setLookingDir(Dir.getDown());
    } else {
      mainCharacter.setLookingDir(Dir.getNone());
    }

    if (enemyJSONObj != null) {
      invader.updatePlayerOverNetwork(enemyJSONObj);
    }

    if (mainCharacter.isUpdated(playerJSONObj)) {
      playerJSONObj.pos = mainCharacter.getPos();
      playerJSONObj.lookingDir = mainCharacter.getLookingDir();
      playerJSONObj.health = mainCharacter.getHealth();
      playerJSONObj.projectiles = [];
      mainCharacter.getProjectiles().forEach((projectile) => {
        playerJSONObj.projectiles.push({
          id: projectile.getProjectileId(),
          pos: projectile.getPos(),
          power: projectile.getPower(),
          dirs: projectile.getDirs(),
        });
      });

      socket.emit("player-update", playerJSONObj);
    }
  }
}

function genRandString () {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < characters.length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

// Create a Phaser game instance
function init(
    pPlayerObj,
    pInvaderObj,
    pBackgroundRes,
    pFloorRes,
    setPlayerWin
) {
  playerObj = pPlayerObj;
  playerObj.skinKey = genRandString();
  playerObj.projectileResKey = genRandString();

  invaderObj = pInvaderObj
  invaderObj.skinKey = genRandString();
  invaderObj.projectileResKey = genRandString();

  backgroundRes = pBackgroundRes;
  floorRes = pFloorRes;

  funcSetPlayerWin = setPlayerWin;


  let serverUrl = "34.214.111.54:5000";
  // let serverUrl = "34.214.111.54:5000";

  socket = io(serverUrl, {
    withCredentials: false,
    extraHeaders: {
      // "my-custom-header": "Access-Control-Allow-Origin",
      "ngrok-skip-browser-warning": "please",
    },
  });

  socket.on("connect", function () {
    console.log("Connected!");

    playerJSONObj.name = playerObj.name;
    playerJSONObj.playerId = socket.id;
    socket.emit("new_game", playerJSONObj);
  });

  socket.on("join-room", (enemy) => {
    console.log("player joined with playerId: " + enemy.playerId);
    enemyJSONObj = enemy;
    playerJSONObj.isReady = true;
    socket.emit("ready", playerJSONObj);
  });

  socket.on("new-game-room", (roomId) => {
    // console.log('created new room with ID: ' + roomId);
  });

  socket.on("all-players-green", (opponents) => {
    console.log(opponents);
    if (opponents.length > 0) {
      enemyJSONObj = opponents[0];

      new Phaser.Game(config);
    } else {
      console.log("recieved empty player JSON object");
    }
  });

  socket.on("player-update", (invaderJSONObj) => {
    if (invaderJSONObj != null) {
      enemyJSONObj = invaderJSONObj[0];
      // console.log(enemyJSONObj)
    }
  });

  socket.on("connected_to_server", (inConnId) => {
    connId = inConnId;

    console.log("Connected!");
  });
}

// --------------------------------------------------------

function App({ setPlayerWin }) {
  const [game, setGame] = useState(null);
  useEffect(() => {
    console.log("Going into useEffect");
    console.log(game);
    if (game) {
      console.log("game detected. stop creation");
      return;
    }

    // Environment Image
    // http://res.cloudinary.com/dzydw860g/image/upload/v1693595011/fwos1fo79tohu7lfaraa.png

    init(
        {
          name: "The Void",
          skin: "http://res.cloudinary.com/dzydw860g/image/upload/v1693594848/tba6oxemkbwu2yevke2r.png",
          projectileRes: "http://res.cloudinary.com/dzydw860g/image/upload/v1693594854/gsbprmloiv7ba1v9ly3i.png"
        },
        {
          name: "The Witch",
          skin: "http://res.cloudinary.com/dzydw860g/image/upload/v1693595017/ap1xplq1twkdgrvcsf0v.png",
          projectileRes: "http://res.cloudinary.com/dzydw860g/image/upload/v1693594854/gsbprmloiv7ba1v9ly3i.png"
        },
        "https://i.imgur.com/NRZivFZ.png",
        "https://raw.githubusercontent.com/SL-Pirate/snake/main/res/gfx/brick_wall23.png",
        setPlayerWin
    );
    setPlayerWin(true);
    setGame(true);
    return;
  }, [game, setPlayerWin]);
}

export default App;
