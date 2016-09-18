RADIUS = 1

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

function atom(x, y, vx, vy, fx, fy) {
  if (vx==null) vx = vy = 0;
  if (fx==null) fx = fy = 0;
  this.p = {x: x, y: y};
  this.v = {x: vx, y: vy};
  this.f = {x: fx, y: fy};
  console.log("atom:", this.p, this.v, this.f)
  
  this.update = function(dt) {
    this.p.x += this.v.x * dt;
    this.p.y += this.v.y * dt;
    this.v.x += this.f.x * dt;
    this.v.y += this.f.y * dt;
    if(this.p.y < 100) {
      this.v.y = -this.v.y * .9;
    }
  };
  
  this.draw = function() {
    // console.log("draw at", this.p.x, this.p.y)
    draw_particle(this.p.x, this.p.y);
  };
}

function test() {
  var p1 = new atom(10, 500, 100, 0, 0, -1000);
  setInterval(function(){
    clear();
    line(0, 100, 1000, 100);
    p1.draw();
    p1.update(0.01);
  }, 10);
}
