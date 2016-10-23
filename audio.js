var context = new AudioContext();
var node = context.createScriptProcessor(1024, 1, 1);
var vol=0;
n = 0
node.onaudioprocess = function (e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < output.length; i++) {
    output[i] = vol*Math.sin(n);//Math.sin(n);
    n += 0.1
  }
};
node.connect(context.destination);
