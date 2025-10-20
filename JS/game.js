const config = {
    type : Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: -10 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let game = new Phaser.Game(config);
let player;
let playerSpeed = 200;
let playerVerticalSpeed = 100;
let prey;
let medusa;
let grass;
let bubble;
let treasure;
let cursors;
let scoreText;
let timerText;
let preyTimer;
let medusaTimer;
let gameTimer;
let music;
let timeLeft = 60;
let score = 0;
let gameOver = false;


function preload() {
    this.load.svg('fish1', 'assets/graphics/fish1.svg', {scale: 0.1});
    this.load.svg('fish2', 'assets/graphics/fish2.svg', {scale: 0.1});
    this.load.svg('fish3', 'assets/graphics/fish3.svg', {scale: 0.1});
    this.load.svg('fish4', 'assets/graphics/fish4.svg', {scale: 0.1});
    this.load.svg('fish5', 'assets/graphics/fish5.svg', {scale: 0.1});
    this.load.svg('fish6', 'assets/graphics/fish6.svg', {scale: 0.1});
    this.load.svg('player', 'assets/graphics/player.svg', {scale: 1.0});
    this.load.svg('grass', 'assets/graphics/grass.svg', {scale: 0.5});
    this.load.svg('medusa', 'assets/graphics/medusa.svg', {scale: 0.1});
    this.load.image('water', 'assets/graphics/water.png');
    this.load.svg('treasure', 'assets/graphics/treasure.svg', {scale: 0.2});
    this.load.image('bubble', 'assets/graphics/bubble.png');

    this.load.audio('theme', 'assets/sound/theme.mp3');
    this.load.audio('fish1', 'assets/sound/fish1.mp3');
    this.load.audio('fish2', 'assets/sound/fish2.mp3');
    this.load.audio('fish3', 'assets/sound/fish3.mp3');
    this.load.audio('fish4', 'assets/sound/fish4.mp3');
    this.load.audio('fish5', 'assets/sound/fish5.mp3');
    this.load.audio('fish6', 'assets/sound/fish6.mp3');
    this.load.audio('medusa', 'assets/sound/medusa.mp3');
}
function create() {
    this.add.image(400, 300, 'water');
    
    
    if (!music || !music.isPlaying) {
        music = this.sound.add('theme');
        music.play({loop: true, volume: 0.5});
    }

    //this.add.image(700, 550, 'treasure').setScale(0.2);
    //this.add.image(Phaser.Math.Between(100, 700), 550, 'grass');
    player = this.physics.add.sprite(100, 500, 'player');
    player.setScale(0.2);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
    
    grass = this.physics.add.group({
        immovable: true,
        allowGravity: false,
        key: 'grass',
        repeat: 0,
        setXY: { x: Phaser.Math.Between(250, 550), y: 450, stepX: 100 }
    });
    this.physics.add.collider(player, grass);
    

    prey = this.physics.add.group();
    medusa = this.physics.add.group();
    bubble = this.physics.add.group();
    treasure = this.physics.add.group({
        immovable: true,
        allowGravity: false,
        key: 'treasure',
        repeat: 0,
        setXY: { x: 700, y: 550, stepX: 100 }
    });
    
    function popTreasure(player, treasure) {
        treasure.disableBody(true, true);
        let x = treasure.x;
    
        for (let i = 0; i < Phaser.Math.Between(3, 5); i++) {
            let newPrey = prey.create(
                x + Phaser.Math.Between(-20, 20),
                550,
                `fish${Phaser.Math.Between(1,5)}`
            );
            newPrey.setVelocityY(Phaser.Math.Between(-50, -100));
            newPrey.setVelocityX(Phaser.Math.Between(-100, -150));
        }
    }
    
    this.physics.add.overlap(player, treasure, popTreasure, null, this);

    this.physics.add.overlap(player, prey, eatPrey, null, this);
    this.physics.add.overlap(player, medusa, hitMedusa, null, this);
    this.physics.add.overlap(player, bubble, hitBubble, null, this);

    function hitBubble(player, bubble) {
        bubble.disableBody(true, true);
        this.sound.play(`fish${Phaser.Math.Between(1,5)}`, {rate: 3.0, volume: 0.5})
        score += 1;
    }

    preyTimer = this.time.addEvent({
        delay: 2000,
        callback: spawnPrey, 
        callbackScope: this,
        loop: true
    })
    medusaTimer = this.time.addEvent({
        delay: 5000,
        callback: spawnMedusas,
        callbackScope: this,
        loop: true
    })
    bubbleTimer = this.time.addEvent({
        delay: 500,
        callback: spawnBubbles,
        callbackScope: this,
        loop: true
    })
    function hitMedusa(player, medusa) {
        this.sound.play('medusa');
        medusa.disableBody(true, true);
        score -= 10;
        playerSpeed = -playerSpeed;
    }
    function spawnPrey() {
        let x = Phaser.Math.Between(50, 750);
        let newPrey = prey.create(x, 0, `fish${Phaser.Math.Between(1,6)}`);
        newPrey.setVelocityY(Phaser.Math.Between(50, 100));
        newPrey.setVelocityX(Phaser.Math.Between(-50, 50));
    }
    function spawnMedusas() {
        let x = Phaser.Math.Between(50, 750);
        let newMedusa = medusa.create(x, 600, `medusa`);
        newMedusa.setVelocityY(Phaser.Math.Between(-25, -50));
        newMedusa.setVelocityX(Phaser.Math.Between(-50, 50));

    }
    function spawnBubbles() {
        let x = Phaser.Math.Between(50, 750);
        let newBubble = bubble.create(x, 600, 'bubble');
        newBubble.setVelocityY(-100);
    }

    function eatPrey(player, prey) {
        prey.disableBody(true, true);
        if (prey.texture.key === 'fish6') {
            this.sound.play('fish6');
            score -= 20;
            player.setFlipY(!player.flipY);
            playerVerticalSpeed = -playerVerticalSpeed;
        } else if (prey.texture.key === 'fish5'){
            this.sound.play('fish5');
            score += 20;
        } else if (prey.texture.key === 'fish4') {
            this.sound.play('fish4');
            playerSpeed += 25;
            score += 10;
        } else if (prey.texture.key === 'fish3') {
            this.sound.play('fish3');
            playerSpeed -= 25;
            score += 10;
        } else if (prey.texture.key === 'fish2') {
            this.sound.play('fish2');
            timeLeft += 10;
        } else {
            this.sound.play('fish1');
            score += 10;
        }
        scoreText.setText('score: ' + score);}
    
    scoreText = this.add.text(16, 16, 'score: 0', { fontsize: '32px', fill: '#000'})
    timerText = this.add.text(600, 16, 'time: ' + timeLeft, { fontsize: '32px', fill: '#000'})
    
    gameTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });
    
    function updateTimer() {
        timeLeft -= 1;
        timerText.setText('time: ' + timeLeft);
        
        if (timeLeft <= 0) {
            gameTimer.destroy();
            preyTimer.destroy();
            medusaTimer.destroy();
            bubbleTimer.destroy();
            music.stop();
            this.physics.pause();
            this.add.text(300, 300, 'Game Over, final score: ' + score, { fontsize: '64px', fill: '#000' });
            gameOver = true;
        }
    }

}
function update() {
    if (music.isPlaying) {
        music.rate = Math.max(0.5, Math.min(2.0, Math.abs(playerSpeed) / 200));
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-playerSpeed);
        player.setFlipX(true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(playerSpeed);
        player.setFlipX(false);
    }
    else {
        player.setVelocityX(10);
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-playerVerticalSpeed);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(playerVerticalSpeed);
    }
    else {
        player.setVelocityY(-10);
    }
}

