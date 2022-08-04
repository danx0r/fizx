fizx = new fizxlib();

test = function() {
  TIME_MAX = 111;
  params = {};
  params.DAMP = 1
  params.BOND_P = 33
  params.BOND_D = 0.25
  params.CONTACT_P = 1000
  params.CONTACT_D = 0
  params.TICK_PHYS = 0.001;
  params.TICK_SHOW = 0.01;
  params.REALTIME = 1;
//  params.GRAVITY = 0;
  fizx.set_params(params);
  display_init();

  var bs = [];
  for (var i=0; i<5; i++) {
    var a = new fizx.thing("a");
    var aa = new fizx.atom(500 + i * 50, 800, 0, 0, 10, true)
    a.add(aa);
    fizx.ATOMS.push(aa);
    var b = new fizx.thing("b");
    bs.push(b);
    var e = 500 + i * 50;
    var f = 600;
    if (i == 0) {
      e = 300;
      f = 800;
    }
    var bb = new fizx.atom(e, f, 0, 0)
    b.add(bb);
    fizx.ATOMS.push(bb);
    fizx.BONDS.push(new fizx.bond(aa, bb, 200))
  }
  fizx.collide_all(bs);
//
//  var a = new fizx.thing("a");
//  var aa = new fizx.atom(300, 800, 0, 0)
//  a.add(aa);
//  fizx.ATOMS.push(aa);
//
//  var b = new fizx.thing("b");
//  var bb = new fizx.atom(550, 600, 0, 0)
//  b.add(bb);
//  fizx.ATOMS.push(bb);
//
//  fizx.collide_all([a,b]);
//
//  var x = new fizx.thing("x");
//  var xx = new fizx.atom(500, 800, 0, 0, 10, true)
//  x.add(xx);
//  fizx.ATOMS.push(xx);
//  fizx.BONDS.push(new fizx.bond(xx, aa, 200))
//
//  var y = new fizx.thing("y");
//  var yy = new fizx.atom(550, 800, 0, 0, 10, true)
//  y.add(yy);
//  fizx.ATOMS.push(yy);
//  fizx.BONDS.push(new fizx.bond(yy, bb, 200))

  console.log("atoms:", fizx.ATOMS.length)
  console.log("bonds:", fizx.BONDS.length)
  display_clear();
  fizx.bonds_draw();
  fizx.atoms_draw();
  console.log("START");
  T = (new Date).getTime();

  display_iterate( function(){
    display_clear();
    fizx.contacts_draw();
    fizx.bonds_draw();
    fizx.atoms_draw();
    fizx.update_all(params.TICK_SHOW/params.TICK_PHYS);
  },
  function() {
    console.log("DONE -- ms timing:", (new Date).getTime()-T);
    console.log(fizx.profile_counts);
  },
  params.TICK_SHOW/params.REALTIME * 1000, TIME_MAX/params.TICK_SHOW);
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
  var intv = setInterval( function(){
    display_clear();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii >= TICK_MAX) {
      clearInterval(intv)
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

/*
 var GRAVITY = -1000
-  var RADIUS = 25;
-  var RADIUS_SHOW = 2.5;
-  var TICK_PHYS = 0.001;
-  var TICK_SHOW = 0.01;
-  var REALTIME = 1//2.5;
-  // var TICK_MAX = 1000000;
-  var TIME_MAX = 10.0;
-  // var TICK_SHOW = TICK_PHYS; REALTIME=0.01; TICK_MAX=20
-  
-  var BOND_P = 5
-  var BOND_D = 0
-  var CONTACT_P = 200
-  var CONTACT_D = .3
-  var DAMP = 0.975
 */
first_run = function() {
  var TIME_MAX = 45;
  params = {};
  params.DAMP = 1
  params.BOND_P = 33
  params.BOND_D = 0.25
  params.CONTACT_P = 200
  params.CONTACT_D = 0.3
  params.TICK_PHYS = 0.001;
  params.TICK_SHOW = 0.01;
  params.REALTIME = 1; 
  fizx.set_params(params);

  display_init();
  var floor = new fizx.thing("floor");
  for (i=0; i<49; i++) {
    var at = new fizx.atom(220+i*20, 420+i*4, 0, 0, 10, true);
    floor.add(at);
    fizx.ATOMS.push(at);
  }
  for (i=0; i<40; i++) {
    var at = new fizx.atom(15+i*20, 620+(60-i)*3, 0, 0, 10, true);
    floor.add(at);
    fizx.ATOMS.push(at);
  }
  for (i=0; i<60; i++) {
    var at = new fizx.atom(25+i*10, 221, 0, 0, 10, true);
    floor.add(at);
    fizx.ATOMS.push(at);
  }
  var at = new fizx.atom(725, 221, 0, 0, 10, true);
  floor.add(at);
  fizx.ATOMS.push(at);

  var curtain = new fizx.thing("curtain");
  for (i=0; i<20; i++) {
    var at = new fizx.atom(208, 250+i*20, 0, 0, 11, i==19);
    curtain.add(at);
    fizx.ATOMS.push(at);
  }
  fizx.bond_nearest(curtain.atoms,4,true);

  var small = new fizx.thing("x");
  var at = new fizx.atom(330, 300, 0, 0, 10);
  small.add(at);
  fizx.ATOMS.push(at);
  var at2 = new fizx.atom(300, 300, 0, 0, 10);
  small.add(at2);
  fizx.ATOMS.push(at2);
  var at3 = new fizx.atom(315, 370, 0, 0, 10);
  small.add(at3);
  fizx.ATOMS.push(at3);
  fizx.bond_nearest([at,at2,at3],2,true);
  
  var ball1 = new fizx.thing("ball2", 140, 1100, 0, 0, ball16);
  fizx.bond_triangulate(ball1.atoms, true);
  var ball2 = new fizx.thing("ball2", 130, 900, 0, 0, ball23);
  fizx.bond_triangulate(ball2.atoms, true);
  fizx.collide_all([floor, ball1, ball2, small, curtain]);
  console.log("atoms:", fizx.ATOMS.length)
  console.log("bonds:", fizx.BONDS.length)
  display_clear();
  fizx.bonds_draw();
  fizx.atoms_draw();
  console.log("START");
  T = (new Date).getTime();

  display_iterate( function(){
    display_clear();
    fizx.contacts_draw();
    fizx.bonds_draw();
    fizx.atoms_draw();
    fizx.update_all(params.TICK_SHOW/params.TICK_PHYS);
  }, 
  function() {
    console.log("DONE -- ms timing:", (new Date).getTime()-T);
    console.log(fizx.profile_counts);
  },
  params.TICK_SHOW/params.REALTIME * 1000, TIME_MAX/params.TICK_SHOW);
}

sound = function() {
  BOND_D = 0.05
  CONTACT_P = 2000
  CONTACT_D = 0
  TICK_PHYS=0.00005
  REALTIME = 1000; TICK_SHOW=TICK_PHYS
  TICK_MAX = 22000;
  display_init();
  // var a=new atom(100,110,0,0,50)
  // var b=new atom(100,200,0,0,50)
  // var c=new atom(200,200,0,0,50)
  // ATOMS.push(a);
  // ATOMS.push(b);
  // ATOMS.push(c);
  // BONDS.push(new bond(a, b, 110))
  // BONDS.push(new bond(b, c, 130))
  // BONDS.push(new bond(a, c, 160))
  var floor = new thing("floor");
  for (i=0; i<100; i++) {
    var at = new atom(25+i*10, 221, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  var ball1 = new thing("ball2", 100, 552, 10000, 0, ball23);
  bond_triangulate(ball1.atoms, true);
  var ball2 = new thing("ball2", 1100, 500, -10000, 0, ball23);
  bond_triangulate(ball2.atoms, true);
  collide_all([ball1, ball2, floor]);
  ii=0;
  console.log("START");
  var a = ball1.atoms[4];
  var b = ball1.atoms[5]; 
  var intv = setInterval( function(){
    // console.log("draw", ii);
    var dx = b.p.x-a.p.x;
    var dy = b.p.y-a.p.y;
    var d = Math.sqrt(dx*dx+dy*dy)
    d -= 50;
    console.log(d);
    display_clear();
    contacts_draw();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
    ii++;
    if (ii >= TICK_MAX) {
      clearInterval(intv);
      console.log("DONE");
    }
  }, TICK_SHOW/REALTIME * 1000);
}

test_profile = function() {
  DAMP = 1
  BOND_P = 33
  BOND_D = .5
  GRAVITY = 0
  TICK_MAX = 12500;
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var ob1 = new thing("1");
  for (i=0; i<20; i++) {
    var at = new atom(100+i*20, 400, 0, 0, 10);
    ob1.add(at);
    ATOMS.push(at);
  }

  var ob2 = new thing();
  for (i=0; i<20; i++) {
    var at = new atom(100+i*20, 500, 0, 0, 10);
    ob2.add(at);
    ATOMS.push(at);
  }

  bond_nearest(ATOMS, 2)

  collide_all([ob1, ob2]);
  console.log(ATOMS.length, "atoms")
  console.log(BONDS.length, "bonds")
  var ret=refresh_contacts()
  console.log("CONTACTS:", ret)
  display_clear();
  bonds_draw();
  atoms_draw();
  console.log("START");
  T = (new Date).getTime();

  display_iterate( function(){
    // console.log("draw", ii);
    display_clear();
    contacts_draw();
    bonds_draw();
    atoms_draw();
    update_all(TICK_SHOW/TICK_PHYS);
  },
  function() {
    console.log(profile_counts);
    console.log("DONE -- ms timing:", (new Date).getTime()-T);
  },
  TICK_SHOW/REALTIME * 1000, TIME_MAX/TICK_SHOW);
}
