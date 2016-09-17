RADIUS = 1

function init() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
}

function circle(x, y, r) {
  g_context.beginPath();
  g_context.arc(x, y, r, 0, Math.PI*2);
  g_context.stroke();
}

function line(x, y, x2, y2) {
  g_context.moveTo(x, y);
  g_context.lineTo(x2, y2);
  g_context.stroke();
}

function clear() {
  g_context.clearRect(0, 0, g_canvas.width, g_canvas.height);
}

function draw_particle(x, y) {
  circle(x, y, RADIUS);
}

function test() {
  line(10,10,990,590);
  circle(500, 300, 100);
  draw_particle(201,200);
  setTimeout(function(){
    clear()
    circle(600, 300, 80);
    draw_particle(204,200);
    line(100,100,200,101)
    g_context.fillRect(100,10,3,3);
    var i = 100;
    setInterval(function(){
      clear();
      draw_particle(i, i*.23);
      i+=2.5;
    }, 10);
  }, 500);
}

