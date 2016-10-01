RADIUS = 5
TICK_PHYS = 0.001
TICK_SHOW = 0.02
BOND_P = 1

ATOMS = []
BONDS = []
CONTACTS = []

function init() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
  WIDTH = g_canvas.width;
  HEIGHT = g_canvas.height;
}

function circle(x, y, r) {
  g_context.beginPath();
  g_context.arc(x, HEIGHT-1-y, r, 0, Math.PI*2);
  g_context.stroke();
}

function line(x, y, x2, y2) {
  g_context.beginPath();
  g_context.moveTo(x, HEIGHT-1-y);
  g_context.lineTo(x2, HEIGHT-1-y2);
  g_context.stroke();
}

function clear() {
  g_context.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw_particle(x, y) {
  circle(x, y, RADIUS);
}

function atom(x, y, vx, vy, fx, fy) {
  if (vx==null) vx = vy = 0;
  if (fx==null) fx = fy = 0;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  this.f = {x: fx, y: fy};
  console.log("atom:", this.p, this.v, this.f)
  
  this.update = function(dt) {
    var it = 0;
    var t = 0;
    while(t < dt) {
      this.p.x += this.v.x * TICK_PHYS;
      this.p.y += this.v.y * TICK_PHYS;
      this.v.x += this.f.x * TICK_PHYS;
      this.v.y += this.f.y * TICK_PHYS;
      t += TICK_PHYS;
      it++;
    }
    return it;
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    draw_particle(this.p.x, this.p.y);
  };

  ATOMS.push(this)
}

function atoms_update(dt) {
  for (var i=0; i<ATOMS.length; i++) {
    var step = ATOMS[i].update(dt);
  }
  return step;
}

function atoms_draw() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].draw();
  }
}

function contacts_update() {
  for (var i=0; i<CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    var dx = a.p.x-b.p.x;
    var dy = a.p.y-b.p.y
    var dist = Math.sqrt(dx*dx + dy*dy);
    console.log("DIST:", dist)
    if (dist < RADIUS*2) {
      console.log("CONTACT!")
      var vx = a.v.x;
      var vy = a.v.y;
      a.v.x = b.v.x;
      a.v.y = b.v.y;
      b.v.x = vx;
      b.v.y = vy;
    }
  }
}

function bonds_update() {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i][0];
    var b = BONDS[i][1];
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y
    // var dist = Math.sqrt(dx*dx + dy*dy);
    // var diff = dist-RADIUS*2
    if(dx<0){
      dx += RADIUS*2                // should be trig here, x component based on angle
    } else {
      dx -= RADIUS*2
    }
    console.log("BOND diff:", dx, dy)
    a.v.x += dx * BOND_P
    b.v.x -= dx * BOND_P
  }
}

function test() {
  var p1 = new atom(530, 300);
  var p2 = new atom(515, 300);
  BONDS = [[p1, p2]]
  setInterval(function(){
    clear();
    atoms_draw();
    var ret=atoms_update(TICK_SHOW);
    contacts_update();
    bonds_update();
    console.log("ticks:", ret);
  }, TICK_SHOW * 5000);
}
