import sky from "./GamingAssets/sky.png";
import platform from "./GamingAssets/platform.png";
import star from "./GamingAssets/star.png";
import dude from "./GamingAssets/dude.png";
import React, { useEffect } from "react";
import Phaser from "phaser";


const GameV1 = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: "100%",
      height: 450,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // this.load.image("sky", sky);
      // this.load.image("ground", platform);
      // this.load.image("star", star);
      // this.load.spritesheet("dude", dude, {
      //   frameWidth: 32,
      //   frameHeight: 48,
      // });
    }

    function create() {
      this.add.image(400, 300, "sky");

      const platforms = this.physics.add.staticGroup();
      platforms.create(400, 568, "ground").setScale(2).refreshBody();

      this.player = this.physics.add.sprite(100, 450, "dude");
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);

      this.physics.add.collider(this.player, platforms);
    }

    function update() {
      const cursors = this.input.keyboard.createCursorKeys();

      if (cursors.left.isDown) {
        this.player.setVelocityX(-160);
      } else if (cursors.right.isDown) {
        this.player.setVelocityX(160);
      } else {
        this.player.setVelocityX(0);
      }

      if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }
  }, []);

  return <div id="phaser-game" />;
};

export default GameV1;
