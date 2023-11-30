// import * as Phaser from "phaser";
// import { Player } from "./player.js";
// import {Dir} from "./dir.js";
// import io from 'socket.io-client';
// import {Entity} from "./entity";
//
// // Create a Phaser game configuration
// export const config = {
//   type: Phaser.AUTO,
//   width: window.innerWidth - 25,
//   height: window.innerHeight - 25,
//   scene: {
//     preload: preload,
//     create: create,
//     update: update
//   },
//   physics: {
//     default: 'arcade'
//   },
// };
//
// const windowResolution = config.width / config.height;
// // defining imageKeys
// const BACKGROUND_IMG_KEY = 'background';
// const FLOOR_IMG_KEY = 'floor';
// const mainCharacterSkinKey = 'main_character_skin';
// const mainCharacterProjectileResKey = 'main_character_projectile_res_key';
// const invaderSkinKey = 'invader_skin_key';
// const invaderProjectileResKey = 'invader_projectile_res_key';
// let cursors;
// let background;
// let mainCharacter;
// let invader;
// let lPlayerName;
// let lPlayerRes;
// let lBackgroundRes;
// let lFloorRes;
// let lProjectileRes;
// let invaderRes;
// let invaderProjectileRes
// let socket;
// let connId = null;
// let playerJSONObj = {
//   roomId: "cerver-room",
//   playerId: 0,
//   name: "unknown",
//   isReady : false,
//   posX: 500,
//   posY: 500
// }
// let enemyJSONObj = null;
//
// // Create a Phaser game instance
// export function init (
//     playerName,
//     invaderName,
//     playerRes,
//     invaderSkin,
//     backgroundRes,
//     floorRes,
//     projectileRes,
//     invaderProjectile
// ) {
//   lPlayerName = playerName;
//   lPlayerRes = playerRes
//   lBackgroundRes = backgroundRes;
//   lFloorRes = floorRes;
//   lProjectileRes = projectileRes;
//   invaderRes = invaderSkin;
//   invaderProjectileRes = invaderProjectile;
//
//   socket = io('ws://c358-2402-4000-20c2-64-f943-90f4-ce4d-ba87.ngrok-free.app');
//   // socket = io('http://localhost:5000');
//
//   socket.on('connect', function () {
//     console.log('Connected!');
//
//     playerJSONObj.name = lPlayerName;
//     playerJSONObj.playerId = socket.id;
//     socket.emit('new_game', playerJSONObj);
//   });
//
//   socket.on('join-room', (enemy) => {
//     console.log("player joined with playerId: " + enemy.playerId);
//     enemyJSONObj = enemy;
//     playerJSONObj.isReady = true;
//     socket.emit('ready', playerJSONObj);
//   });
//
//   socket.on('new-game-room', (roomId) => {
//     // console.log('created new room with ID: ' + roomId);
//   });
//
//   // socket.on('join-room', (inInvader) => {
//   //   // console.log('joined room with ID: ' + roomId);
//   //   console.log(inInvader.name + " joined the room");
//   //   invader = inInvader;
//   // });
//
//   socket.on('all-players-green', (opponents) => {
//     console.log(opponents);
//     if (opponents.length > 0) {
//       enemyJSONObj = opponents[0];
//
//       new Phaser.Game(config);
//     }
//     else {
//       console.log("recieved empty player JSON object");
//     }
//   })
//
//   socket.on('player-update', (invaderJSONObj) => {
//     enemyJSONObj = invaderJSONObj[0];
//     // console.log(enemyJSONObj)
//   });
//
//   socket.on('connected_to_server', (inConnId) => {
//     connId = inConnId;
//
//     console.log('Connected!');
//   })
// }
//
// function preload() {
//   // Load the player sprite image
//   this.load.image(mainCharacterSkinKey, lPlayerRes);
//   this.load.image(BACKGROUND_IMG_KEY, lBackgroundRes);
//   this.load.image(FLOOR_IMG_KEY, lFloorRes);
//   this.load.image(mainCharacterProjectileResKey, lProjectileRes);
//
//   this.load.image(invaderSkinKey, invaderRes);
//   this.load.image(invaderProjectileResKey, invaderProjectileRes);
// }
//
// function create() {
//   // Create the player sprite at (400, 300)
//   background = this.add.image(0, 0, BACKGROUND_IMG_KEY);
//   background.setScale(
//       (() => {
//         if (windowResolution > 1) {
//           return config.width * 2 / background.width;
//         }
//         else {
//           return config.height * 2 / background.height;
//         }
//       }) ()
//   );
//
//   mainCharacter = new Player(
//       lPlayerName,
//       mainCharacterSkinKey,
//       mainCharacterProjectileResKey,
//       this,
//       this.physics.add.image(playerJSONObj.posX, playerJSONObj.posY, mainCharacterSkinKey),
//       connId,
//   );
//
//   console.log(enemyJSONObj);
//   // invader = new Player(
//   //     enemyJSONObj.name,
//   //     invaderSkinKey,
//   //     invaderProjectileResKey,
//   //     this,
//   //     this.physics.add.image(enemyJSONObj.posX, enemyJSONObj.posY, invaderSkinKey),
//   //     enemyJSONObj.playerId,
//   //     2
//   // );
//   invader = new Entity(
//           invaderSkinKey,
//       //     invaderProjectileResKey,
//       //     this,
//           this.physics.add.image(enemyJSONObj.posX, enemyJSONObj.posY, invaderSkinKey),
//       //     enemyJSONObj.playerId,
//           2
//   )
//   // invader.disableGravity();
//
//   cursors = this.input.keyboard.createCursorKeys();
//   let floor = this.physics.add.staticGroup();
//   for (let i = 0; i < config.width / 32 + 1; i++) {
//     floor.create(i * 32, config.height - 16, FLOOR_IMG_KEY).setScale(2);
//   }
//   this.physics.add.collider(mainCharacter.getData(), floor);
//   // this.physics.add.collider(invader.getData(), floor);
// }
//
//
// function update() {
//   // Update player movement based on keyboard input
//   if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown) {
//     if (cursors.left.isDown || cursors.right.isDown) {
//       mainCharacter.moveLeft(false);
//     }
//     else {
//       mainCharacter.moveLeft();
//     }
//   }
//   else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown) {
//     if (cursors.left.isDown || cursors.right.isDown) {
//       mainCharacter.moveRight(false);
//     }
//     else {
//       mainCharacter.moveRight();
//     }  }
//   else {
//     mainCharacter.stopMoving()
//   }
//
//   if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown) {
//     mainCharacter.moveUp();
//   }
//   else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown) {
//     mainCharacter.moveDown();
//   }
//
//   if (cursors.space.isDown) {
//     mainCharacter.stopMoving(false, true);
//   }
//
//   if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isDown) {
//     mainCharacter.loadProjectile();
//   }
//   else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).isUp){
//     mainCharacter.releaseProjectile();
//   }
//
//   if (cursors.left.isDown) {
//     mainCharacter.setLookingDir(Dir.getLeft());
//   }
//   else if (cursors.right.isDown) {
//     mainCharacter.setLookingDir(Dir.getRight());
//   }
//   else {
//     mainCharacter.setHorizontalKeyUp();
//   }
//
//   if (cursors.up.isDown) {
//     mainCharacter.setLookingDir(Dir.getUp());
//   }
//   else if (cursors.down.isDown) {
//     mainCharacter.setLookingDir(Dir.getDown());
//   }
//   else {
//     mainCharacter.setLookingDir(Dir.getNone());
//   }
//
//
//   // console.log(enemyJSONObj);
//   invader.getData().setX(enemyJSONObj.posX);
//   invader.getData().setY(enemyJSONObj.posY);
//
//   if (mainCharacter.isUpdated(playerJSONObj)) {
//     let pos = mainCharacter.getPos();
//     playerJSONObj.posX = pos.x;
//     playerJSONObj.posY = pos.y;
//     // console.log(playerJSONObj);
//     socket.emit('player-update', playerJSONObj);
//   }
// }
//
//
//  // --------------------------------------------------------
//
// init(
//     'the VOID',
//     "the witch",
//     './dev_assets/player.png',
//     './dev_assets/player.png',
//     './dev_assets/player.png',
//     'https://raw.githubusercontent.com/SL-Pirate/snake/main/res/gfx/brick_wall23.png',
//     'https://raw.githubusercontent.com/SL-Pirate/snake/main/res/gfx/egg.png',
//     'https://raw.githubusercontent.com/SL-Pirate/snake/main/res/gfx/egg.png'
// );
//
// console.log('initialized');
