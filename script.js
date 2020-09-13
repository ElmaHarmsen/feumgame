document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".prescreen_start-game").addEventListener("click", playGame);

  function playGame() {
  var config = {
    type: Phaser.AUTO,
    width: 800, 
    height: 600, 
    backgroundColor: "#222222", //#012235
    physics: {
      default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
  };

  var game = new Phaser.Game(config);
  document.querySelector(".prescreen-game").style.display = "none";	
  document.querySelector(".endscreen-game").style.display = "none";

  var player; //You
  var power; //Items to be collected
  var enemy; //To be avoided
  var timerText;
  var scoreText;
  var score = 0;
  var countDownText;
  var endScoreText = [];
  var cursors;
  var logo;
  var UP = 0;
  var DOWN = 1;
  var LEFT = 2;
  var RIGHT = 3;

  function preload() {
    this.load.image('power', 'assets/power.svg');
    this.load.image('enemy', 'assets/enemy.svg')
    this.load.image('player', 'assets/player.svg');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('background-music', 'assets/game_song.mp3'); //OGG or MP3
    this.load.audio('eat-sound', 'assets/p-ping.mp3');
    this.load.audio('victory', 'assets/Victory.mp3');
    this.load.audio('countdown', 'assets/countdown.mp3');
  }

  function create() {
    logo = this.add.image(70, 25, 'logo');
    logo.setScale(0.2);

    var style = {font: "25px sourcecode", fill: "#fff"}
    var countDownStyle = {font: "300px sourcecode", fill: "#be03fd", backgroundColor: "#222"}

    scoreText = this.add.text(390, 12.5, "| Score: " + score + "%", style); 

    var audioEat = this.sound.add('eat-sound');

    this.initialCountdown = 3;
    countDownText = this.add.text(310, 150, + countDownFormat(this.initialCountdown), countDownStyle);
    countDownEvent = this.time.addEvent({delay: 1000, callback: countEvent, callbackScope: this, loop: true});

    this.initialTime = 90; //180 = 3 minutes
    timerText = this.add.text(210, 12.5, "Timer: " + timeFormat(this.initialTime), style);
    timedEvent = this.time.addEvent({delay: 1000, callback: timeEvent, callbackScope: this, loop: true});

    var Power = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:

      function Power (scene, x, y) { //Function for the items to be collected
        Phaser.GameObjects.Image.call(this, scene)

        setTimeout(() => {
          this.setTexture('power');
          var x = Phaser.Math.Between(5, 35);
          var y = Phaser.Math.Between(5, 25);
          this.setPosition(x * 20, y * 20);
          this.setOrigin(0);
    
          this.total = 0; //By default the total collected items is nothing (0).
    
          scene.children.add(this);
        }, 3000);
      },

      eat: function() {
        this.total++; //+ 1 with every power eaten

        var x = Phaser.Math.Between(5, 35);
        var y = Phaser.Math.Between(5, 25);

        this.setPosition(x * 20, y * 20);

        audioEat.play(); //Plays the sound of eating
      }
    });

    var Enemy = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:

      function Enemy (scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene)

        setTimeout(() => {
          this.setTexture('enemy');
          var x = Phaser.Math.Between(5, 35);
          var y = Phaser.Math.Between(5, 25);
          this.setPosition(x * 20, y * 20); //to keep the hitting of the enemy work, don't touch this line

          scene.children.add(this);
        }, 3000);
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
        score += 5;
        scoreText.text = "| Score: " + score + "%";
        if (score === 100) {
          player.alive = false;
        }
      },

      eatFood: function(power) {
        if (this.head.x === power.x && this.head.y === power.y) {
          this.grow();
          power.eat();
          this.gameScore();
          if (this.speed > 0 && power.total % 15 === 0) { // && power.total % 5 === 0
            this.speed -= 40; //here we subtract right operand value from left operand value and assign the result to the left operand. 
            //So when speed is 100 we substract 20, and we set 80 (100-20=80) as the new speed
          }
          return true;
        }
        else {
          return false;
        }
      },

      hitEnemy: function(enemy) {
        if (this.head.x === enemy.x && this.head.y === enemy.y) {
          player.alive = false;
          return true;
        }
      },

      hitMute: function() {
        this.hitEnemy();
      }
    });

    enemy = new Enemy(this, 0, 0);

    power = new Power(this, 0, 0);

    player = new Player(this, 3, 5);

    cursors = this.input.keyboard.createCursorKeys();

    this.audioBackground = this.sound.add('background-music');
    this.audioVictory = this.sound.add('victory');
    this.audioCountdown = this.sound.add('countdown');
    this.audioCountdown.play()
    var musicBackgroundConfig = {
      loop: true,
      delay: 3, //seconds, the music starts when the countdown of 3 seconds ends
    }
    this.audioBackground.play(musicBackgroundConfig); 
  }

  function countDownFormat(seconds) {
    var seconds = seconds%60;
    return `${seconds}`;
  }

  function countEvent() {
    if (this.initialCountdown != 1) { //We check if the time is not 1, if true we
      this.initialCountdown -= 1; //decrease one second
      countDownText.setText(+ countDownFormat(this.initialCountdown)); //and we set the timer text  
    }
    else {
      countDownText.setText(); //We remove the countdown
    }
  }

  function timeFormat(seconds) {
    var minutes = Math.floor(seconds/60); //The minutes
    var seconds = seconds%60; //The seconds
    seconds = seconds.toString().padStart(2, '0'); //Adds another 0 to the seconds
    return `${minutes}:${seconds}`; //The formats is returns as this
  }

  function timeEvent() {
    setTimeout(() => {
      if (this.initialTime != 0) { //We check if the time is not 0, if true we
        this.initialTime -= 1; //decrease one second
        timerText.setText('Timer: ' + timeFormat(this.initialTime)); //and we set the timer text  
      }
      else {
        player.alive = false; //The player can't move anymore
      }
    }, 2000);
  }

  function showEndScreen() {
    setTimeout(() => {
      document.querySelector(".endscreen-game").style.display = "block";
      document.querySelector(".endscreen_score-game").innerHTML = score + "%";
      if(score <= 25) {
        document.querySelector(".endscore-result").innerHTML = "At least you tried!"
      }
      else if(score > 25 && score <= 50) {
        document.querySelector(".endscore-result").innerHTML = "You're getting there!"
      }
      else if(score  > 50 && score <= 75) {
        document.querySelector(".endscore-result").innerHTML = "Nice one!"
      }
      else if(score > 75) {
        document.querySelector(".endscore-result").innerHTML = "You're doing marvelous!"
      }
    }, 500);
    this.audioVictory.play(); //errors, does play sound
  }

  function replayGame() {
    window.location.reload(true);
  }
  document.querySelector(".endscreen_replay-game").addEventListener("click", replayGame);

  function update(time) {
    if (!player.alive) {
      this.audioBackground.stop(); //When the player is not alive (because the timer stopped or you hit mute) the music stops
      this.audioVictory.play(); //No errors, doesn't play sound
      showEndScreen();
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
      player.hitEnemy(enemy);
    }
  }

  function render() {

  }
}
});