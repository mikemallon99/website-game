/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  this.render = function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); };

  this.fill = function(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,0, this.buffer.canvas.width, this.buffer.canvas.height);
  };

  this.drawPlayer = function(rectangle, color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(Math.floor(rectangle.x), Math.floor(rectangle.y), rectangle.width, rectangle.height);
  }

  this.drawPlayerSprite = function(player) {
    var sprite = new Image(20,40);
    sprite.src = player.sprite;
    this.buffer.drawImage(sprite, player.x, player.y);
  }

  this.drawRoom = function(world) {
    var img = new Image(400,200);
    img.src = world.sprite;
    this.buffer.drawImage(img, 0, 0);
  }

  this.resize = function(width, height, height_width_ratio, world) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;


    } else {

      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;

    }

    this.buffer.canvas.height = world.height;
    this.buffer.canvas.width = world.width;

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display

};
