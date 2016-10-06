fizx = require('./fizx.js');

WIDTH = 1000;
HEIGHT = 600;

ATOMS.push(new atom(200, 200));
ATOMS.push(new atom(200, 300));
ATOMS.push(new atom(300, 300));

bond_all(ATOMS);
update_all(1000);

// console.log(ATOMS);
console.log("bond_all pass:",
            ATOMS[0].p.x == 210.91893638112674 &&
            ATOMS[0].p.y == 183.01497191216248 &&
            ATOMS[0].v.x == -0.00202959051124373 &&
            ATOMS[0].v.y == -0.00006415534173805077
            );
