fizx = require('./fizx.js');
/*
WIDTH = 1000;
HEIGHT = 600;
RADIUS = 75;

ATOMS.push(new atom(200, 200));
ATOMS.push(new atom(200, 300));
ATOMS.push(new atom(300, 300));

bond_all(ATOMS);
update_all(1000);

console.log(ATOMS);
console.log("bond_all pass:",
            ATOMS[0].p.x == 210.91893638112674 &&
            ATOMS[0].p.y == 183.01497191216248 &&
            ATOMS[0].v.x == -0.00202959051124373 &&
            ATOMS[0].v.y == -0.00006415534173805077
            );

delaunay = require('./delaunay.js');
var vertices = [[0,0],[1,0],[0,2],[2,2]];
var triangles = Delaunay.triangulate(vertices);
console.log("delaunay test:", triangles);

// spell it out for me, Agent Smith

var expanded = [];
for (var i=0; i<triangles.length; i+=3) {
  var A = vertices[triangles[i]];
  var B = vertices[triangles[i+1]];
  var C = vertices[triangles[i+2]];
  console.log("  triangle:", A, B, C); 
}

ATOMS.push(new atom(200, 250));

BONDS = [];
bond_triangulate(ATOMS);
console.log("BONDS:");
for (var i=0; i<BONDS.length; i++) {
	var a = BONDS[i].a;
	var b = BONDS[i].b;
	console.log("   ", a.p.x, a.p.y, "<-->", b.p.x, b.p.y);
}
*/
console.log("update debug")
DBG = 1
DAMP = 1
BOND_P = 1
BOND_D = .1
RADIUS = 50
TICK_PHYS = 1
ATOMS = []
BONDS = [];
ATOMS.push(new atom(188.5045597249305, 99.36340591910486));
ATOMS.push(new atom(110.85884619417598, 389.1411538058254));
ATOMS.push(new atom(400.6365940808962, 311.49544027506806));
bond_all(ATOMS);
// console.log("BONDS:", BONDS)
console.log("--A:", ATOMS[0].p.x, ATOMS[0].p.y, "vel:", ATOMS[0].v.x, ATOMS[0].v.y, "B:", ATOMS[1].p.x, ATOMS[1].p.y, "vel:", ATOMS[1].v.x, ATOMS[1].v.y)
for(var i=0; i<4; i++) {
  update_all(1)
  console.log("  A:", ATOMS[0].p.x, ATOMS[0].p.y, "vel:", ATOMS[0].v.x, ATOMS[0].v.y, "B:", ATOMS[1].p.x, ATOMS[1].p.y, "vel:", ATOMS[1].v.x, ATOMS[1].v.y)
}
