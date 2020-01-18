// Frank Poth 02/28/2018

/* To keep this example from looking too boring, I made the game logic gradually
change some color values which then get drawn to the display canvas in the loop. */

const Game = function() {

  this.world = new Game.World;

  this.update = function () {
    this.world.update();
  }

};

Game.prototype = {
  constructor : Game
};

// Game world contains all the information a room needs
Game.World = function() {
  this.player = new Game.Player(127,140);
  this.zone_id = 0;
  this.image = "";
  this.collision_image = "";
  this.background_color = "#f0f0f0";

  this.height = 200;
  this.width = 400;

  this.sprite = "bedroom.png";// Image source
  //Currently theres just a single collision for a room
  // I would eventually like there to be an array of different objects in the room with collisions
  this.worldcollision = new Game.CollisionObject([[70,142],[339,145],[394,200],[7,200]], true, this);
};

Game.World.prototype = {
  constructor: Game.World,

  // Just the players position is updated
  // The world controls the players velocity, and the player controls its x,y value
  update:function() {
    this.updatePlayerPos(); // Update player velocity
    this.player.update(); // Update player xy position
  },

  // Updates player velocity based on possible collisions
  updatePlayerPos:function() {
    let next_x = this.player.x + this.player.x_velocity;
    let next_y = this.player.y + this.player.y_velocity;

    let player_point_x = [
      [this.player.collision_point[0]+next_x, this.player.collision_point[1]+this.player.y]
    ];
    let player_point_y = [
      [this.player.collision_point[0]+this.player.x, this.player.collision_point[1]+next_y]
    ];

    if(this.worldcollision.checkCollision(player_point_x)) {
      this.player.x_velocity = 0;
    }
    if(this.worldcollision.checkCollision(player_point_y)) {
      this.player.y_velocity = 0;
    }
  }
};

Game.Player = function(x,y) {
  this.x = x;
  this.y = y;
  this.x_velocity = 0;
  this.y_velocity = 0;

  this.width = 20;
  this.height = 40;

  this.color = "#ff0000";
  this.sprite = "character.png";

  // Currently player collision is based off a single point placed
  // at an offset of the players origin point
  this.collision_point = [10,35];
};

Game.Player.prototype = {
  constructor: Game.Player,

  moveLeft:function() { this.x_velocity -= 2; },
  moveRight:function() { this.x_velocity += 2; },
  moveUp:function() { this.y_velocity -= 1; },
  moveDown:function() { this.y_velocity += 1; },

  // Updates player movement
  update:function() {
    this.x += this.x_velocity;
    this.y += this.y_velocity;
    this.x_velocity = 0;
    this.y_velocity = 0;
  }

};

// Must be a concave polygon
Game.CollisionObject = function(pt_vector, fill_val, p_world) {
  this.vector = pt_vector; // collection of points
  this.fill = fill_val; // determines if player must be inside or outside object
  this.parent_world = p_world; // The world box this is contained in
  this.debug = false; // set to true if you want debug messages
};

Game.CollisionObject.prototype = {
  constructor: Game.CollisionObject,

  checkCollision:function(player_vector) {
    // Check each point on player object
    // This was written with the intent of the player having
    // a hitbox rather than a singe point, probably will be changed
    for(let i = 0; i < player_vector.length; i++) {
      if (!this.isInside(this.vector, player_vector[i])) return true;
    }

    return false;
  },

  // Checks if point q is on segment pr
  // p,q,r are colinear points
  onSegment:function(p, q, r) {
    if (q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
            q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]))
        return true;
    else return false;
  },

  // Returns orientation of ordered triplet p,q,r
  // 0 - colinear
  // 1 - clockwise
  // 2 - counterclockwise
  orientation:function(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val == 0) return 0;
    else if (val > 0) return 1;
    else return 2;
  },

  // Returns true if line segments p1q1 and p2q2 intersect
  doIntersect:function(p1,q1,p2,q2) {
    let o1 = this.orientation(p1,q1,p2);
    let o2 = this.orientation(p1,q1,q2);
    let o3 = this.orientation(p2,q2,p1);
    let o4 = this.orientation(p2,q2,q1);

    // General case
    if (o1 != o2 && o3 != o4) return true;

    // Special cases
    if (o1 == 0 && this.onSegment(p1,p2,q1)) return true;
    if (o2 == 0 && this.onSegment(p1,q2,q1)) return true;
    if (o3 == 0 && this.onSegment(p2,p1,q2)) return true;
    if (o4 == 0 && this.onSegment(p2,q1,q2)) return true;

    return false;
  },

  // Returns true if a point is inside a polygon
  isInside:function(polygon, p) {
    if (polygon.length < 3) return false;

    extreme = [this.parent_world.width, p[1]]; // Infinity point

    let debug_list = [];
    let count = 0, i = 0;
    do {
      let next = (i+1)%polygon.length;
      // Check if line seg from p-extreme intersects with line segments from
      //  cur polygon point to next point
      if (this.doIntersect(polygon[i], polygon[next], p, extreme)) {
        // If p is colinear with line seg i-next, check if it lies on the segment
        if (this.orientation(polygon[i], p, polygon[next]) == 0) {
          return this.onSegment(polygon[i], p, polygon[next]);
        }
        debug_list.push([polygon[i],polygon[next],p]);
        count+=1;
      }
      i = next;
    } while(i != 0);

    if (count%2 != 1 && this.debug)
      console.log(debug_list);

    return (count%2 == 1);
  },
}
