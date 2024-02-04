class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.shootStat = 0
        this.score = 0;

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        let backgroundBox = this.add.graphics()
        backgroundBox.fillStyle('#000000', 1)
        backgroundBox.fillRect(0,0,130,70)

        this.shoot = this.add.text(10, 50, '', {fontSize: '16px', fill: "#FFFFFF"})
        this.scores = this.add.text(10, 30, '', {fontSize: '16px', fill: "#FFFFFF"})
        this.shootPercentage = this.add.text(10, 10, '', {fontSize: '16px', fill: "#FFFFFF"})



        // add cup
        this.cup = this.physics.add.sprite(width / 2 , height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width /4 )
        this.cup.body.setOffset(this.cup.width /4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width /3, height / 0.9, 'ball' )
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)

        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let WallA = this.physics.add.sprite(0, height / 4, 'wall')
        WallA.setX(Phaser.Math.Between(0 + WallA.width/2, width - WallA.width/2))
        WallA.body.setImmovable(true) 
        
        let WallB = this.physics.add.sprite(0, height / 2, 'wall')
        WallB.setX(Phaser.Math.Between(0 + WallB.width/2, width - WallB.width/2))
        WallB.body.setImmovable(true) 

        this.walls = this.add.group([WallA, WallB])
     
        // add one-way
        this.Speed = 2
        this.Direction = 1
        this.oneWay = this.physics.add.sprite(width/2, height/1.5+2, 'oneway')
        this.oneWay.setX(Phaser.Math.Between (0 + this.oneWay.width / 2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false



        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            let shotDirectionX = pointer.x - this.ball.x
            let velocityX = Math.sign(shotDirectionX) * this.SHOT_VELOCITY_X //added x direction when clicking 
            this.ball.body.setVelocityX(shotDirectionX) 
          
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)

            this.shootStat++ //tracks times the player shoots 
  

        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.setPosition(width / 3, height * 0.9)   
            this.ball.body.setVelocity(0) //ball resets and stop moving at spawn. 
            this.score++ //tracks succesful hits 
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)
        
        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        //Moves between bounds sides 
        this.oneWay.x += this.Speed * this.Direction

        if (this.oneWay.x >= this.sys.game.config.width - this.oneWay.width /2 || this.oneWay.x <= this.oneWay.width / 2 ) {
            this.Direction *= -1
        } 
        
        //in game stat
        this.shoot.setText('Shots: ' + this.shootStat)
        this.scores.setText('Score: ' + this.score)

        let percent = this.shootStat > 0 ? Math.round((this.score / this.shootStat) * 100) : 0
        this.shootPercentage.setText('Accuracy: ' + percent + '%')


    }
}

