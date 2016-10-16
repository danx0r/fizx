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
  var intv = setInterval( function(){
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
      clearInterval(intv)
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

test3 = function() {
  DAMP = 1
  BOND_P = 33
  BOND_D = .5
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var floor = new thing("floor");
  for (i=0; i<60; i++) {
    var at = new atom(100+i*20, 120+i*3, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i=0; i<60; i++) {
    var at = new atom(10+i*20, 90+(60-i)*5, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  asx("./ball60.json?x="+randy(), function() {
    var ball1 = new thing("ball1", 1194, 600, -300, 0, JSON.parse(this.responseText));
    bond_triangulate(ball1.atoms, true);
    asx("./ball23.json?x="+randy(), function() {
      var ball2 = new thing("ball2", 130, 600, 0, 0, JSON.parse(this.responseText));
      bond_triangulate(ball2.atoms, true);
      COLLIDES.push([ball1, ball2], [ball1, floor], [ball2, floor]);
      console.log(BONDS.length, "bonds")
      display_clear();
      bonds_draw();
      atoms_draw();
      var ii=0;
      var intv = setInterval( function(){
        display_clear();
        contacts_draw();
        bonds_draw();
        atoms_draw();
        update_all(TICK_SHOW/TICK_PHYS);
        ii++;
        if (ii >= TICK_MAX) {
          clearInterval(intv)
        }
      }, TICK_SHOW/REALTIME * 1000);
    });
  });
}

test4 = function() {
  DAMP = 1
  BOND_P = 33
  BOND_D = .5
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var floor = new thing("floor");
  for (i=0; i<60; i++) {
    var at = new atom(100+i*20, 120+i*3, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i=0; i<60; i++) {
    var at = new atom(100+i*20, 70+(60-i)*3, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  asx("./ball60.json?x="+randy(), function() {
    var ball2 = new thing("ball2", 1100, 630, 0, 0, JSON.parse(this.responseText));
    bond_triangulate(ball2.atoms, true);
    COLLIDES.push([floor, ball2]);
    console.log(BONDS.length, "bonds")
    display_clear();
    bonds_draw();
    atoms_draw();
    var ii=0;
    var intv = setInterval( function(){
      display_clear();
      contacts_draw();
      bonds_draw();
      atoms_draw();
      update_all(TICK_SHOW/TICK_PHYS);
      ii++;
      if (ii >= TICK_MAX) {
        clearInterval(intv)
      }
    }, TICK_SHOW/REALTIME * 1000);
  });
}

first_run = function() {
  DAMP = 1
  BOND_P = 33
  BOND_D = 0.25
  TICK_MAX = 1000;
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var floor = new thing("floor");
  for (i=0; i<49; i++) {
    var at = new atom(220+i*20, 420+i*4, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i=0; i<40; i++) {
    var at = new atom(15+i*20, 620+(60-i)*3, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  for (i=0; i<60; i++) {
    var at = new atom(25+i*10, 221, 0, 0, 10, true);
    floor.add(at);
    ATOMS.push(at);
  }
  var at = new atom(725, 221, 0, 0, 10, true);
  floor.add(at);
  ATOMS.push(at);

  var curtain = new thing("curtain");
  for (i=0; i<20; i++) {
    var at = new atom(208, 250+i*20, 0, 0, 11, i==19);
    curtain.add(at);
    ATOMS.push(at);
  }
  bond_nearest(curtain.atoms,4,true);

  var small = new thing("x");
  var at = new atom(330, 300, 0, 0, 10);
  small.add(at);
  ATOMS.push(at);
  var at2 = new atom(300, 300, 0, 0, 10);
  small.add(at2);
  ATOMS.push(at2);
  var at3 = new atom(315, 370, 0, 0, 10);
  small.add(at3);
  ATOMS.push(at3);
  bond_nearest([at,at2,at3],2,true);
  
  var ball1 = new thing("ball2", 140, 1100, 0, 0, ball16);
  bond_triangulate(ball1.atoms, true);
  var ball2 = new thing("ball2", 130, 900, 0, 0, ball23);
  bond_triangulate(ball2.atoms, true);
  collide_all([floor, ball1, ball2, small, curtain]);
  console.log(BONDS.length, "bonds")
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
    console.log("DONE -- ms timing:", (new Date).getTime()-T);
  },
  TICK_SHOW/REALTIME * 1000, TICK_MAX);
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
  TICK_MAX = 1000;
  // REALTIME = .1; TICK_SHOW=TICK_PHYS
  display_init();
  var ob1 = new thing("1");
  for (i=0; i<10; i++) {
    var at = new atom(100+i*20, 400, 0, 0, 10);
    ob1.add(at);
    ATOMS.push(at);
  }

  var ob2 = new thing();
  for (i=0; i<10; i++) {
    var at = new atom(100+i*20, 500, 0, 0, 10);
    ob2.add(at);
    ATOMS.push(at);
  }

  collide_all([ob1, ob2]);
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
    console.log(profile_counts);
  },
  function() {
    console.log("DONE -- ms timing:", (new Date).getTime()-T);
  },
  TICK_SHOW/REALTIME * 1000, TICK_MAX);
}
