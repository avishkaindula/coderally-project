import { Player } from "../Game/entity/player";
import { Dir } from "../Game/dir";
import { useEffect, useState } from "react";
import Phaser from "phaser";

export const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 25,
  height: window.innerHeight - 300,
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
let playerObj;
let invaderObj;
let cursors;
let mainCharacter;
let invader;
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

  this.load.image(
    Player.barSymbolKeys.health.key,
    Player.barSymbolKeys.health.res
  );
  this.load.image(
    Player.barSymbolKeys.power.key,
    Player.barSymbolKeys.power.res
  );
}

function create() {
  // Create the player sprite at (400, 300)
  let background = this.add.image(0, 0, BACKGROUND_IMG_KEY);
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
    this.physics.add.image(250, 500, playerObj.skinKey),
    null
  );

  invader = new Player(
    invaderObj.name,
    invaderObj.skinKey,
    invaderObj.projectileResKey,
    this,
    this.physics.add.image(750, 500, invaderObj.skinKey),
    null,
    { x: 350, y: 20 }
  );

  mainCharacter.enableGravity();
  invader.enableGravity();

  cursors = this.input.keyboard.createCursorKeys();
  let floor = this.physics.add.staticGroup();
  for (let i = 0; i < config.width / 32 + 1; i++) {
    floor.create(i * 32, config.height - 16, FLOOR_IMG_KEY).setScale(2);
  }
  this.physics.add.collider(mainCharacter.getData(), floor);
  this.physics.add.collider(invader.getData(), floor);
}

function update() {
  if (mainCharacter.isDestroyed()) {
    this.scene.stop();
    funcSetPlayerWin(false);
  } else if (invader.isDestroyed()) {
    this.scene.stop();
    funcSetPlayerWin(true);
  } else {
    // Update player movement based on keyboard input
    // mainCharacter
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

    // enemy
    // Update player movement based on keyboard input
    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J).isDown) {
      if (cursors.left.isDown || cursors.right.isDown) {
        invader.moveLeft(false);
      } else {
        invader.moveLeft();
      }
    } else if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).isDown
    ) {
      if (cursors.left.isDown || cursors.right.isDown) {
        invader.moveRight(false);
      } else {
        invader.moveRight();
      }
    } else {
      invader.stopMoving();
    }

    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I).isDown) {
      invader.moveUp();
    } else if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).isDown
    ) {
      invader.moveDown();
    }

    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
        .isDown
    ) {
      invader.stopMoving(false, true);
    }

    if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).isDown) {
      invader.loadProjectile();
    } else if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).isUp
    ) {
      invader.releaseProjectile();
    }

    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)
        .isDown
    ) {
      invader.setLookingDir(Dir.getLeft());
    } else if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX)
        .isDown
    ) {
      invader.setLookingDir(Dir.getRight());
    } else {
      invader.setHorizontalKeyUp();
    }

    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT)
        .isDown
    ) {
      invader.setLookingDir(Dir.getUp());
    } else if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO)
        .isDown
    ) {
      invader.setLookingDir(Dir.getDown());
    } else {
      invader.setLookingDir(Dir.getNone());
    }
  }
}

// Create a Phaser game instance
/*
 * example character obj = {
 *   name: "Character name",
 *   skin: "URL to character skin resources",
 *   projectileRes: "URL to character's projectile resources"
 * }
 */
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

  invaderObj = pInvaderObj;
  invaderObj.skinKey = genRandString();
  invaderObj.projectileResKey = genRandString();

  backgroundRes = pBackgroundRes;
  floorRes = pFloorRes;

  funcSetPlayerWin = setPlayerWin;

  new Phaser.Game(config);
}

function genRandString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < characters.length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

// --------------------------------------------------------

function App({
  setPlayerWin,
  enemyImage,
  projectileImage,
  protagonistImage,
  environmentImage,
}) {
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (game) {
      return;
    }

    init(
      {
        name: "The Void",
        skin: protagonistImage,
        projectileRes: projectileImage,
      },
      {
        name: "The Witch",
        skin: enemyImage,
        projectileRes: projectileImage,
      },
      environmentImage,
      "https://raw.githubusercontent.com/SL-Pirate/snake/main/res/gfx/brick_wall23.png",
      setPlayerWin
    );
    setGame(true);
    return;
  }, [game, setPlayerWin]);
}

export default App;
