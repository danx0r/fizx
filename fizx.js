RADIUS = 1
  TICK = 0.01

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

ATOMS = []

function atom(x, y, vx, vy, fx, fy) {
  if (vx==null) vx = vy = 0;
  if (fx==null) fx = fy = 0;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  this.f = {x: fx, y: fy};
  console.log("atom:", this.p, this.v, this.f)
  
  this.update = function(dt) {
    var it = 0;
    var t = 0;
    while(t < dt) {
      this.p.x += this.v.x * TICK;
      this.p.y += this.v.y * TICK;
      this.v.x += this.f.x * TICK;
      this.v.y += this.f.y * TICK;
      t += TICK;
      it++;
    }
    return it;
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    draw_particle(this.p.x, this.p.y);
  };

  ATOMS.push(this)
}

function atoms_update(dt) {
  for (var i=0; i<ATOMS.length; i++) {
    var step = ATOMS[i].update(dt);
  }
}

function atoms_draw() {
  for (var i=0; i<ATOMS.length; i++) {
    ATOMS[i].draw();
  }
}

function test() {
  var p1 = new atom(400, 300, 100, 0);
  var p2 = new atom(600, 300);
  setInterval(function(){
    clear();
    atoms_draw();
    var ret=atoms_update(0.02);
    console.log("ticks:", ret);
  }, 20);
}
