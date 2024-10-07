const gameOptions = {
    guyGravity: 800*2,
    guySpeed: 300*2,
    blockSpeed: 200*2,
    spongeSpeed: 200*2,
    screenWidth: 631*2,
    screenHeight: 490*2
}

class GameScene extends Phaser.Scene {

    constructor(game) {
        super({key: 'gameScene'})
        this.health = 5
        this.play = [[0, 0, 0],
                     [0, 0, 0],
                     [0, 0, 0]]
        this.losses = 0
        this.wins = 0
        this.highscore = 0
        this.game = game
    }

    preload() {
        this.load.image("backgroundGreen", "images/liitutaulu.png")
        this.load.spritesheet("guy", "images/ukko.png", {
            frameWidth: 32,
            frameHeight: 50
        })
        this.load.image("block", "images/palkki.png")
        this.load.image("sponge", "images/sieni.png")
        this.load.image("heart", "images/sydan.png")
        this.load.image("O", "images/nolla.png")
        this.load.image("X", "images/risti.png")
        this.load.image("cross_blu", "images/ristikko.png")

        this.load.image("greenHeart", "images/sydan_vih.png")

        this.load.audio("lostVoice", "voices/game-negative-sound.mp3")
        this.load.audio("winvoice", "voices/Game-show-winner-bell-sound-effect.mp3")
        this.load.audio("failvoice", "voices/failure-sound.mp3")
        this.load.audio("fallvoice", "voices/single-water-drop-sound-with-echo.mp3")
        this.load.audio("collectVoice", "voices/mario-money-sound.mp3")
        this.load.audio("screamVoice", "voices/red-tailed-hawk-call.mp3")
        this.load.audio("drawVoice", "voices/baseball-bat-hit-sound-effect.mp3")

    }

    create() {

        this.add.image(gameOptions.screenWidth/2, gameOptions.screenHeight/2, "backgroundGreen").setScale(2)
        this.add.image(gameOptions.screenWidth/2, gameOptions.screenHeight/2, "cross_blu").setScale(3)
        
        this.winsText = this.add.text(20, 80, "Wins: " + this.wins, {fontSize: "40px", fill: "#ffffff"})
        this.lossesText = this.add.text(20, 120, "Losses: " + this.losses, {fontSize: "40px", fill: "#ffffff"})
        this.highScoreText = this.add.text(20, 160, "High Score: " + this.highscore, {fontSize: "40px", fill: "#ffffff"})

        this.heartGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        for (let i = 0; i < this.health; i++) {
            this.heartGroup.create(50*i + 40, 40, "heart")
        }

        this.guy = this.physics.add.sprite(gameOptions.screenWidth/2, gameOptions.screenHeight/8, 'guy').setScale(2);
        this.guy.body.gravity.y = gameOptions.guyGravity

        this.spongeGroup = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })

        this.crossGroup = this.physics.add.group({
            immovable: true,
            allowGravity: true
        })

        this.circleGroup = this.physics.add.group({
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
            this.blockGroupLeft.create(Phaser.Math.Between(0, gameOptions.screenWidth), (i+1)/5*gameOptions.screenHeight-20, "block").setScale(2).setDepth(1);
        }

        this.blockGroupLeft.create(gameOptions.screenWidth/2, gameOptions.screenHeight/2 - 40, "block").setScale(2).setDepth(1);

        for(let i = 0; i < 3; i++) {
            this.blockGrouptoRight.create(Phaser.Math.Between(0, gameOptions.screenWidth), (i+4)/5*gameOptions.screenHeight-20, "block").setScale(2).setDepth(1);
        }

        this.physics.add.collider(this.guy, this.blockGroupLeft)
        this.physics.add.collider(this.guy, this.blockGrouptoRight)


        this.physics.add.overlap(this.guy, this.spongeGroup, this.getWiped, null, this)

        this.blockGroupLeft.setVelocityX(gameOptions.blockSpeed / 6)
        this.blockGrouptoRight.setVelocityX(-gameOptions.blockSpeed / 6)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        if (Math.floor(Math.random() * 2) == 1) {
            this.drawCircle()
        }


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers('guy', {
                start: 9,
                end: 17
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{key: "guy", frame: 0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers('guy', {
                start: 18,
                end: 26
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers('guy', {
                start: 0,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addBlocksTotoRight,
            callbackScope: this,
            delay: 4400,
            loop: true
        })

        this.triggerTimer = this.time.addEvent({
            callback: this.addBlocksToLeft,
            callbackScope: this,
            delay: 4400,
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
            delay: 10000,
            loop: true
        })

    }

    getHealth(dude, heart) {
        this.sound.add("collectVoice").play()
        this.health += 1
        this.updateHearts()
        heart.destroy()
    }

    addDroppingHearts() {
        let dropHeart = this.physics.add.sprite(Phaser.Math.Between(0, gameOptions.screenWidth), -30, 'greenHeart').setScale(2);
        dropHeart.body.gravity.y = gameOptions.guyGravity / 5

        this.physics.add.collider(dropHeart, this.blockGrouptoRight)
        this.physics.add.collider(dropHeart, this.blockGroupLeft)

        this.physics.add.overlap(this.guy, dropHeart, this.getHealth, null, this)
    }


    updateHearts() {
        this.heartGroup.clear(true)
        for (let i = 0; i < this.health; i++) {
            this.heartGroup.create(50*i + 40, 40, "heart").setScale(1).setDepth(1)
        }
        if (this.health <= 0) {
            this.sound.add("lostVoice").play()
            this.events.emit('scoreData', this.wins );
            this.health = 5
            this.wins = 0
            this.losses = 0
            this.lossesText.setText("Losses: " + this.losses)
            this.winsText.setText("Wins: " + this.wins)
            this.scene.switch('titleScene', { wins: this.wins });
        }
    }

    addSponges() {
        if (Phaser.Math.Between(0, 1)) {
            this.spongeGroup.create(Phaser.Math.Between(0, gameOptions.screenWidth), 0, "sponge").setScale(2).setDepth(0)
            this.spongeGroup.setVelocityY(gameOptions.spongeSpeed)
        }
    }

    addBlocksTotoRight() {
        this.blockGrouptoRight.create(gameOptions.screenWidth + 50, 100*Math.floor(Phaser.Math.Between(0, 11)) + 50, "block").setScale(2)
        this.blockGrouptoRight.setVelocityX(-gameOptions.blockSpeed / 6)
        this.blockGrouptoRight.setDepth(1)
    }

    addBlocksToLeft() {
        this.blockGroupLeft.create(-50, 100*Math.floor(Phaser.Math.Between(0, 11)) + 50, "block").setScale(2)
        this.blockGroupLeft.setVelocityX(gameOptions.blockSpeed / 6)
        this.blockGroupLeft.setDepth(1)
    }

    getWiped(guy, sponge) {
        this.sound.add("screamVoice").play()
        this.health -= 1
        this.updateHearts()
        this.play = [[0, 0, 0],
                     [0, 0, 0],
                     [0, 0, 0]]
                     
        console.log(this.health)
        
        this.scene.start("gameScene")
    }

    drawCross() {


        let ok = false
        if (this.guy.body.x > 320 && this.guy.body.x < 510) {
            if (this.guy.body.y > 190 && this.guy.body.y < 360) {
                if (this.play[0][0] == 0) {
                    this.play[0][0] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 360 && this.guy.body.y < 560) {
                if (this.play[1][0] == 0) {
                    this.play[1][0] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 560 && this.guy.body.y < 780) {
                if (this.play[2][0] == 0) {
                    this.play[2][0] = 1
                    ok = true
                    console.log(this.play)
                }
            }
        }
        else if (this.guy.body.x > 510 && this.guy.body.x < 710) {
            if (this.guy.body.y > 190 && this.guy.body.y < 360) {
                if (this.play[0][1] == 0) {
                    this.play[0][1] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 360 && this.guy.body.y < 560) {
                if (this.play[1][1] == 0) {
                    this.play[1][1] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 560 && this.guy.body.y < 780) {
                if (this.play[2][1] == 0) {
                    this.play[2][1] = 1
                    ok = true
                    console.log(this.play)
                }
            }
        }
        else if (this.guy.body.x > 710 && this.guy.body.x < 930) {
            if (this.guy.body.y > 190 && this.guy.body.y < 360) {
                if (this.play[0][2] == 0) {
                    this.play[0][2] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 360 && this.guy.body.y < 560) {
                if (this.play[1][2] == 0) {
                    this.play[1][2] = 1
                    ok = true
                    console.log(this.play)
                }
            }
            else if (this.guy.body.y > 560 && this.guy.body.y < 780) {
                if (this.play[2][2] == 0) {
                    this.play[2][2] = 1
                    ok = true
                    console.log(this.play)
                }
            }
        }
        if (ok) {
            this.crossGroup.create(this.guy.x, this.guy.y, "X").setScale(2)
            this.sound.add("drawVoice").play()
            console.log(this.play)
            this.drawCircle()
        }
    }


    drawCircle() {
        // Get random row to start with and add all indexes of that rows 0's to it
        
        if (this.didSomeOneWin()){
            return
        }
        if (this.isItFull()) {
            this.startOverPlay()
            return
        }
        let oSpot = []
        let i = Math.floor(Math.random() * 3)
        let inds =  []
        let ind = this.play[i].indexOf(0);
        while (ind !== -1) {
            inds.push(ind);
            ind = this.play[i].indexOf(0, ind + 1);
        }
        if (inds.length != 0) {
            oSpot.push(i)
            oSpot.push(inds[Math.floor(Math.random() * inds.length)])
        }

        else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.play[i][j] == 0){
                        oSpot.push(i)
                        oSpot.push(j)
                        break
                    }
                }
            }
        }
        
        this.play[oSpot[0]][oSpot[1]] = 4 
        let x = 0
        let y = 0
        if (oSpot[1] == 0){
            x = 430
        } else if (oSpot[1] == 1) {
            x = 630
        } else {
            x = 830
        }
        if (oSpot[0] == 0){
            y = 290
        } else if (oSpot[0] == 1) {
            y = 490
        } else {
            y = 690
        }

        this.circleGroup.create(x, y, "O").setScale(2)

        if (this.didSomeOneWin()){
            return
        }
        if (this.isItFull()) {
            this.startOverPlay()
            return
        }
    }

    isItFull() {
        let count = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.play[i][j] == 0){
                    count += 1
                    break
                }
            }
        }
        if (count == 0) {
            return true
        } else {
            return false
        }
    }

    didSomeOneWin() {
        let rowsums = [0, 0, 0]
        let columnsums = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rowsums[i] += this.play[i][j]
                columnsums[j] += this.play[i][j]
            }
        }
        let crosssums = [0, 0]
        crosssums[0] = this.play[0][0] + this.play[1][1] + this.play[2][2]
        crosssums[1] = this.play[2][0] + this.play[1][1] + this.play[0][2]
        if (rowsums.indexOf(12) != -1 || columnsums.indexOf(12) != -1 || crosssums.indexOf(12) != -1) {
            this.losses += 1
            this.health -= 1
            this.sound.add("failvoice").play()
            this.lossesText.setText("Losses: " + this.losses)
            this.startOverPlay()
            return true
        }
        if ((rowsums.indexOf(3) != -1) || columnsums.indexOf(3) != -1  || crosssums.indexOf(3) != -1) {
            this.wins += 1
            this.sound.add("winvoice").play()
            this.winsText.setText("Wins: " + this.wins)
            if (this.wins > this.highscore) {
                this.highscore = this.wins
                this.highScoreText.setText("High Score: " + this.highscore)
            }
            this.startOverPlay()
            return true
        }
        return false
    }

    startOverPlay() {
        console.log(this.wins)
        console.log(this.losses)
        this.triggerTimer = this.time.addEvent({
            callback: () => {
                this.circleGroup.clear(true)
                this.crossGroup.clear(true)
                console.log("we are here")
                this.play = [[0, 0, 0],
                            [0, 0, 0],
                            [0, 0, 0]]
                if (Math.floor(Math.random() * 2) == 1) {
                    this.drawCircle()
                }
            },
            callbackScope: this,
            delay: 1500,
            loop: false
        })
    }


    update() {
        
        if(this.cursors.left.isDown) {
            this.guy.body.velocity.x = -gameOptions.guySpeed
            this.guy.anims.play("left", true)
        }
        else if(this.cursors.right.isDown) {
            this.guy.body.velocity.x = gameOptions.guySpeed
            this.guy.anims.play("right", true)
        }
        else {
            this.guy.body.velocity.x = 0
            this.guy.anims.play("turn", true)
        }

        if(this.cursors.up.isDown && this.guy.body.touching.down) {
            this.guy.anims.play("jump", true)
            this.guy.body.velocity.y = -gameOptions.guyGravity / 1.5
        }

        if (this.guy.y > gameOptions.screenHeight) {
            
            this.sound.add("fallvoice").play()
            this.scene.start("gameScene")
            this.health -= 1
            this.updateHearts()
            this.play = [[0, 0, 0],
                        [0, 0, 0],
                        [0, 0, 0]]

                     
        }

        if ((this.keySPACE.isDown  )) {
            this.keySPACE.isDown = false
            this.keySPACE.enabled = false
            this.drawCross()  
            this.triggerTimer = this.time.addEvent({
                callback: () => {
                    this.keySPACE.enabled = true  
                },
                callbackScope: this,
                delay: 100,
                loop: true
            })
        }

        if(this.guy.x < 0) {
            this.guy.x += 5
            this.guy.body.velocity.x = 0
        }

        if (this.guy.x > gameOptions.screenWidth) {
            this.guy.x -= 5
            this.guy.body.velocity.x = 0
        }
    }
}
export default GameScene;