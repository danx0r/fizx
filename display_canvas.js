/*
 * simple API to display, canvas implementation
 */ 

BOND_COLOR = "#cc88bb"
ATOM_COLOR = "#00004c"
ATOM_COLOR2 = "#99aa99"
CONTACT_COLOR = "#dd2222"

display_init = function() {
  g_canvas = document.getElementById("canvas");
  g_context = g_canvas.getContext("2d");
  console.log("canvas context:", g_context);
  WIDTH = g_canvas.width;
  HEIGHT = g_canvas.height;
}

display_circle = function(x, y, r, color) {
  g_context.beginPath();
  g_context.arc(x, HEIGHT-1-y, r, 0, Math.PI*2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
}

display_line = function(x, y, x2, y2, color) {
  g_context.beginPath();
  g_context.moveTo(x, HEIGHT-1-y);
  g_context.lineTo(x2, HEIGHT-1-y2);
  if(color) {
    g_context.strokeStyle = color;
  } else {
    g_context.strokeStyle = "#000000";
  }
  g_context.stroke();
}

display_clear = function() {
  g_context.clearRect(0, 0, WIDTH, HEIGHT);
}
