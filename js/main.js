"use strict";

enchant();

// inherit enchant.Group
var MacroBlock = Class.create(Group, {
  initialize(x, y) {
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
  core.preload("img/orangeBlock.png");

  core.addEventListener("load", function() {
    var mb = new MacroBlock(100, 100);
    core.rootScene.addChild(mb);
  });

  core.start();
};
