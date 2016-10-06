RADIUS = 150
RADIUS_SHOW = 4
TICK_PHYS = 0.001
TICK_SHOW = 0.04
DAMP = 0.975
REALTIME = 5//.2
TICK_MAX = 100*10000
// TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20
BOND_COLOR = "#cc88bb"
ATOM_COLOR = "#000000"

BOND_P = 1

ATOMS = []
BONDS = []
CONTACTS = []

init = function() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
  WIDTH = g_canvas.width;
  HEIGHT = g_canvas.height;
}

circle = function(x, y, r, color) {
  g_context.beginPath();
  g_context.arc(x, HEIGHT-1-y, r, 0, Math.PI*2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
}

line = function(x, y, x2, y2, color) {
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

clear = function() {
  g_context.clearRect(0, 0, WIDTH, HEIGHT);
}

atom = function (x, y, vx, vy) {
  if (vx==null) vx = vy = 0;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  console.log("atom:", this.p, this.v)
  
  this.update = function() {
    this.p.x += this.v.x * TICK_PHYS;
    this.p.y += this.v.y * TICK_PHYS;
    this.v.x *= DAMP;
    this.v.y *= DAMP;
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    circle(this.p.x, this.p.y, RADIUS_SHOW, ATOM_COLOR);
  };
}

bond = function(atom1, atom2, dist) {
  if (dist==undefined) dist = RADIUS*2;
  this.a = atom1;
  this.b = atom2;
  this.d = dist;
}

atoms_update = function() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].update();
  }
}

atoms_draw = function() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].draw();
  }
}

contacts_update = function(verbose) {
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

bonds_update = function(verbose) {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y;
    var dist = Math.sqrt(dx*dx+dy*dy);
    var rx = dx * BONDS[i].d / dist;
    var ry = dy * BONDS[i].d / dist;
    dx -= rx;
    dy -= ry;
    a.v.x += dx * BOND_P;
    b.v.x -= dx * BOND_P;
    a.v.y += dy * BOND_P;
    b.v.y -= dy * BOND_P;
    // if(verbose) console.log("BONDS dxy:", dx, dy, "rxy:", rx, ry, Math.sqrt(rx*rx+ry*ry), "a.v:", a.v.x, a.v.y, "b.v:", b.v.x, b.v.y)
  }
}

bonds_draw = function() {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    line(a.p.x, a.p.y, b.p.x, b.p.y, BOND_COLOR);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

update_all = function(n) {
  for(var i=0; i<n; i++) {
    atoms_update(i==n-1);
    contacts_update(i==n-1);
    bonds_update(i==n-1);
  }
}

bond_all = function(atoms) {
  for (var i=0; i<atoms.length; i++) {
    for (var j=i+1; j<atoms.length; j++) {
      BONDS.push(new bond(atoms[i], atoms[j]));
    }
  }
}

bond_near = function(atoms, thresh, freeze) {
  for (var i=0; i<atoms.length; i++) {
    var a = atoms[i];
    for (var j=i+1; j<atoms.length; j++) {
      var b = atoms[j];
      var dx = a.p.x-b.p.x;
      var dy = a.p.y-b.p.y
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= thresh) {
        if (freeze) {
          BONDS.push(new bond(a, b, dist));
        } else {
          BONDS.push(new bond(a, b));
        }
      }
    }
  }
}

bond_nearest = function(atoms, n, freeze) {
  for (var i=0; i<atoms.length; i++) {
    var pts = [];
    var a = atoms[i];
    for (var j=0; j<atoms.length; j++) {
      var b = atoms[j];
      if (a === b) {
        continue;
      }
      var dx = a.p.x-b.p.x;
      var dy = a.p.y-b.p.y
      var dist = Math.sqrt(dx*dx + dy*dy);
      pts.push([dist, b])
    }
    pts.sort(function (p, q) {
      return p[0] - q[0];
    });
    console.log("PTS:", pts)
    for (var k=0; k<n; k++) {
      var b = pts[k][1];
      var already = false;
      for (var m=0; m<BONDS.length; m++) {
        if ( (BONDS[m].a === a && BONDS[m].b === b ) || (BONDS[m].a === b && BONDS[m].b === a) ) {
          already = true;
          break;
        }
      }
      if (!already) {
        if (freeze) {
          BONDS.push(new bond(a, b, pts[k][0]));
        } else {
          BONDS.push(new bond(a, b));
        }
      }
    }
  }
  console.log("NEAREST BONDS:", BONDS)
}

bond_triangulate = function(atoms, freeze) {
  var verts = [];
  for (var i=0; i<atoms.length; i++) {
    verts.push([atoms[i].p.x, atoms[i].p.y, atoms[i]])
  }
  var tris = Delaunay.triangulate(verts);
  bonded = {};
  for (var i=0; i<tris.length; i+=3) {
    var ix = tris[i];
    var A = verts[ix];
    var B = verts[ix+1];
    var C = verts[ix+2];
    var edges = [[A, B], [B, C], [C, A]]
    for (var j=0; j<3; j++) {
      var a = edges[j][0];
      var b = edges[j][1];
      var atom = 
      var key = ""+a+"-"+b;
      if (bonded[key]==null) {
        bonded[key] = 1;
        if (freeze) {
          var dx = b.p.x-a.p.x;
          var dy = b.p.y-a.p.y;
          BONDS.push(new bond(a, b, Math.sqrt(dx*dx+dy*dy)));
        } else {
          BONDS.push(new bond(a, b));
        }
      }
    }
  }
}

rand32_A = 1664525;
rand32_C = 1013904223;
rand32_seed = 12345678;
rand32 = function(seed) {
  if (seed != null) rand32_seed = seed;
  rand32_seed = (rand32_seed * rand32_A + rand32_C) % 0xffffffff;
  return rand32_seed
}

randy = function() {
  return rand32() / 0x100000000;
}

test = function() {
  rand32(123);
  for (var i=0; i<23; i++) {
    // new atom(Math.random() * WIDTH, Math.random() * HEIGHT);
    ATOMS.push(new atom(randy() * WIDTH, randy() * HEIGHT));
  }
  bond_all(ATOMS);
  clear();
  bonds_draw();
  atoms_draw();
  var ii=0;
  var int = setInterval( function(){
    clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii==150) {
      console.log("HIT ME")
      // DAMP = 0.999;
      // ATOMS[0].v.x = -2000;
      BONDS = [];
      bond_triangulate(ATOMS, true)
    }
    if (ii==250) {
      console.log("HIT ME AGIN");
      DAMP = 0.9998;
      ATOMS[5].v.x = -1500;
      ATOMS[6].v.x = -600;
    }
    if (ii >= TICK_MAX) {
      clearInterval(int)
    }
  }, TICK_SHOW/REALTIME * 1000);
}
