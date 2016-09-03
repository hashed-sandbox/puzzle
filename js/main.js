"use strict";

enchant();

var Board = Class.create(enchant.Map, {
  initialize: function() {
    var core = Core.instance;

    var squareSize = 30;
    enchant.Map.call(this, squareSize, squareSize);

    this.x = 380;
    this.y = 260;
    this.image = core.assets["img/blocks.png"];

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
    this.loadData(this.colors);

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
  },

  updateColors: function() {
    this.loadData(this.colors);
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
