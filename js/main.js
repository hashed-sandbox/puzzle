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

    this.numsMemory = [];
    this.prevPos = { x: null, y: null };

    var squareSize = 30;
    var map = new Map(squareSize, squareSize);
    map.image = core.assets["img/blocks.png"];
    map.loadData(this.colors);

    this.addChild(map);

    this.moveTo(380, 260);
  },

  updateColors: function() {
    this.firstChild.loadData(this.colors);
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
          this.numsMemory.push(1);
          this.prevPos = currentPos;
          return;
        }

        if ((currentPos.x === this.prevPos.x + 1 && currentPos.y === this.prevPos.y) ||
            (currentPos.x === this.prevPos.x - 1 && currentPos.y === this.prevPos.y) ||
            (currentPos.x === this.prevPos.x && currentPos.y === this.prevPos.y + 1) ||
            (currentPos.x === this.prevPos.x && currentPos.y === this.prevPos.y - 1)) {
          if (this.numsMemory.length < 4) {
            this.numsMemory.push(this.nums[currentPos.y][currentPos.x]);
            this.prevPos = currentPos;
          }
        }
      }.bind(this));

      numberImg.addEventListener("touchend", function(ev) {
        // this <- board
        if (this.numsMemory[0] === 1 && this.numsMemory[1] === 2 &&
            this.numsMemory[2] === 3 && this.numsMemory[3] === 4) {
          makeChain();
        }

        this.numMemory = [];
        this.prevPox = { x: null, y: null };
      }.bind(this));

      this.addChild(numberImg);
    }

    this.updateColors();
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

window.onload = function() {
  var core = new Core(1000, 600);
  core.fps = 60;

  initMouseEvents();
  preloadAssets();

  core.addEventListener("load", function() {
    var board = new Board();
    core.rootScene.addChild(board);
    core.board = board; // to be used by MacroBlock

    var holder1 = new Holder( 40, 160);
    var holder2 = new Holder(660, 160);
    core.rootScene.addChild(holder1);
    core.rootScene.addChild(holder2);

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

    var change = new Sprite(327, 165);
    change.image = core.assets["img/change.png"];
    change.x = 335;
    change.y = 90;
    change.scaleX= 1/3;
    change.scaleY= 1/3;
    core.rootScene.addChild(change);

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

    putBlocks();
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
  core.preload("img/numbers.png");
  core.preload("img/scoreboard1.png");
  core.preload("img/scoreboard2.png");
  core.preload("img/back1.png");
  core.preload("img/back2.png");
  core.preload("img/change.png");
  core.preload("img/chara1.png");
  core.preload("img/chara2.png");
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
  var infoLabel = new Label("chain");
  infoLabel.x = 10;
  infoLabel.y = 10;
  core.rootScene.addChild(infoLabel);
}