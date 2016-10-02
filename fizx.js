RADIUS = 50
RADIUS_SHOW = 4
TICK_PHYS = 0.001
TICK_SHOW = 0.01
DAMP = 0.975
REALTIME = .2
TICK_MAX = 100*10000
// TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20
BOND_COLOR = "#cc88bb"
ATOM_COLOR = "#000000"

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

function circle(x, y, r, color) {
  g_context.beginPath();
  g_context.arc(x, HEIGHT-1-y, r, 0, Math.PI*2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
}

function line(x, y, x2, y2, color) {
  g_context.beginPath();
  g_context.moveTo(x, HEIGHT-1-y);
  g_context.lineTo(x2, HEIGHT-1-y2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
}

function clear() {
  g_context.clearRect(0, 0, WIDTH, HEIGHT);
}

function atom(x, y, vx, vy, fx, fy) {
  if (vx==null) vx = vy = 0;
  if (fx==null) fx = fy = 0;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  this.f = {x: fx, y: fy};
  console.log("atom:", this.p, this.v, this.f)
  
  this.update = function() {
    this.v.x += this.f.x * TICK_PHYS;
    this.p.x += this.v.x * TICK_PHYS;
    this.p.y += this.v.y * TICK_PHYS;
    this.v.y += this.f.y * TICK_PHYS;
    this.v.x *= DAMP;
    this.v.y *= DAMP;
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    circle(this.p.x, this.p.y, RADIUS_SHOW, ATOM_COLOR);
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
    var dist = Math.sqrt(dx*dx+dy*dy);
    var rx = dx*RADIUS*2/dist
    var ry = dy*RADIUS*2/dist
    dx -= rx
    dy -= ry
    a.v.x += dx * BOND_P
    b.v.x -= dx * BOND_P
    a.v.y += dy * BOND_P
    b.v.y -= dy * BOND_P
    if(verbose) console.log("BONDS dxy:", dx, dy, "rxy:", rx, ry, Math.sqrt(rx*rx+ry*ry), "a.v:", a.v.x, a.v.y, "b.v:", b.v.x, b.v.y)
  }
}

function bonds_draw() {
  for (var i=0; i<BONDS.length; i++) {
    var a=BONDS[i][0];
    var b=BONDS[i][1];
    line(a.p.x, a.p.y, b.p.x, b.p.y, BOND_COLOR);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

function update_all(n) {
  for(var i=0; i<n; i++) {
    atoms_update(i==n-1);
    contacts_update(i==n-1);
    bonds_update(i==n-1);
  }
}

function bond_all(atoms) {
  for (var i=0; i<atoms.length; i++) {
    for (var j=i+1; j<atoms.length; j++) {
      BONDS.push([atoms[i], atoms[j]]);
    }
  }
}

function bond_near(atoms, thresh) {
  for (var i=0; i<atoms.length; i++) {
    for (var j=i+1; j<atoms.length; j++) {
      var a = atoms[i];
      var b = atoms[j];
      var dx = a.p.x-b.p.x;
      var dy = a.p.y-b.p.y
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= thresh) {
        BONDS.push([a, b]);
      }
    }
  }
}

rand32_A = 1664525;
rand32_C = 1013904223;
rand32_seed = 12345678;
function rand32(seed) {
  if (seed != null) rand32_seed = seed;
  rand32_seed = (rand32_seed * rand32_A + rand32_C) % 0xffffffff;
  return rand32_seed
}

function randy() {
  return rand32() / 0x100000000;
}

function test() {
  rand32(1234);
  for (var i=0; i<10; i++) {
    // new atom(Math.random() * WIDTH, Math.random() * HEIGHT);
    new atom(randy() * WIDTH, randy() * HEIGHT);
  }
  // new atom(400, 255);
  // new atom(500, 300);
  // new atom(600, 300);
  // new atom(500, 200);
  // new atom(400, 200);
  bond_all(ATOMS);
  clear();
  bonds_draw();
  atoms_draw();
  var ii=0;
  var int = setInterval(function(){
    clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii==100) {
      console.log("HIT ME")
      // DAMP = 0.999;
      // ATOMS[0].v.x = -2000;
      BONDS = [];
      bond_near(ATOMS, RADIUS*1.5)
    }
    if (ii==200) {
      console.log("HIT ME AGIN")
      DAMP = 0.998;
      ATOMS[0].v.x = -500;
      ATOMS[1].v.x = 600;
    }
    if (ii >= TICK_MAX) {
      clearInterval(int)
    }
  }, TICK_SHOW/REALTIME * 1000);
}
  