const gameOptions = {
    dudeGravity: 800*2,
    dudeSpeed: 300*2,
    blockSpeed: 200*2,
    spongeSpeed: 200*2,
    screenWidth: 631*2,
    screenHeight: 490*2
}

class GameScene2 extends Phaser.Scene {

    constructor(game) {
        super({key: 'gameScene2'})
        this.health = 5

        this.foundPairs = 0
        this.highscore = 0
        this.game = game
        this.openNum = 0
        this.cards = [[0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0]]

        this.cardplaceXcoords = []
        this.cardplaceYcoords = []

        this.suffleCards()

        this.opened = [[-1, -1], // The "coordinates" of first opened card
                       [-1, -1]] // The "coordinates" of second opened card 

        this.weHaveShuffledAgain == false
    }

    preload() {
        this.load.image("backgroundGreen", "images/liitutaulu.png")
        this.load.spritesheet("dude", "images/ukko.png", {
            frameWidth: 32,
            frameHeight: 50
        })
        this.load.image("marker", "images/palkki.png")
        this.load.image("sponge", "images/sieni.png")
        this.load.image("heart", "images/sydan.png")
        this.load.image("greenHeart", "images/sydan_vih.png")
  
        this.load.image("horbar", "images/alapalkki.png")
        this.load.image("cardback", "images/kortti_vpun.png")
        this.load.image("empty", "images/empty.png")

        this.load.image("pig", "images/possu.png")
        this.load.image("sheep", "images/lammas.png")
        this.load.image("cat", "images/kissa.png")
        this.load.image("cow", "images/lehma.png")
        this.load.image("hen", "images/kana.png")
        this.load.image("duck", "images/ankka.png")
        this.load.image("mouse", "images/hiiri.png")
        this.load.image("dog", "images/koira.png")
        this.load.image("frog", "images/sammakko.png")
        this.load.image("horse", "images/hevonen.png")

        this.load.audio("henVoice", "voices/Chicken-clucking.mp3")
        this.load.audio("duckVoice", "voices/single-duck-quack-sound-effect.mp3")
        this.load.audio("catVoice", "voices/cat-meow-sound.mp3")
        this.load.audio("dogVoice", "voices/large-dog-bark-once-sound-effect.mp3")
        this.load.audio("sheepVoice", "voices/single-sheep-baa-sound.mp3")
        this.load.audio("horseVoice", "voices/horse-neighing-sound-effect.mp3")
        this.load.audio("mouseVoice", "voices/mouse-squeaking-noise.mp3")
        this.load.audio("frogVoice", "voices/frog-noises.mp3")
        this.load.audio("pigVoice", "voices/pig-sound-effect.mp3")
        this.load.audio("cowVoice", "voices/Cow-moo-sound.mp3")

        this.load.audio("winvoice", "voices/Game-show-winner-bell-sound-effect.mp3")
        this.load.audio("looserVoice", "voices/video-game-fail-sound.mp3")
        this.load.audio("fallvoice", "voices/single-water-drop-sound-with-echo.mp3")
        this.load.audio("collectVoice", "voices/mario-money-sound.mp3")
        this.load.audio("screamVoice", "voices/red-tailed-hawk-call.mp3")
    }

    create() {


        this.cardplaceXcoords = []
        this.cardplaceYcoords = []
        this.opened = [[-1, -1], [-1, -1]]
        this.openNum = 0
        this.add.image(gameOptions.screenWidth/2, gameOptions.screenHeight/2, "backgroundGreen").setScale(2).setDepth(-2)
        this.gamebars = this.physics.add.group({
        immovable: true,
        allowGravity: false
        })

        this.pairsText = this.add.text(20, 80, "Found pairs: " + this.foundPairs, {fontSize: "38px", fill: "#ffffff"}).setDepth(1)
        this.highScoreText = this.add.text(20, 160, "High Score: " + this.highscore, {fontSize: "38px", fill: "#ffffff"}).setDepth(1)

        this.heartGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        for (let i = 0; i < this.health; i++) {
            this.heartGroup.create(50*i + 40, 40, "heart").setScale(1).setDepth(1)
        }

        this.dude = this.physics.add.sprite(gameOptions.screenWidth/2, gameOptions.screenHeight/8, 'dude').setScale(2).setDepth(4);
        this.dude.body.gravity.y = gameOptions.dudeGravity

        this.spongeGroup = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })



        this.cardgroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        this.emptyGroup = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })


        this.shownGroup = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })


        this.blockGroupLeft = this.physics.add.group({
            immovable: true,
            allowGravity: false,
            frictionX: 1,
        })

        this.blockGrouptoRight = this.physics.add.group({
            immovable: true,
            allowGravity: false,
            frictionX: 1,

        })

        for(let i = 0; i < 3; i++) {
            this.blockGroupLeft.create(Phaser.Math.Between(0, gameOptions.screenWidth), (i+1)/5*gameOptions.screenHeight-20, "marker").setScale(2);
        }

        this.blockGroupLeft.create(gameOptions.screenWidth/2, gameOptions.screenHeight/2 - 40, "marker").setScale(2);

        for(let i = 0; i < 3; i++) {
            this.blockGrouptoRight.create(Phaser.Math.Between(0, gameOptions.screenWidth), (i+4)/5*gameOptions.screenHeight-20, "marker").setScale(2);
        }

        this.physics.add.collider(this.dude, this.blockGroupLeft)
        this.physics.add.collider(this.dude, this.blockGrouptoRight)


        this.physics.add.overlap(this.dude, this.spongeGroup, this.getWiped, null, this)

        this.physics.add.overlap(this.emptyGroup, this.cardgroup, this.showCard, null, this)

        this.blockGroupLeft.setVelocityX(gameOptions.blockSpeed / 6)
        this.blockGrouptoRight.setVelocityX(-gameOptions.blockSpeed / 6)

        this.drawAllCards()

        this.cursors = this.input.keyboard.createCursorKeys()

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.anims.create({
            key: "toLeft",
            frames: this.anims.generateFrameNumbers('dude', {
                start: 9,
                end: 17
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "toTurn",
            frames: [{key: "dude", frame: 0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "toRight",
            frames: this.anims.generateFrameNumbers('dude', {
                start: 18,
                end: 26
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "toJump",
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addBlocksTotoRight,
            callbackScope: this,
            delay: 5000,
            loop: true
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addBlocksToLeft,
            callbackScope: this,
            delay: 5000,
            loop: true
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addSponges,
            callbackScope: this,
            delay: 4500,
            loop: true
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addDroppingHearts,
            callbackScope: this,
            delay: 9000,
            loop: true
        })
    }

    getHealth(dude, heart) {
        this.sound.add("collectVoice").play()
        this.health += 1
        this.updateHearts()
        heart.destroy()
    }


    drawAllCards() { // At the same time, add the coordinates in between wich the card is
        this.cardgroup.clear(true)
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.cards[j][i] != 0) {
                    this.cardgroup.create(200 + i*220, 150 + j*220, "cardback").setScale(0.8).setDepth(-1)
                }
                if (i == 0) {
                    let y = []
                    y.push(150 + j*220 - 100)
                    y.push(150 + j*220 + 100)
                    this.cardplaceYcoords.push(y)
                }
            }
            let x = []
            x.push(200 + i*220 - 100)
            x.push(200 + i*220 + 100)
            this.cardplaceXcoords.push(x)
        }
    }

    wasItAPair() {
        let eka = this.opened[0]
        let ekar = eka[0]
        let ekac = eka[1]

        let toka = this.opened[1]
        let tokar = toka[0]
        let tokac = toka[1]
        if (this.cards[ekar][ekac] == this.cards[tokar][tokac]) {
            this.foundPairs += 1
            this.sound.add("winvoice").play()
            this.pairsText.setText("Found pairs: " + this.foundPairs)
            this.cards[ekar][ekac] = 0
            this.cards[tokar][tokac] = 0
            return true
        }
        return false
    }
    

    suffleCards() {
        let allValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 5; j++) {
                let ind = Math.floor(Math.random() * allValues.length)
                this.cards[i][j] = allValues[ind]
                allValues.splice(ind, 1)
            }
        }
        if (this.shownGroup != null)
            this.shownGroup.clear(true)
        console.log(this.cards)
    }

    showCard(empty, card) {
        empty.destroy(true)

        let x = this.cardplaceXcoords
        let y = this.cardplaceYcoords 

        // console.log(x)
        // console.log(y)

        // Quite horrble if else jungle where we find the martix placement of the turned cards
        if (card.x > x[0][0] && card.x < x[0][1]){
            if (card.y > y[0][0] && card.y < y[0][1]){
                this.opened[this.openNum] = [0, 0]
            }
            else if (card.y > y[1][0] && card.y < y[1][1]) {
                this.opened[this.openNum] = [1, 0]
            }
            else if (card.y > y[2][0] && card.y < y[2][1]) {
                this.opened[this.openNum] = [2, 0]
            }
            else if (card.y > y[3][0] && card.y < y[3][1]) {
                this.opened[this.openNum] = [3, 0]
            }
        }
        else if (card.x > x[1][0] && card.x < x[1][1]) {
            if (card.y > y[0][0] && card.y < y[0][1]){
                this.opened[this.openNum] = [0, 1]
            }
            else if (card.y > y[1][0] && card.y < y[1][1]) {
                this.opened[this.openNum] = [1, 1]
            }
            else if (card.y > y[2][0] && card.y < y[2][1]) {
                this.opened[this.openNum] = [2, 1]
            }
            else if (card.y > y[3][0] && card.y < y[3][1]) {
                this.opened[this.openNum] = [3, 1]
            }
        }
        else if (card.x > x[2][0] && card.x < x[2][1]) {
            if (card.y > y[0][0] && card.y < y[0][1]){
                this.opened[this.openNum] = [0, 2]
            }
            else if (card.y > y[1][0] && card.y < y[1][1]) {
                this.opened[this.openNum] = [1, 2]
            }
            else if (card.y > y[2][0] && card.y < y[2][1]) {
                this.opened[this.openNum] = [2, 2]
            }
            else if (card.y > y[3][0] && card.y < y[3][1]) {
                this.opened[this.openNum] = [3, 2]
            }
        }
        else if (card.x > x[3][0] && card.x < x[3][1]) {
            if (card.y > y[0][0] && card.y < y[0][1]){ 
                this.opened[this.openNum] = [0, 3]
            }
            else if (card.y > y[1][0] && card.y < y[1][1]) {
                this.opened[this.openNum] = [1, 3]
            }
            else if (card.y > y[2][0] && card.y < y[2][1]) {
                this.opened[this.openNum] = [2, 3]
            }
            else if (card.y > y[3][0] && card.y < y[3][1]) {
                this.opened[this.openNum] = [3, 3]
            }
        }
        else if (card.x > x[4][0] && card.x < x[4][1]) {
            if (card.y > y[0][0] && card.y < y[0][1]){ 
                this.opened[this.openNum] = [0, 4]
            }
            else if (card.y > y[1][0] && card.y < y[1][1]) {
                this.opened[this.openNum] = [1, 4]
            }
            else if (card.y > y[2][0] && card.y < y[2][1]) {
                this.opened[this.openNum] = [2, 4]
            }
            else if (card.y > y[3][0] && card.y < y[3][1]) {
                this.opened[this.openNum] = [3, 4]
            }
        }
        console.log(this.opened)
        
        card.visible = false

        this.drawRightAnimalPic(this.opened[this.openNum])

        this.openNum += 1

        

        if (this.openNum == 2) {

            if (!this.wasItAPair()) {
                this.triggerTimer = this.time.addEvent({
                    callback: () => {
                        this.cardgroup.getChildren().forEach(element => {
                            element.visible = true
                            
                        });
                        this.openNum = 0
                        this.opened = [[-1, -1], [-1, -1]]
                    },
                    callbackScope: this,
                    delay: 1000,
                    loop: false
            })   
            }
            else {
                this.cardgroup.getChildren().forEach(element => {
                    if (element.visible == false) {
                        element.destroy(true)
                    //    console.log("DESTROYING")
                    }
                })
               // console.log("moi")
                this.cardgroup.getChildren().forEach(element => {
                    if (element.visible == false) {
                        element.destroy(true)
                      //  console.log("DESTROYING")
                    }
                })
         
                this.openNum = 0
                this.opened = [[-1, -1], [-1, -1]]
                 
            }



        }
        if (this.foundPairs % 10 == 0 && this.foundPairs != 0 && this.weHaveShuffledAgain == false) {
            this.openNum = 0
            this.weHaveShuffledAgain = true
            this.opened = [[-1, -1], [-1, -1]]
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    this.suffleCards()
                    console.log("SHUFFLINGG")
                    this.drawAllCards()
                    this.shownGroup.clear(true)
                },
                callbackScope: this,
                delay: 1000,
                loop: false
            })
        }
        if (this.foundPairs % 10 == 1) {
            this.weHaveShuffledAgain = false
        }
    }

    drawRightAnimalPic(coordinates) {

        let picnum = this.cards[coordinates[0]][coordinates[1]]
        
        if (picnum == 1) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "pig").setScale(0.8).setDepth(-2)
            let pigvoice = this.sound.add("pigVoice")
            pigvoice.play()
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    pigvoice.stop()
                },
                callbackScope: this,
                delay: 500,
                loop: false
        })   
        }
        else if (picnum == 2) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "sheep").setScale(0.8).setDepth(-2)
            let sheepvoice = this.sound.add("sheepVoice")
            sheepvoice.play()
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    sheepvoice.stop()
                },
                callbackScope: this,
                delay: 900,
                loop: false
        })   
        }
        else if (picnum == 3) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "cat").setScale(0.8).setDepth(-2)
            this.sound.add("catVoice").play()
        }
        else if (picnum == 4) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "cow").setScale(0.8).setDepth(-2)
            this.sound.add("cowVoice").play()
        }
        else if (picnum == 5) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "hen").setScale(0.8).setDepth(-2)
            let henvoice = this.sound.add("henVoice")
            henvoice.play()
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    henvoice.stop()
                },
                callbackScope: this,
                delay: 1000,
                loop: false
        })   
        }
        else if (picnum == 6) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "duck").setScale(0.8).setDepth(-2)
            this.sound.add("duckVoice").play()
        }
        else if (picnum == 7) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "mouse").setScale(0.8).setDepth(-2)
            let mouseVoice = this.sound.add("mouseVoice")
            mouseVoice.play()
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    mouseVoice.stop()
                },
                callbackScope: this,
                delay: 1000,
                loop: false
        })   
        }
        else if (picnum == 8) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "dog").setScale(0.8).setDepth(-2)
            this.sound.add("dogVoice").play()
        }
        else if (picnum == 9) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "frog").setScale(0.8).setDepth(-2)
            let frogVoice = this.sound.add("frogVoice")
            frogVoice.play()
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    frogVoice.stop()
                },
                callbackScope: this,
                delay: 500,
                loop: false
        })  
        }
        else if (picnum == 10) {
            this.shownGroup.create(200 + coordinates[1]*220, 150 + coordinates[0]*220, "horse").setScale(0.8).setDepth(-2)
            this.sound.add("horseVoice").play()
        }
    }

    turnCard() {
        if ((this.openNum == 0) || (this.openNum == 1)) {
            this.emptyGroup.create(this.dude.x, this.dude.y, 'empty')
        }
        
    }

    updateHearts() {
        this.heartGroup.clear(true)
        for (let i = 0; i < this.health; i++) {
            this.heartGroup.create(50*i + 40, 40, "heart").setScale(1).setDepth(1)
        }
        if (this.health == 0) {
            this.sound.add("looserVoice").play()
            this.events.emit('scoreData', this.foundPairs );
            this.health = 5
            this.foundPairs = 0
            this.suffleCards()
            this.drawAllCards()
            this.openNum = 0
            this.opened = [[-1, -1], [-1, -1]]
            this.pairsText.setText("Found pairs: " + this.foundPairs)
            this.scene.switch('titleScene', { wins: this.foundPairs });
        }
    }

    addSponges() {
        let chans = Math.random()
        if (chans > 0 && chans < 0.5) {
            this.spongeGroup.create(Phaser.Math.Between(0, gameOptions.screenWidth/3), -30, "sponge").setScale(2)
            this.spongeGroup.setVelocityY(gameOptions.spongeSpeed)
            this.spongeGroup.setDepth(2)
        }

        if (chans > 0.5) {
            this.spongeGroup.create(Phaser.Math.Between(2*gameOptions.screenWidth/3, gameOptions.screenWidth), -30, "sponge").setScale(2)
            this.spongeGroup.setVelocityY(gameOptions.spongeSpeed)
            this.spongeGroup.setDepth(2)
        }
       
    }

    addDroppingHearts() {
        let dropHeart = this.physics.add.sprite(Phaser.Math.Between(0, gameOptions.screenWidth), -30, 'greenHeart').setScale(2);
        dropHeart.body.gravity.y = gameOptions.dudeGravity / 5

        this.physics.add.collider(dropHeart, this.blockGrouptoRight)
        this.physics.add.collider(dropHeart, this.blockGroupLeft)

        this.physics.add.overlap(this.dude, dropHeart, this.getHealth, null, this)
    }

    addBlocksTotoRight() {
        this.blockGrouptoRight.create(gameOptions.screenWidth + 50, 100*Math.floor(Phaser.Math.Between(0, 11)) + 50, "marker").setScale(2)
        this.blockGrouptoRight.setVelocityX(-gameOptions.blockSpeed / 6)
        this.blockGrouptoRight.setDepth(1)
    }

    addBlocksToLeft() {
        this.blockGroupLeft.create(-50, 100*Math.floor(Phaser.Math.Between(0, 11)) + 50, "marker").setScale(2)
        this.blockGroupLeft.setVelocityX(gameOptions.blockSpeed / 6)
        this.blockGroupLeft.setDepth(1)
    }

    getWiped(dude, sponge) {
        this.sound.add("screamVoice").play()
        sponge.destroy(true)
        this.startOverPlay()
    }


    startOverPlay() {
        this.dude.body.x = gameOptions.screenWidth/2
        this.dude.body.y = gameOptions.screenHeight/4
         
        this.dude.body.setVelocityX(0)
        this.dude.body.setVelocityY(-10)

        // this.opened = [[-1, -1], [-1, -1]]
        // this.openNum = 0

        // this.cardgroup.getChildren().forEach(element => {
        //     element.visible = true
        // });


        this.triggerTimer = this.time.addEvent({
            callback: () => {
                this.health -= 1
                this.updateHearts()
                this.blockGroupLeft.create(gameOptions.screenWidth/2, Phaser.Math.Between(gameOptions.screenHeight/2 - 40, gameOptions.screenHeight), "marker").setScale(2);
                this.blockGroupLeft.setVelocityX(gameOptions.blockSpeed / 6)
        
            },
            callbackScope: this,
            delay: 1500,
            loop: false
        })
    }


    update() {


        if (this.cardgroup.getChildren().length == 0) {
            this.suffleCards()
            this.drawAllCards()
        } 
        
        if(this.cursors.left.isDown) {
            this.dude.body.velocity.x = -gameOptions.dudeSpeed
            this.dude.anims.play("toLeft", true)
        }
        else if(this.cursors.right.isDown) {
            this.dude.body.velocity.x = gameOptions.dudeSpeed
            this.dude.anims.play("toRight", true)
        }
        else {
            this.dude.body.velocity.x = 0
            this.dude.anims.play("toTurn", true)
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down) {
            this.dude.anims.play("toJump", true)
            this.dude.body.velocity.y = -gameOptions.dudeGravity / 1.5
        }

        if (this.dude.y > gameOptions.screenHeight) {
            this.dude.x = gameOptions.screenWidth/2
            this.dude.y = gameOptions.screenHeight/4
            this.sound.add("fallvoice").play()
            this.startOverPlay()
        }

        if ((this.keySPACE.isDown )) {
            this.keySPACE.isDown = false
            this.keySPACE.enabled = false
            this.turnCard()  
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    this.keySPACE.enabled = true  
                },
                callbackScope: this,
                delay: 200,
                loop: false
            })
        }

        if(this.dude.x < 0) {
            this.dude.x += 5
            this.dude.body.velocity.x = 0
        }

        if (this.dude.x > gameOptions.screenWidth) {
            this.dude.x -= 5
            this.dude.body.velocity.x = 0
        }
    }
}
export default GameScene2;