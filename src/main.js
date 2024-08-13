var platforms;
var player;
var cursors;
var coins;
var cardCapy;
var score = 0;
var scoreText;
var cardCapyCollected = 0;
var capyCardCollectedText;
var bombs;
var gameOver;



var ballsCount = 2;
var isPressedRight = false;
var isPressedLeft = false;
var isPressedJump = false;

var paused = false;
var resume = false;

$('#right-buttom').on('mousedown touchstart', function() {
    isPressedRight = true;
});

$('#right-buttom').on('mouseup touchend', function() {
    isPressedRight = false;
});

$('#left-buttom').on('mousedown touchstart', function() {
    isPressedLeft = true;
});

$('#left-buttom').on('mouseup touchend', function() {
    isPressedLeft = false;
});

$('#jump-buttom').on('mousedown touchstart', function() {
    isPressedJump = true;
});

$('#jump-buttom').on('mouseup touchend', function() {
    isPressedJump = false;
});


function fechar(){
    if(paused && resume){
        paused = false;
        resume = false;
        const centeredDiv = document.getElementById('centeredDiv');
        centeredDiv.classList.remove('show');
        setTimeout(() => {
            centeredDiv.style.display = 'none';
            centeredDiv.classList.remove('animate');
        }, 300);
        this.scene.resume();
    }
};






class CapyGame extends Phaser.Scene {
    preload ()
        {
            this.load.image('background', '/img/background.png');
            this.load.image('ground', '/img/ground-test.png');
            this.load.spritesheet('capy', '/img/capy.png', { frameWidth: 60, frameHeight: 48 });
            this.load.spritesheet('coin', '/img/coin.png', { frameWidth: 24 , frameHeight: 25 });
            this.load.spritesheet('card-capy', '/img/card-capy.png', { frameWidth: 28 , frameHeight: 35 });
            this.load.image('bomb', '/img/bomb.png');
        }

        create ()
        {
            createBackgroundAndPlatform(this);
            createPlayer(this);
            createCoins(this);
            createCardCapy(this);

            bombs = this.physics.add.group();
            scoreText = this.add.text(16, 16, 'Pontos: 0', { fontSize: '32px', fill: '#000' });
            capyCardCollectedText = this.add.text(380, 16, 'Cartas capivara: 0/14', { fontSize: '32px', fill: '#000' });

            cursors = this.input.keyboard.createCursorKeys();
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(coins, platforms);
            this.physics.add.collider(cardCapy, platforms);
            this.physics.add.collider(bombs, platforms);
            this.physics.add.collider(player, bombs, (player, bomb) => {
                this.scene.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
            }, null, this);
            this.physics.add.overlap(player, coins, collectCoin, null, this);
            this.physics.add.overlap(player, cardCapy, (player, card) => {
                card.disableBody(true, true);
                cardCapyCollected += 1;
                capyCardCollectedText.setText('Cartas capivara: ' + cardCapyCollected + "/14");
                // this.scene.pause();

                // const centeredDiv = document.getElementById('capy-card-'+ cardCapyCollected);
                // centeredDiv.style.display = 'block';
                            
                // requestAnimationFrame(() => {
                //     centeredDiv.classList.add('show');
                //     centeredDiv.classList.add('animate');
                // });

            }, null, this);
        }

        update(){
            if (gameOver) return;
            checkMove();
        }
}

function collectCoin (player, coin){
    coin.disableBody(true, true);
    score += 1500;
    scoreText.setText('Pontos: ' + score);
    if(coins.countActive(true) == 0){
        ballsCount++;

        let totalActiveBalls = ballsCount;

        coins.children.iterate((child) => {
            if(totalActiveBalls > 0){
                child.enableBody(true, child.x, 0, true, true);
                childCoinDefault(child);
                child.anims.play('rotate', true)
                totalActiveBalls--;
            }  
        })

        cardCapy.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true);
                childCoinDefault(child);
                child.anims.play('rotate-card-capy', true)
        })

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
    }
}

const checkMove = () => {
    if((cursors.left.isDown || isPressedLeft) && (cursors.right.isDown || isPressedRight)){
        player.setVelocityX(0);
        player.anims.play('turn', true);
    } else if(cursors.left.isDown || isPressedLeft){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if(cursors.right.isDown || isPressedRight){
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn', true);
    }
    if ((cursors.up.isDown || isPressedJump) && player.body.touching.down){
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
        repeat: 7,
    });

    bind.anims.create({
        key: 'rotate',
        frames: bind.anims.generateFrameNumbers('coin', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    let totalActiveBalls = ballsCount;

    coins.children.iterate(function (child) {
        childCoinDefault(child);
        child.anims.play('rotate', true)
        if(totalActiveBalls == 0){
            child.disableBody(true, true);
        } else {
            totalActiveBalls--;
        }
    });
}

const createCardCapy = (bind) => {
    cardCapy = bind.physics.add.group({
        key: 'card-capy',
        repeat: 1,
    });

    bind.anims.create({
        key: 'rotate-card-capy',
        frames: bind.anims.generateFrameNumbers('card-capy', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    cardCapy.children.iterate(function (child) {
        childCoinDefault(child);
        child.anims.play('rotate-card-capy', true)
    });
}

const childCoinDefault = (child) => {
    child.setBounce(1);
    child.setVelocity(Phaser.Math.Between(-100, 100), 1);
    child.setCollideWorldBounds(true);
    child.x = Phaser.Math.Between(0, 800);
    child.y = Phaser.Math.Between(0, 450);
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: CapyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);