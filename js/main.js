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
