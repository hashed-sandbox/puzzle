"use strict";

enchant();

var Board = Class.create(Group, {
  initialize: function() {
    var core = Core.instance;

    Group.call(this);

    this.colors = [
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7]
    ];

    // store numbers which each block has
    // `0` indicates the square is empty
    this.nums = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // store number-images drawn on the board
    this.numberImgs = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    this.tracedItems = [];
    this.prevPos = { x: null, y: null };

    var squareSize = 30;
    var map = new Map(squareSize, squareSize);
    map.image = core.assets["img/blocks.png"];
    map.loadData(this.colors);

    this.addChild(map);

    this.addEventListener("enterframe", function(ev) {
      // operations invoked at the rate of 60 fps
      this.updateColors();
    });

    this.moveTo(380, 260);
  },

  updateColors: function() {
    this.firstChild.loadData(this.colors);
  },

  bePossible: function() {
    //
  },

  paintMacroBlock: function(macroBlock, x, y) {
    var core = Core.instance;
    var order = blockCords[macroBlock.colorID][macroBlock.direction];

    for (var i = 0; i < 4; i++) {
      var relativeX = order[i][0];
      var relativeY = order[i][1];

      this.colors[y + relativeY][x + relativeX] = macroBlock.colorID;
      this.nums[y + relativeY][x + relativeX] = macroBlock.numbers[i];

      var numberImg = new Sprite(30, 30);
      numberImg.x = (x + relativeX) * 30;
      numberImg.y = (y + relativeY) * 30;
      numberImg.image = core.assets["img/numbers.png"];
      numberImg.frame = macroBlock.numbers[i] - 1;

      numberImg.addEventListener("touchmove", function(ev) {
        // this <- board
        var currentPos = calcPosFromPx(ev.x, ev.y);

        if (this.prevPos.x === null && this.prevPos.y === null &&
            this.nums[currentPos.y][currentPos.x] === 1) {
          this.tracedItems.push({
            x: currentPos.x,
            y: currentPos.y,
            num: 1
          });
          this.prevPos = currentPos;
          return;
        }

        if ((currentPos.x === this.prevPos.x + 1 && currentPos.y === this.prevPos.y) ||
            (currentPos.x === this.prevPos.x - 1 && currentPos.y === this.prevPos.y) ||
            (currentPos.x === this.prevPos.x && currentPos.y === this.prevPos.y + 1) ||
            (currentPos.x === this.prevPos.x && currentPos.y === this.prevPos.y - 1)) {
          if (this.tracedItems.length < 4) {
            this.tracedItems.push({
              x: currentPos.x,
              y: currentPos.y,
              num: this.nums[currentPos.y][currentPos.x]
            });
            this.prevPos = currentPos;
          }
        }
      }.bind(this));

      numberImg.addEventListener("touchend", function(ev) {
        // this <- board
        if (this.tracedItems.length === 4 && // tracedItems[i] is not undefined
            this.tracedItems[0].num === 1 && this.tracedItems[1].num === 2 &&
            this.tracedItems[2].num === 3 && this.tracedItems[3].num === 4) {
          makeChain();

          for (var i = 0; i < 4; i++) {
            var x = this.tracedItems[i].x;
            var y = this.tracedItems[i].y;

            this.colors[y][x] = 7;
            this.nums[y][x] = 0;

            this.removeChild(this.numberImgs[y][x]);
            delete this.numberImgs[y][x];
            this.numberImgs[y][x] = null;
          }
        }

        this.tracedItems = [];
        this.prevPox = { x: null, y: null };
      }.bind(this));

      this.addChild(numberImg);
      this.numberImgs[y + relativeY][x + relativeX] = numberImg;

      if (core.activePlayer === 1) {
        core.rootScene.addChild(core.covers[0]);
      } else {
        core.rootScene.addChild(core.covers[1]);
      }
    }
  }
});

var Holder = Class.create(Sprite, {
  initialize: function(x, y) {
    var core = Core.instance;

    Sprite.call(this, 300, 400);

    this.x = x;
    this.y = y;

    this.image = core.assets["img/holder.png"];
    this.frame = 0;
  }
});

var Cover = Class.create(Sprite, {
  initialize: function(x, y) {
    var core = Core.instance;

    Sprite.call(this, 300, 400);

    this.x = x;
    this.y = y;

    this.image = core.assets["img/cover.png"];
    this.frame = 0;
  }
});

window.onload = function() {
  var core = new Core(1000, 600);
  core.fps = 60;
  core.covers = []; // hold gray covers;
  core.activePlayer = 1;

  initMouseEvents();
  preloadAssets();
  playBGM();

  core.addEventListener("load", function() {
    var background = new Sprite(960, 648);
    background.image = core.assets["img/background.png"];
    background.x = 0;
    background.y = 0;
    background.scaleX = 1;
    background.scaleY = 1;
    core.rootScene.addChild(background);

    var board = new Board();
    core.rootScene.addChild(board);
    core.board = board; // to be used by MacroBlock

    var holder1 = new Holder( 40, 160);
    var holder2 = new Holder(660, 160);
    core.rootScene.addChild(holder1);
    core.rootScene.addChild(holder2);

    putBlocks();

    var cover1 = new Cover( 40, 160);
    var cover2 = new Cover(660, 160);
    core.covers = [cover1, cover2];
    core.rootScene.addChild(core.covers[1]); // hide 2P

    var change = new Sprite(327, 165);
    change.image = core.assets["img/change.png"];
    change.x = 335;
    change.y = 90;
    change.scaleX= 1/3;
    change.scaleY= 1/3;
    core.rootScene.addChild(change);

    change.addEventListener("touchend", function() {
      if (core.activePlayer === 1) {
        core.rootScene.removeChild(core.covers[1]);
        core.activePlayer = 2;
        /* if (!core.board.bePossible()) {
          // 切り替え処理
        }*/
      } else {
        core.rootScene.removeChild(core.covers[0]);
        core.activePlayer = 1;
        /* if (!core.board.bePossible()) {
          // 切り替え処理
        }*/
      }
    })

    var scoreboard1 = new Sprite(262, 332);
    scoreboard1.image = core.assets["img/scoreboard1.png"];
    scoreboard1.x = 260;
    scoreboard1.y = -80;
    scoreboard1.scaleX= 1/2.2;
    scoreboard1.scaleY= 1/2.2;
    core.rootScene.addChild(scoreboard1);

    var scoreboard2 = new Sprite(262, 332);
    scoreboard2.image = core.assets["img/scoreboard2.png"];
    scoreboard2.x = 475;
    scoreboard2.y = -80;
    scoreboard2.scaleX= 1/2.2;
    scoreboard2.scaleY= 1/2.2;
    core.rootScene.addChild(scoreboard2);

    getScore();

    var back1 = new Sprite(262, 332);
    back1.image = core.assets["img/back1.png"];
    back1.x = 60;
    back1.y = -80;
    back1.scaleX= 1/2.2;
    back1.scaleY= 1/2.2;
    core.rootScene.addChild(back1);

    var back2 = new Sprite(262, 332);
    back2.image = core.assets["img/back2.png"];
    back2.x = 685;
    back2.y = -80;
    back2.scaleX= 1/2.2;
    back2.scaleY= 1/2.2;
    core.rootScene.addChild(back2);

    var chara1 = new Sprite(375, 239);
    chara1.image = core.assets["img/chara1.png"];
    chara1.x = 0;
    chara1.y = -40;
    chara1.scaleX= 1/3;
    chara1.scaleY= 1/3;
    core.rootScene.addChild(chara1);

    var chara2 = new Sprite(158, 194);
    chara2.image = core.assets["img/chara2.png"];
    chara2.x = 740;
    chara2.y = -20;
    chara2.scaleX= 1/2;
    chara2.scaleY= 1/2;
    core.rootScene.addChild(chara2);
  });

  core.start();
};

// Helper to handle right-click inputs
// The original code is https://github.com/fudacard/desktop.enchant.js
function initMouseEvents() {
  var core = Core.instance;
  var stage = core._element;

  stage.addEventListener("mousedown", function(e) {
    var evt = new enchant.Event("mousedown");
    evt._initPosition(e.pageX, e.pageY);
    evt.button = e.button;

    var target = core.currentScene._determineEventTarget(evt);
    target.dispatchEvent(evt);
  }, false);

  stage.addEventListener("mouseup", function(e) {
    var evt = new enchant.Event("mouseup");
    evt._initPosition(e.pageX, e.pageY);
    evt.button = e.button;

    var target = core.currentScene._determineEventTarget(evt);
    target.dispatchEvent(evt);
  }, false);

  stage.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  }, false);
}

function preloadAssets() {
  var core = Core.instance;

  core.preload("img/blocks.png");
  core.preload("img/holder.png");
  core.preload("img/cover.png");
  core.preload("img/numbers.png");
  core.preload("img/scoreboard1.png");
  core.preload("img/scoreboard2.png");
  core.preload("img/back1.png");
  core.preload("img/back2.png");
  core.preload("img/change.png");
  core.preload("img/chara1.png");
  core.preload("img/chara2.png");
  core.preload("img/background.png");

  core.preload("sound/BGM1.mp3");
  core.preload("sound/BGM2.mp3");
  core.preload("sound/BGM3.mp3");
  core.preload("sound/BGM4.mp3");
  core.preload("sound/put.mp3");
}

function playBGM() {
  var core = Core.instance;
  var music = Math.floor(Math.random() * 4) * 1;
  core.bgm = Sound.load("sound/BGM" + music + ".mp3");
  core.bgm.volume = 0.1;
  core.bgm.play();
}

function putBlocks() {
  var core = Core.instance;

  for (var i = 0; i < 2; i++) {
    var mb = new MacroBlock(0,  70 + 620 * i, 220);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(1, 130 + 620 * i, 220);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(2,  70 + 620 * i, 400);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(3, 220 + 620 * i, 370);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(4,  70 + 620 * i, 460);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(5, 220 + 620 * i, 490);
    core.rootScene.addChild(mb);
    var mb = new MacroBlock(6, 220 + 620 * i, 250);
    core.rootScene.addChild(mb);
  }
}

function calcPosFromPx(pxX, pxY) {
  var x = Math.floor((pxX - 380) / 30);
  var y = Math.floor((pxY - 260) / 30);
  return { x: x, y: y };
}

function makeChain() {
  var core = Core.instance;
  var board = core.board;

  for (var i = 0; i < 4; i++) {
    // delete a macroblock
    var currentX = board.tracedItems[i].x;
    var currentY = board.tracedItems[i].y;

    board.colors[currentY][currentX] = 7;
    board.nums[currentY][currentX] = 0;

    var img = board.numberImgs[currentY][currentX];
    board.removeChild(img);
    board.numberImgs[currentY][currentX] = null;
  }

  core.se = Sound.load("sound/put.mp3");
  core.se.volume = 0.5;
  core.se.play();
}

function getScore() {
  var core = Core.instance;

  var infoLabel1 = new Label('100');
  infoLabel1.x = 355;
  infoLabel1.y = 70;
  infoLabel1.font = '40px sens-serif';
  core.rootScene.addChild(infoLabel1);

  var infoLabel2 = new Label('100');
  infoLabel2.x = 570;
  infoLabel2.y = 70;
  infoLabel2.font = '40px sens-serif';
  core.rootScene.addChild(infoLabel2);
}