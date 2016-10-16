GRAVITY = -1000
RADIUS = 25;
RADIUS_SHOW = 2.5;
TICK_PHYS = 0.001;
TICK_SHOW = 0.01;
REALTIME = 1//2.5;
TICK_MAX = 1000000;
// TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20

BOND_P = 5
BOND_D = 0
CONTACT_P = 200
CONTACT_D = .3
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
  this.locked=locked;
  this.f = {x:0, y:0}
  
  this.update = function() {
    if(!this.locked) {
      this.v.x += this.f.x;
      this.f.x = 0;
      this.v.y += this.f.y;
      this.f.y = 0;
      this.p.x += this.v.x * TICK_PHYS;
      this.p.y += this.v.y * TICK_PHYS;
      this.v.x *= DAMP;
      this.v.y *= DAMP;
      this.v.y += GRAVITY * TICK_PHYS;
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
  var tot=xchk=ychk=dchk=0;
  CONTACTS = [];
  for (var i=0; i<COLLIDES.length; i++) {
    var ta = COLLIDES[i][0];
    var tb = COLLIDES[i][1];
    for (var j=0; j<ta.atoms.length; j++) {
      var a = ta.atoms[j];
      for (var k=0; k<tb.atoms.length; k++) {
        tot++;
        var b = tb.atoms[k];
        var dx = a.p.x-b.p.x;
        var thresh = a.radius+b.radius;
        if (Math.abs(dx) < thresh) {
          xchk++;
          var dy = a.p.y-b.p.y;
          if (Math.abs(dy) < thresh) {
            ychk++;
            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < thresh) {
              dchk++;
              CONTACTS.push([a, b])
            }
          }
        }
      }
    }
  }
  return {x:xchk, y:ychk, d:dchk, t:tot}
}

var momentum_swap = function(a, b, P, D, target) {
  var dx = b.p.x-a.p.x;
  var dy = b.p.y-a.p.y;
  var dist = Math.sqrt(dx*dx+dy*dy);      // distance between atoms
  var udx = dx / dist;                    // unit vector pointing from a to b
  var udy = dy / dist;
  var dif = dist - target;            // difference we want to restore to zero
  var pterm = dif * P ;                // Proportional term for our springy bond 

// original logic for posterity
  // var dvx = b.v.x-a.v.x;
  // var dvy = b.v.y-a.v.y;
  // var vdif = Math.sqrt(dvx*dvx+dvy*dvy);  // relative velocity
  // var vdot = 0;                           // if relative velocity==0, no Derivative term for our PiD
  // if (vdif) {
    // var uvx = dvx / vdif;                 // velocity unit vector (direction of rel vel)
    // var uvy = dvy / vdif;
    // vdot = uvx*udx + uvy*udy;             // dot product of positional direction vs rel vel - we only
  // }                                       // want to adjust velocity along axis aligned with 2 particles,
  // var dterm = vdif * vdot * D;        // Derivative term

// equivalent yet optimized:
  var dvx = b.v.x-a.v.x;
  var dvy = b.v.y-a.v.y;
  var vcomp = dvx*udx + dvy*udy;
  var dterm = vcomp * D;        // Derivative term

  var xswap = (pterm + dterm) * udx;          // along axis a--b
  var yswap = (pterm + dterm) * udy;

  a.f.x += xswap;                          // swap momenta
  b.f.x -= xswap;
  a.f.y += yswap;
  b.f.y -= yswap;
}

bonds_update = function() {
  for (var i=0; i<BONDS.length; i++) {
    var a = BONDS[i].a;
    var b = BONDS[i].b;
    var target = BONDS[i].d;
    momentum_swap(a, b, BOND_P, BOND_D, target);
  }
}

contacts_update = function() {
  for (var i=0; i<CONTACTS.length; i++) {
    var a = CONTACTS[i][0];
    var b = CONTACTS[i][1];
    var target = a.radius+b.radius;
    momentum_swap(a, b, CONTACT_P, CONTACT_D, target);
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

profile_counts={bonds:0, atoms:0, contacts_total:0, contacts_x:0, contacts_y:0, contacts_deep:0, real_contacts:0, iterations:0}
update_all = function(n) {
  for(var i=0; i<n; i++) {
    bonds_update();
    var cprof=refresh_contacts()
    contacts_update();
    atoms_update();
    profile_counts.iterations++;
    profile_counts.bonds += BONDS.length;
    profile_counts.atoms += ATOMS.length;
    profile_counts.real_contacts += CONTACTS.length;
    profile_counts.contacts_total += cprof.t;
    profile_counts.contacts_y += cprof.x;
    profile_counts.contacts_y += cprof.y;
    profile_counts.contacts_deep += cprof.d;
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
    verts.push([atoms[i].p.x, atoms[i].p.y])
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

collide_all = function(things) {
  for (var i=0; i<things.length; i++) {
    for (var j=i+1; j<things.length; j++) {
      COLLIDES.push([things[i], things[j]]);
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
