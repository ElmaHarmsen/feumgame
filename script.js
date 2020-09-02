var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

var background;
var player;
var line_pink;
var line_blue;
var arrow_right; //Directions
var power; //Items to be collected
var text;
var rightButton;
var leftButton; 
var jumpButton;
var downButton;


function preload() {
  this.load.image('background', 'assets/sky2.png');
  this.load.image('line', 'assets/line.svg');
  this.load.image('line2', 'assets/line2.svg');
  this.load.image('line-dottet', 'assets/line-dottet.svg');
  this.load.image('arrow-right', 'assets/arrow-right.svg');
  this.load.image('power', 'assets/power.svg');
  this.load.image('player', 'assets/player1.svg');
}

function create() {
  background = this.add.image(450, 300, 'background');
  background.setScale(1.5);
  player = this.add.image(50, 470, 'player');

  this.add.image(140, 500, 'line');
  this.add.image(430, 500, 'line');
  line_blue = this.add.image(700, 510, 'line2');
  line_blue.angle = 90;
  this.add.image(730, 360, 'line-dottet');
  this.add.image(805, 360, 'line-dottet');
  this.add.image(880, 360, 'line-dottet');
  this.add.image(165, 420, 'arrow-right');
  this.add.image(265, 420, 'arrow-right');
  this.add.image(365, 420, 'arrow-right');
  this.add.image(465, 420, 'arrow-right');
  arrow_right = this.add.image(565, 395, 'arrow-right');
  arrow_right.angle = -45;
  this.add.image(530, 485, 'power');
  this.add.image(830, 345, 'power');

  var style = { font: "25px", fill: "#fff", fontWeight: "bolder"}
  text = this.add.text(10, 10, "Power: 0%", style); 

  // rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  // leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  // downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

  // rightButton = this.input.keyboard.on('keydown_RIGHT')

  // this.input.keyboard.on('keydown_W', this.yourFunction, this);

  this.cursorKeys = this.input.keyboard.createCursorKeys();
}

function update() {
//   window.setTimeout(() => {
//     game.camera.x += 7;
// }, 3000)
  // if(this.cursorKeys.right.isDown) {
  //   this.player.setVelocityX(200);
  // }
}

function render() {

}