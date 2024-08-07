var platforms;
var player;
var cursors;
var coins;


class Example extends Phaser.Scene {
        preload ()
        {
            this.load.image('background', '/img/background-test.png');
            this.load.image('ground', '/img/ground-test.png');
            this.load.spritesheet('capy', '/img/capy.png', { frameWidth: 60, frameHeight: 48 });
            this.load.spritesheet('coin', '/img/coin.png', { frameWidth: 24 , frameHeight: 25 });

        }

        create ()
        {
            createBackgroundAndPlatform(this);
            createPlayer(this);
            createCoins(this);

            cursors = this.input.keyboard.createCursorKeys();
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(coins, platforms);
            this.physics.add.overlap(player, coins, collectCoin, null, this);


        }

        update(){
            checkMove();
        }
    }

    function collectCoin (player, coin){
        coin.disableBody(true, true);
    }

    const checkMove = () => {
        if(cursors.left.isDown){
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if(cursors.right.isDown){
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn', true);
        }

        if (cursors.up.isDown && player.body.touching.down){
                player.setVelocityY(-330);
        }
    }

    const createBackgroundAndPlatform = (bind) => {
        bind.add.image(400, 300, 'background');

        platforms = bind.physics.add.staticGroup();

        //ground
        platforms.create(0, 600, 'ground').setScale(3).refreshBody();
        platforms.create(850, 600, 'ground').setScale(3).refreshBody();
        //right
        platforms.create(600, 100, 'ground');
        platforms.create(700, 300, 'ground');
        platforms.create(700, 500, 'ground');
        //left
        platforms.create(100, 300, 'ground');
        platforms.create(100, 500, 'ground');
        //middle
        platforms.create(350, 400, 'ground');
        platforms.create(350, 195, 'ground');
    }

    const createPlayer = (bind) => {
        player = bind.physics.add.sprite(100, 450, 'capy');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);
        bind.anims.create({
            key: 'left',
            frames: bind.anims.generateFrameNumbers('capy', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        bind.anims.create({
            key: 'turn',
            frames: [ { key: 'capy', frame: 5 } ],
            frameRate: 20
        });
        bind.anims.create({
            key: 'right',
            frames: bind.anims.generateFrameNumbers('capy', { start: 6, end: 10 }),
            frameRate: 10,
            repeat: -1
        });
    }

    const createCoins = (bind) => {
        coins = bind.physics.add.group({
            key: 'coin',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        bind.anims.create({
            key: 'rotate',
            frames: bind.anims.generateFrameNumbers('coin', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.anims.play('rotate', true)
        });
    }

    

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: Example,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        }
    };

const game = new Phaser.Game(config);