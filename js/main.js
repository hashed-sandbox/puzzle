"use strict";

enchant();

// inherit enchant.Map
var Board = Class.create(enchant.Map, {
  initialize: function() {
    var core = Core.instance;

    var squareSize = 30;
    // `this` will be an instance of enchant.Map
    enchant.Map.call(this, squareSize, squareSize);

    this.x = 380;
    this.y = 260;

    this.image = core.assets["img/square.png"];
    // 8x8 array filled with 0
    this.loadData(Array(8).fill(Array(8).fill(0)));
    this.collisionData = Array(8).fill(Array(8).fill(0));
  }
});

// inherit enchant.Group
var MacroBlock = Class.create(Group, {
  initialize: function(x, y) {
    var core = Core.instance;

    // `this` will be an instance of enchant.Group
    Group.call(this);

    var blockSize = 30;

    var subBlocks = [];
    for (var i = 0; i < 4; i++) {
      var block = new Sprite(blockSize, blockSize);
      block.image = core.assets["img/orangeBlock.png"];
      block.frame = 0;
      subBlocks[i] = block;
    }

    // straight blocks
    subBlocks[0].x = x;
    subBlocks[0].y = y;

    subBlocks[1].x = x + blockSize;
    subBlocks[1].y = y;

    subBlocks[2].x = x + blockSize * 2;
    subBlocks[2].y = y;

    subBlocks[3].x = x + blockSize * 3;
    subBlocks[3].y = y;

    for (var i = 0; i < 4; i++) {
      // enchant.Group.addChild()
      this.addChild(subBlocks[i]);
    }

    this.addEventListener("touchstart", function(ev) {
      // the position of blocks before moved
      this.baseX = this.x;
      this.baseY = this.y;

      // the position where a mouse clicked
      this.startX = ev.x;
      this.startY = ev.y;
    });

    this.addEventListener("touchmove", function(ev) {
      this.moveTo(this.baseX + (ev.x - this.startX),
                  this.baseY + (ev.y - this.startY));
    });
  }
});

window.onload = function() {
  var core = new Core(1000, 600);
  core.fps = 60;
  preloadAssets();

  core.addEventListener("load", function() {
    var board = new Board();
    core.rootScene.addChild(board);

    var mb = new MacroBlock(100, 100);
    core.rootScene.addChild(mb);
  });

  core.start();
};

function preloadAssets() {
  var core = Core.instance;

  core.preload("img/square.png");
  core.preload("img/orangeBlock.png");
}
