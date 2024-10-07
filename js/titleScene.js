
class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'titleScene'})
        this.murnollaplayers = []
        this.murnollascores = []
        this.neljanmurplayers = []
        this.neljanmurscores = []
    }

    init(data) {
        if (data != null) {
            console.log("Received data:", data);
            this.scores.push(data.wins);
            console.log("Updated scores:", this.scores);
        }
    }

    preload() {
        this.load.image("background", "images/liitutaulumusta.png")
        this.load.image("block", "images/palkki.png")
        this.load.image("board", "images/valkoinen.png")

        this.load.audio("backgroundMusicSerious", "voices/retro-action-arcade-music-for-games-free-download.mp3")

        this.load.audio("backgroundMusicHappy", "voices/positive-background-music-for-videos-and-games.mp3")

    }

    create() {
        this.music2 = this.sound.add('backgroundMusicSerious');
        this.music2.setLoop(true);
        
        this.music = this.sound.add('backgroundMusicHappy');
        this.music.setLoop(true);


        this.mainScene = this.scene.get("gameScene");
        this.mainScene.events.on('scoreData', (wins) => {
            this.murnollascores.push(wins)
            console.log(wins)

            this.add.image(280, 460, 'board')
            let j = 0
            for (let i = Math.max.apply(Math, this.murnollascores); i >= 0; i--) {
                let ind = this.murnollascores.indexOf(i)
                if (ind != -1) {
                    let text = this.add.text(70, 250+j*40, j+1 + ": " + this.murnollaplayers[ind] + "\t\t\t\t\t" + this.murnollascores[ind], {fontSize: "30px", fill: '#000000'})
                    console.log(text)
                    this.music.stop()
                    j += 1
                }
                if (j == 8) {
                    break
                }
            }
        });

        this.mainScene2 = this.scene.get("gameScene2");
        this.mainScene2.events.on('scoreData', (wins) => {
            this.neljanmurscores.push(wins)
            console.log(wins)

            this.add.image(980, 460, 'board')
            let j = 0
            for (let i = Math.max.apply(Math, this.neljanmurscores); i >= 0; i--) {
                let ind = this.neljanmurscores.indexOf(i)
                if (ind != -1) {
                    let text = this.add.text(770, 250+j*40, j+1 + ": " + this.neljanmurplayers[ind] + "\t\t\t\t\t" + this.neljanmurscores[ind], {fontSize: "30px", fill: '#000000'})
                    console.log(text)
                    this.music2.stop()
                    j += 1
                }
                if (j == 8) {
                    break
                }
            }
        });

        var bg = this.add.sprite(0,0,'background').setScale(2);
        bg.setOrigin(0,0);
        this.add.image(280, 460, 'board')
        this.add.text(70,70, 'TIC TAC TOE', {fontSize: "70px", fill: "#ffffff"})
        this.add.text(70,150, 'ScoreBoard', {fontSize: "50px", fill: "#ffffff"})
        this.add.image(250, 880, 'block').setScale(5)
        
        var text = this.add.text(70, 860, 'Game on!',  {fontSize: "50px", fill: "#0000000"})
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this.clickButtonToGame1());
        
        this.add.image(980, 460, 'board')
        this.add.text(770,70, 'MEMORY GAME', {fontSize: "70px", fill: "#ffffff"})
        this.add.text(770,150, 'ScoreBoard', {fontSize: "50px", fill: "#ffffff"})
        this.add.image(1000, 880, 'block').setScale(5)
        var text2 = this.add.text(800, 860, 'Game on!',  {fontSize: "50px", fill: "#0000000"})
        text2.setInteractive({ useHandCursor: true });
        text2.on('pointerdown', () => this.clickButtonToGame2());
        

        this.textInput = this.add.text(400, 740, 'Input name: ', { font: '35px', fill: '#ffffff' });
        this.inputText = "";

        
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Backspace' && this.inputText.length > 0) {
                this.inputText = this.inputText.slice(0, -1);
            } else if (event.key.length === 1) {
                this.inputText += event.key;
            } else if (event.key == 'Enter' && this.inputText.length > 0) {
                this.clickButtonToGame1()
            }
            this.textInput.setText('Input name: ' + this.inputText);
        });
    };
    


    clickButtonToGame1() {

        this.music.play();
        this.murnollaplayers.push(this.inputText)
        this.inputText = ""
        this.textInput.setText('Input name: ' + this.inputText);
        this.scene.switch('gameScene');
    }

    clickButtonToGame2() {

        this.music2.play();
        this.neljanmurplayers.push(this.inputText)
        this.inputText = ""
        this.textInput.setText('Input name: ' + this.inputText);
        this.scene.switch('gameScene2');
    }

    update() {

    }
}
export default TitleScene;