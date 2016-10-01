RADIUS = 5
TICK_PHYS = 0.001
TICK_SHOW = 0.01
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
  
  this.update = function() {
    this.p.x += this.v.x * TICK_PHYS;
    this.p.y += this.v.y * TICK_PHYS;
    this.v.x += this.f.x * TICK_PHYS;
    this.v.y += this.f.y * TICK_PHYS;
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    draw_particle(this.p.x, this.p.y);
  };

  ATOMS.push(this)
}

function atoms_update() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].update();
  }
}

function atoms_draw() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].draw();
  }
}

function contacts_update(verbose) {
  for (var i=0; i<CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    var dx = a.p.x-b.p.x;
    var dy = a.p.y-b.p.y
    var dist = Math.sqrt(dx*dx + dy*dy);
    console.log("DIST:", dist)
    if (dist < RADIUS*2) {
      if(verbose) console.log("CONTACT!")
      var vx = a.v.x;
      var vy = a.v.y;
      a.v.x = b.v.x;
      a.v.y = b.v.y;
      b.v.x = vx;
      b.v.y = vy;
    }
  }
}

function bonds_update(verbose) {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i][0];
    var b = BONDS[i][1];
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y
    if (dx+dy) {
      var rx = dx/(dx+dy)
      var ry = dy/(dx+dy)
      if(dx<0){
        dx += RADIUS*2                // should be trig here, x component based on angle
      } else {
        dx -= RADIUS*2
      }
      a.v.x += dx * BOND_P
      b.v.x -= dx * BOND_P
      if(verbose) console.log("BOND dx:", dx, "dy:", dy, "avx:", a.v.x, "avy:", a.v.y)
    }
  }
}

function update_all(n) {
  for(var i=0; i<n; i++) {
    atoms_update(i==n-1);
    contacts_update(i==n-1);
    bonds_update(i==n-1);
  }
}

function test() {
  var p1 = new atom(530, 300);
  var p2 = new atom(515, 300);
  BONDS = [[p1, p2]]
  var ii=0;
  var int = setInterval(function(){
    clear();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii >= 10) {
      clearInterval(int)
    }
  }, TICK_SHOW * 5000);
}
