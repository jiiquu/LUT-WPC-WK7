const config = {
    type : Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
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
let cursors;

function preload() {
    this.load.svg('fish1', 'assets/graphics/fish1.svg', {scale: 0.2});
    this.load.svg('fish2', 'assets/graphics/fish2.svg', {scale: 0.2});
    this.load.svg('player', 'assets/graphics/player.svg', {scale: 1.0});
    this.load.image('water', 'assets/graphics/water.png');
}
function create() {
    this.add.image(400, 300, 'water');
    player = this.physics.add.sprite(400, 300, 'player');
    player.setScale(0.2);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();
}
function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.setFlipX(true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(100);
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
