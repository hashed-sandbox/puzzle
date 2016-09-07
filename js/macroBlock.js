"use strict";

enchant();

var blockCords = [];
// blockCords -> [colorID][direction][position][x or y]

blockCords[0] = [
  [[ 0,  0], [ 0,  1], [ 0,  2], [ 0,  3]],
  [[ 0, -1], [ 1, -1], [ 2, -1], [ 3, -1]],
  [[-1, -1], [-1, -2], [-1, -3], [-1, -4]],
  [[-1,  0], [-2,  0], [-3,  0], [-4,  0]]
];

blockCords[1] = [
  [[ 0,  0], [ 0,  1], [ 1,  1], [ 1,  0]],
  [[ 0, -1], [ 0, -2], [ 1, -2], [ 1, -1]],
  [[-1, -1], [-2, -1], [-2, -2], [-1, -2]],
  [[-1,  0], [-1,  1], [-2,  1], [-2,  0]]
];

blockCords[2] = [
  [[ 0,  0], [ 1,  0], [ 1, -1], [ 2, -1]],
  [[ 0, -1], [ 0, -2], [-1, -2], [-1, -3]],
  [[-1, -1], [-2, -1], [-2,  0], [-3,  0]],
  [[-1,  0], [-1,  1], [ 0,  1], [ 0,  2]]
];

blockCords[3] = [
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, -1], [0, -2], [1, -2], [1, -3]],
  [[-1, -1], [-2, -1], [-2, -2], [-3, -2]],
  [[-1, 0], [-1, 1], [-2, 1], [-2, 2]]
];

blockCords[4] = [
  [[ 0,  0], [ 0,  1], [ 1,  1], [ 2,  1]],
  [[ 0, -1], [ 1, -1], [ 1, -2], [ 1, -3]],
  [[-1, -1], [-1, -2], [-2, -2], [-3, -2]],
  [[-1,  0], [-2,  0], [-2,  1], [-2,  2]]
];

blockCords[5] = [
  [[ 0,  0], [ 1,  0], [ 2,  0], [ 2, -1]],
  [[ 0, -1], [ 0, -2], [ 0, -3], [-1, -3]],
  [[-1, -1], [-2, -1], [-3, -1], [-3,  0]],
  [[-1,  0], [-1,  1], [-1,  2], [ 0,  2]]
];

blockCords[6] = [
  [[ 0,  0], [ 1,  0], [ 2,  0], [ 1, -1]],
  [[ 0, -1], [ 0, -2], [ 0, -3], [-1, -2]],
  [[-1, -1], [-2, -1], [-3, -1], [-2,  0]],
  [[-1,  0], [-1,  1], [-1,  2], [ 0,  1]]
];

var MacroBlock = Class.create(Group, {
  initialize: function(colorID, initX, initY) {
    var core = Core.instance;

    // `this` will be an instance of enchant.Group
    Group.call(this);

    this.colorID = colorID;
    this.direction = 0; // initial value
    this.numbers = getPermutation();

    var blockSize = 30;

    for (var i = 0; i < 4; i++) {
      var block = new Sprite(blockSize, blockSize);
      block.image = core.assets["img/blocks.png"];
      block.frame = colorID;

      block.x = blockCords[colorID][0][i][0] * blockSize;
      block.y = blockCords[colorID][0][i][1] * blockSize;

      this.addChild(block);
    }

    this.paintNumberImgs();

    this.addEventListener("touchmove", this.handleDrag);

    this.moveTo(initX, initY);
  },

  handleClick: function(ev) {
    if (ev.button === 0) { // left button
      this.isRightPressed = false;

      // the position of blocks before moved
      this.baseX = this.x;
      this.baseY = this.y;

      // the position where a mouse clicked
      this.startX = ev.x;
      this.startY = ev.y;

    } else if (ev.button === 2) { // right button
      this.isRightPressed = true;
      this.rotate();
    }
  },

  handleDrag: function(ev) {
    if (this.isRightPressed) { return; }

    this.moveTo(this.baseX + (ev.x - this.startX),
                this.baseY + (ev.y - this.startY));
  },

  handleRelease: function(ev) {
    var nearestPos = this.getNearestPos();
    if (!this.canBePlacedAt(nearestPos.x, nearestPos.y)) {
      this.x = this.baseX;
      this.y = this.baseY;
      return;
    }

    var core = Core.instance;
    core.board.paintMacroBlock(this, nearestPos.x, nearestPos.y);
    core.rootScene.removeChild(this);
    delete this;
  },

  rotate: function() {
    this.rotation -= 90;
    this.direction = (this.direction + 1) % 4;
  },

  paintNumberImgs: function() {
    var core = Core.instance;
    for (var i = 0; i < 4; i++) {
      var numberImg = new Sprite(30 , 30);
      numberImg.image = core.assets["img/numbers.png"];
      numberImg.frame = this.numbers[i] -1;

      var blockSize = 30;
      numberImg.x = blockCords[this.colorID][this.direction][i][0] * blockSize;
      numberImg.y = blockCords[this.colorID][this.direction][i][1] * blockSize;

      numberImg.addEventListener("mousedown", function(ev) {
        this.handleClick(ev);
      }.bind(this));

      numberImg.addEventListener("mouseup", function(ev) {
        this.handleRelease(ev);
        moveBlock();
      }.bind(this));

      this.addChild(numberImg);
    }
  },

  getNearestPos: function() {
    var nearestX = Math.round((this.x - 380) / 30);
    var nearestY = Math.round((this.y - 260) / 30);

    return { x: nearestX, y: nearestY };
  },

  canBePlacedAt: function(x, y) {
    var board = Core.instance.board;
    var order = blockCords[this.colorID][this.direction];

    var checkSum = 0;
    for (var i = 0; i < 4; i++) {
      var relativeX = order[i][0];
      var relativeY = order[i][1];

      if (x + relativeX < 0 || 8 <= x + relativeX ||
          y + relativeY < 0 || 8 <= y + relativeY) {
        return false;
      }

      checkSum += board.nums[y + relativeY][x + relativeX];
    }

    return checkSum === 0;
  }
});

function getPermutation() {
  var src = [1, 2, 3, 4];
  var dst = [];

  for (var i = 0; i < 4; i++) {
    var idx = Math.floor(Math.random() * (4 - i));
    var val = src.splice(idx, 1)[0];
    dst.push(val);
  }

  return dst;
}

function moveBlock() {
  var core = Core.instance;
  core.se = Sound.load("sound/put.mp3");
  core.se.volume = 0.5;
  core.se.play();
}
