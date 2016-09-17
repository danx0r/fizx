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

function test() {
  line(10,10,990,590);
  circle(500, 300, 100);
  setTimeout(function(){
    clear()
    circle(600, 300, 80);
  }, 500);;
}
