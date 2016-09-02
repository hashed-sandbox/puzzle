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

    // fill with 8x8 array
    this.colors = Array(8).fill(Array(8).fill(7)); // to be used by MacroBlock
    this.loadData(this.colors);

    // store numbers which each block has
    // `0` indicates the square is empty
    this.nums = Array(8).fill(Array(8).fill(0));
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

    var mb = new MacroBlock(0, 380, 260);
    core.rootScene.addChild(mb);
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
}
