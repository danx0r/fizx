var fs=require('fs');
require('./fizx.js');
require('./delaunay.js');

RADIUS = 25;
BOND_P = 5
BOND_D = 0
DAMP = 0.975
ATOMS = [];
BONDS = [];

rand32(12356);
for (var i=0; i<process.argv[2]; i++) {
  // new atom(Math.random() * WIDTH, Math.random() * HEIGHT);
  ATOMS.push(new atom(randy() * 1000, randy() * 1000));
}
bond_all(ATOMS);
update_all(3000);
BONDS = [];
bond_triangulate(ATOMS, true)

// compute average bond length
var avgd = 0
for(var i=0; i<BONDS.length; i++) {
  avgd += BONDS[i].d;
}
avgd /= BONDS.length;
console.log("average distance twixt atoms:", avgd);
// center the ball

var avgx = 0;
var avgy = 0;
for(var i=0; i<ATOMS.length; i++) {
  avgx += ATOMS[i].p.x;
  avgy += ATOMS[i].p.y;
}
avgx /= ATOMS.length;
avgy /= ATOMS.length;
for(var i=0; i<ATOMS.length; i++) {
  ATOMS[i].v.x = 0;
  ATOMS[i].v.y = 0;
  ATOMS[i].p.x -= avgx;
  ATOMS[i].p.y -= avgy;
  ATOMS[i].radius = avgd * .4;     // somwat arbitrary
}

console.log(ATOMS.length, "atoms");
console.log(BONDS.length, "bonds");
var nom = "ball"+process.argv[2]; 
var fn = nom+".js"
fs.writeFileSync(fn, nom+"="+JSON.stringify(ATOMS));
console.log("wrote to file", fn)
