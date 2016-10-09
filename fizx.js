GRAVITY = -1
RADIUS = 25;
RADIUS_SHOW = 2.5;
TICK_PHYS = 0.001;
TICK_SHOW = 0.01;
REALTIME = 1;
TICK_MAX = 1000000;
// TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20

BOND_P = 5
BOND_D = 0
DAMP = 0.975

ATOMS = []
BONDS = []
CONTACTS = []
COLLIDES = []

atom = function (x, y, vx, vy, radius, locked) {
  if (vx==null) vx = vy = 0;
  if (radius==null) radius=RADIUS;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  this.radius=radius;
  // console.log("atom:", this.p, this.v)
  
  this.update = function() {
    if(!locked) {
      this.p.x += this.v.x * TICK_PHYS;
      this.p.y += this.v.y * TICK_PHYS;
      this.v.x *= DAMP;
      this.v.y *= DAMP;
      this.v.y += GRAVITY;
    } else {
      this.v.x = 0;
      this.v.y = 0;
    }
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    display_circle(this.p.x, this.p.y, RADIUS_SHOW, ATOM_COLOR);
    display_circle(this.p.x, this.p.y, this.radius, ATOM_COLOR2);
  };
}

bond = function(atom1, atom2, dist) {
  if (dist==undefined) dist = RADIUS*2;
  this.a = atom1;
  this.b = atom2;
  this.d = dist;
}

thing = function(name, x, y, vx, vy, obj, locked) {
  this.name = name;
  this.atoms = [];
  this.add = function(atom) {
    this.atoms.push(atom);
  }
  if (obj != undefined) {
    for (var i=0; i<obj.length; i++) {
      var o = obj[i];
      var a = new atom(o.p.x+x, o.p.y+y, o.v.x+vx, o.v.y+vy, o.radius, locked);
      this.atoms.push(a);
      ATOMS.push(a);
    }
  }
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

refresh_contacts = function() {
  // var thresh = 25;              // FIXME each atom should have a radius
  CONTACTS = [];
  for (var i=0; i<COLLIDES.length; i++) {
    var ta = COLLIDES[i][0];
    var tb = COLLIDES[i][1];
    for (var j=0; j<ta.atoms.length; j++) {
      var a = ta.atoms[j];
      for (var k=0; k<tb.atoms.length; k++) {
        var b = tb.atoms[k];
        var dx = a.p.x-b.p.x;
        var thresh = a.radius+b.radius;
        if (Math.abs(dx) < thresh) {
          var dy = a.p.y-b.p.y;
          if (Math.abs(dy) < thresh) {
            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < thresh) {
              CONTACTS.push([a, b])
            }
          }
        }
      }
    }
  }
}

contacts_update = function(verbose) {
  for (var i=0; i<CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y;
    var thresh = a.radius+b.radius;
    var dist = Math.sqrt(dx*dx+dy*dy);      // distance between atoms
    var udx = dx / dist;                    // unit vector pointing from a to b
    var udy = dy / dist;
    var dif = dist - thresh;            // difference we want to restore to zero
    var pterm = dif * BOND_P ;                // Proportional term for our springy bond 

    var xswap = pterm * udx;                 // along axis a--b
    var yswap = pterm * udy;

    a.v.x += xswap;                          // swap momenta
    b.v.x -= xswap;
    a.v.y += yswap;
    b.v.y -= yswap;
  }
}

bonds_update = function(verbose) {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y;
    var dist = Math.sqrt(dx*dx+dy*dy);      // distance between atoms
    var udx = dx / dist;                    // unit vector pointing from a to b
    var udy = dy / dist;
    var dif = dist - BONDS[i].d;            // difference we want to restore to zero
    var pterm = dif * BOND_P ;                // Proportional term for our springy bond 

    var dvx = b.v.x-a.v.x;
    var dvy = b.v.y-a.v.y;
    var vdif = Math.sqrt(dvx*dvx+dvy*dvy);  // relative velocity
    var vdot = 0;                           // if relative velocity==0, no Derivative term for our PiD
    if (vdif) {
      var uvx = dvx / vdif;                 // velocity unit vector (direction of rel vel)
      var uvy = dvy / vdif;
      vdot = uvx*udx + uvy*udy;             // dot product of positional direction vs rel vel - we only
    }                                       // want to adjust velocity along axis aligned with 2 particles,
    var dterm = vdif * vdot * BOND_D;        // Derivative term
    var xswap = (pterm + dterm) * udx;          // along axis a--b
    var yswap = (pterm + dterm) * udy;

    a.v.x += xswap;                          // swap momenta
    b.v.x -= xswap;
    a.v.y += yswap;
    b.v.y -= yswap;
  }
}

bonds_draw = function() {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    display_line(a.p.x, a.p.y, b.p.x, b.p.y, BOND_COLOR);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

contacts_draw = function() {
  for (var i=0; i<CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    display_line(a.p.x, a.p.y, b.p.x, b.p.y, CONTACT_COLOR);
    // console.log("line", a.p.x, a.p.y, b.p.x, b.p.y)
  }
}

update_all = function(n) {
  for(var i=0; i<n; i++) {
    bonds_update(i==n-1);
    atoms_update(i==n-1);
    refresh_contacts(i==n-1)
    contacts_update(i==n-1);
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
  var triangles = Delaunay.triangulate(verts);
  var bonded = {};
  for (var i=0; i<triangles.length; i+=3) {
    var A = triangles[i];
    var B = triangles[i+1];
    var C = triangles[i+2];
    var edges = [[A, B], [B, C], [C, A]];
    for (var j=0; j<3; j++) {
      var a = edges[j][0];
      var b = edges[j][1];
      if (a > b) {
      	var aa = a;
      	a = b;
      	b = aa;
      }
	  // console.log("  ab", a, b)
      var key = [a, b]
      if (bonded[key]===undefined) {
        bonded[key] = 1;
        if (freeze) {
          var dx = atoms[b].p.x-atoms[a].p.x;
          var dy = atoms[b].p.y-atoms[a].p.y;
          BONDS.push(new bond(atoms[a], atoms[b], Math.sqrt(dx*dx+dy*dy)));
        } else {
          BONDS.push(new bond(atoms[a], atoms[b]));
        }
      }
    }
  }
  // console.log(bonded)
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
  display_init();
  rand32(123563);
  for (var i=0; i<36; i++) {
    // new atom(Math.random() * WIDTH, Math.random() * HEIGHT);
    ATOMS.push(new atom(randy() * WIDTH, randy() * HEIGHT));
  }
  // ATOMS.push(new atom(200, 200));
  // ATOMS.push(new atom(200, 300));
  // ATOMS.push(new atom(300, 300));
  bond_all(ATOMS);
  display_clear();
  bonds_draw();
  atoms_draw();
  var ii=0;
  var int = setInterval( function(){
    display_clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii==150) {
      console.log("HIT ME")
      DAMP = 1//0.998
      BOND_P = 200;
      BOND_D = .21;
      // ATOMS[0].v.x = -2000;
      BONDS = [];
      bond_triangulate(ATOMS, true)
      // bond_nearest(ATOMS, 5, true)
      console.log("stable tri:", ATOMS[0].p, ATOMS[1].p, ATOMS[2].p )
     }
    if (ii==200) {
      console.log("HIT ME AGIN bonds:", BONDS.length);
      ATOMS[0].v.x = -21500;
      ATOMS[11].v.x = 9500;
    }
    if (ii >= TICK_MAX) {
      clearInterval(int)
    }
  }, TICK_SHOW/REALTIME * 1000);
}

test2 = function() {
  DAMP = 1
  BOND_P = 1
  BOND_D = .2
  RADIUS = 150
  TICK_PHYS = 1
  TICK_SHOW = 1
  REALTIME = 20
  ATOMS = []
  BONDS = [];
  ATOMS.push(new atom(188.5045597249305, 99.36340591910486, -10, 0));
  ATOMS.push(new atom(110.85884619417598, 389.1411538058254, 10, 0));
  ATOMS.push(new atom(400.6365940808962, 311.49544027506806));
  // ATOMS.push(new atom(200, 100, 0, 10));
  // ATOMS.push(new atom(200, 400, 0, -10));
  bond_all(ATOMS);
  display_clear();
  bonds_draw();
  atoms_draw();
  var ii=0;
  var int = setInterval( function(){
    display_clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii >= TICK_MAX) {
      clearInterval(int)
    }
  }, TICK_SHOW/REALTIME * 1000);
}

function asx(url, cb) {
  var xr = new XMLHttpRequest();
  xr.addEventListener("load", cb);
  xr.open("GET", url);
  xr.send();
  // console.log("asx:", xr.readyState)
}

test3 = function() {
  DAMP = 1
  BOND_P = 100
  BOND_D = .05
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  asx("./ball60.json?x="+randy(), function() {
    var ball1 = new thing("ball1", 794, 100, -300, 0, JSON.parse(this.responseText), true);
    // bond_triangulate(ball1.atoms, true);
    asx("./ball37.json?x="+randy(), function() {
      var ball2 = new thing("ball2", 800, 600, 0, 0, JSON.parse(this.responseText));
      bond_triangulate(ball2.atoms, true);
      COLLIDES.push([ball1, ball2]);
      console.log(BONDS.length, "bonds")
      display_clear();
      bonds_draw();
      atoms_draw();
      var ii=0;
      var int = setInterval( function(){
        display_clear();
        contacts_draw();
        bonds_draw();
        atoms_draw();
        update_all(TICK_SHOW/TICK_PHYS);
        ii++;
        if (ii >= TICK_MAX) {
          clearInterval(int)
        }
      }, TICK_SHOW/REALTIME * 1000);
    });
  });
}

test4 = function() {
  DAMP = .998
  BOND_P = 33
  BOND_D = .05
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var floor = new thing("floor");
  for (i=0; i<60; i++) {
    var at = new atom(100+i*20, 120+i*0, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  asx("./ball60.json?x="+randy(), function() {
    var ball2 = new thing("ball2", 400, 330, 0, 0, JSON.parse(this.responseText));
    bond_triangulate(ball2.atoms, true);
    COLLIDES.push([floor, ball2]);
    console.log(BONDS.length, "bonds")
    display_clear();
    bonds_draw();
    atoms_draw();
    var ii=0;
    var int = setInterval( function(){
      display_clear();
      contacts_draw();
      bonds_draw();
      atoms_draw();
      update_all(TICK_SHOW/TICK_PHYS);
      ii++;
      if (ii >= TICK_MAX) {
        clearInterval(int)
      }
    }, TICK_SHOW/REALTIME * 1000);
  });
}

