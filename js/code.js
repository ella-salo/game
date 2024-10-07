import TitleScene from './titleScene.js';
import GameScene from './gameScene.js';
import GameScene2 from './gameScene2.js';

let game;

var gameScene = new GameScene();
var gameScene2 = new GameScene2();
var titleScene = new TitleScene();

let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 631*2,
        height: 490*2,
    },

    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
}

game = new Phaser.Game(gameConfig)
game.scene.add('titleScene', titleScene)
game.scene.add('gameScene', gameScene)
game.scene.add('gameScene2', gameScene2)
game.scene.start('titleScene');
