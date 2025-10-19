const config = {
    type : Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 10 }
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
let prey;
let cursors;
let scoreText;
let preyTimer;
let score = 0;

function preload() {
    this.load.svg('fish1', 'assets/graphics/fish1.svg', {scale: 0.1});
    this.load.svg('fish2', 'assets/graphics/fish2.svg', {scale: 0.1});
    this.load.svg('fish3', 'assets/graphics/fish3.svg', {scale: 0.1});
    this.load.svg('fish4', 'assets/graphics/fish4.svg', {scale: 0.1});
    this.load.svg('fish5', 'assets/graphics/fish5.svg', {scale: 0.1});
    this.load.svg('fish6', 'assets/graphics/fish6.svg', {scale: 0.1});
    this.load.svg('player', 'assets/graphics/player.svg', {scale: 1.0});
    this.load.svg('grass', 'assets/graphics/grass.svg', {scale: 0.5})
    this.load.image('water', 'assets/graphics/water.png');
}
function create() {
    this.add.image(400, 300, 'water');
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
        setXY: { x: Phaser.Math.Between(250, 600), y: 450, stepX: 100 }
    });
    this.physics.add.collider(player, grass);

    prey = this.physics.add.group()

    this.physics.add.overlap(player, prey, eatPrey, null, this);

    preyTimer = this.time.addEvent({
        delay: 2000,
        callback: spawnPrey, 
        callbackScope: this,
        loop: true
    })
    function spawnPrey() {
        let x = Phaser.Math.Between(50, 750);
        let newPrey = prey.create(x, 0, `fish${Phaser.Math.Between(1,6)}`);
        newPrey.setVelocityY(Phaser.Math.Between(50, 100));
        newPrey.setVelocityX(Phaser.Math.Between(-50, 50));
    }

    function eatPrey(player, prey) {
        if (prey.texture.key === 'fish6') {
            this.scene.restart();
        } else if (prey.texture.key === 'fish5'){
            prey.disableBody(true, true);
            score += 20;
            scoreText.setText('score: ' + score);
        } else {
            prey.disableBody(true, true);
            score += 10;
            scoreText.setText('score: ' + score);
        }
    }
    scoreText = this.add.text(16, 16, 'score: 0', { fontsize: '32px', fill: '#000'})
}
function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setFlipX(true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setFlipX(false);
    }
    else {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-100);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(100);
    }
    else {
        player.setVelocityY(0);
    }
}
