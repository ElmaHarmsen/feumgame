var config = {
  type: Phaser.AUTO,
  width: 800, //640
  height: 600, //480
  backgroundColor: "#012235",
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

var player; //You
var power; //Items to be collected
var enemy; //To be avoided
var description;
var timer;
var scoreText;
var score = 0;
var countDown;
var cursors;
var audioBackground;
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function preload() {
  this.load.image('power', 'assets/power.svg');
  this.load.image('enemy', 'assets/enemy.svg')
  this.load.image('player', 'assets/player.svg');
  this.load.audio('background-music', 'assets/bass.mp3'); //OGG or MP3
}

function create() {
  this.add.image(400, 300, 'enemy');

  var style = { font: "25px", fill: "#fff", textalign: "center"}
  timer = this.add.text(200, 10, "Timer: 00:00", style); 
  scoreText = this.add.text(390, 10, "| Score: " + score + "%", style); 

  var Power = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:

    function Power (scene, x, y) { //Function for the items to be collected
      Phaser.GameObjects.Image.call(this, scene)

      this.setTexture('power');
      this.setPosition(x * 20, y * 20);
      this.setOrigin(0);

      this.total = 0; //By default the total collected items is nothing (0).

      scene.children.add(this);
    },

    eat: function() {
      this.total++; //+ 1 with every power eaten

      var x = Phaser.Math.Between(0, 39);
      var y = Phaser.Math.Between(0, 29);

      this.setPosition(x * 20, y * 20);
    }
  });

  var Player = new Phaser.Class({
    initialize:

    function Player (scene, x, y) {
      this.headPosition = new Phaser.Geom.Point(x, y);

      this.body = scene.add.group();

      this.head = this.body.create(x * 20, y * 20, 'player');
      this.head.setOrigin(0);

      this.alive = true;

      this.speed = 100; //a lower number stands for faster speed

      this.moveTime = 0;

      this.tail = new Phaser.Geom.Point(x, y);

      this.heading = RIGHT; //By default the player starts with going right
      this.direction = RIGHT;
    },

    update: function(time) {
      if (time >= this.moveTime) {
        return this.move(time);
      }
    },
    //The direcions
    goLeft: function() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = LEFT;
      }
    },
    goRight: function() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = RIGHT;
      }
    },
    goUp: function() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = UP;
      }
    },
    goDown: function() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = DOWN;
      }
    },
    //When going up, you can't go down; you have to go either left or right first. Also when going down.
    //When going right, you can't go left; you have to go either up or down first. Also when going left.
    move: function (time) {
      switch (this.heading) {
        case LEFT:
          this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
          break;

        case RIGHT:
          this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
          break;

        case UP:
          this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
          break;

        case DOWN:
          this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
          break;
      }

      this.direction = this.heading;

      Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 20, this.headPosition.y * 20, 1, this.tail);

      this.moveTime = time + this.speed;

      return true;
    },
 
    grow: function() {
      var newPart = this.body.create(this.tail.x, this.tail.y, 'player');

      newPart.setOrigin(0);
    },

    gameScore: function() {
      score += 1;
      scoreText.text = "| Score: " + score + "%";
    },

    eatFood: function(power) {
      if (this.head.x === power.x && this.head.y === power.y) {
        this.grow();
        power.eat();
        this.gameScore();
        if (this.speed > 0 && power.total % 5 === 0) { // && power.total % 5 === 0
          this.speed -= 25; //here we subtract right operand value from left operand value and assign the result to the left operand. 
          //So when speed is 100 we substract 20, and we set 80 (100-20=80) as the new speed
        }
        return true;
      }
      else {
        return false;
      }
    }
  });

  power = new Power(this, 30, 8);

  player = new Player(this, 8, 8);

  cursors = this.input.keyboard.createCursorKeys();

  this.audioBackground = this.sound.add('background-music');
  var musicBackgroundConfig = {
    loop: true,
    delay: 2.1 //seconds, the music starts when you hit the first visible power item
  }
  this.audioBackground.play(musicBackgroundConfig);
}

function update(time, delta) {
  if (!player.alive) {
    return;
  }
  if (cursors.left.isDown) {
    player.goLeft();
  }
  else if (cursors.right.isDown) {
    player.goRight();
  }
  else if (cursors.up.isDown) {
    player.goUp();
  }
  else if (cursors.down.isDown) {
    player.goDown();
  }
  if (player.update(time)) {
    player.eatFood(power);
  }
}

function render() {

}