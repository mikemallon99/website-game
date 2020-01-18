// Load listener so this is executed once the page is loaded
window.addEventListener("load", function(event) {

  "use strict";

  var resize = function(event) {
    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width, game.world);
    display.render();
  }

  // Handles keypress
  var keyDownUp = function(event) {
    controller.keyDownUp(event.type, event.keyCode);
  };

  var render = function() {
    display.drawRoom(game.world);
    display.drawPlayerSprite(game.world.player);
    display.render();

  };

  var update = function() {
    if (controller.left.active) { game.world.player.moveLeft(); }
    if (controller.right.active) { game.world.player.moveRight(); }
    if (controller.up.active) { game.world.player.moveUp(); }
    if (controller.down.active) { game.world.player.moveDown(); }

    game.update();
  };

        /////////////////
      //// OBJECTS ////
    /////////////////

    /* Usually I just write my logical sections into object literals, but the temptation
    to reference one inside of another is too great, and leads to sloppy coding.
    In an effort to attain cleaner code, I have written classes for each section
    and instantiate them here. */

    /* The controller handles user input. */
    var controller = new Controller();
    /* The display handles window resizing, as well as the on screen canvas. */
    var display    = new Display(document.querySelector("canvas"));
    /* The game will eventually hold our game logic. */
    var game       = new Game();
    /* The engine is where the above three sections can interact. */
    var engine     = new Engine(1000/30, render, update);

        ////////////////////
      //// INITIALIZE ////
    ////////////////////

    window.addEventListener("resize",  resize);
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup",   keyDownUp);

    resize();
    engine.start();

});
