/*
 * simple API to display -- null version for node
 */ 
BOND_COLOR = "#cc88bb"
ATOM_COLOR = "#00004c"
ATOM_COLOR2 = "#99aa99"
CONTACT_COLOR = "#9999ff"

display_init = function() {
}

display_circle = function(x, y, r, color) {
}

display_line = function(x, y, x2, y2, color) {
}

display_clear = function() {
}

display_iterate = function(cb, cb2, sec, max) {
  console.log("di", sec, max)
  for(var ii=0; ii<max; ii++) {
    cb();
  }
  cb2();
}