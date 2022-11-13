
var vol=0;
var oldV=0;
n = 0
let sssDsadf=false;
window.addEventListener("click",()=>{
  if(!sssDsadf){

  sssDsadf=true;
  var context = new AudioContext();
var node = context.createScriptProcessor(1024, 1, 1);
node.onaudioprocess = function (e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < output.length; i++) {
      oldV=Math.max(oldV*0.05,vol);
    output[i] = oldV*((Math.round(Math.sin(n)/2+0.5)*2-1)*0.5+Math.sin(n)*0.5);//Math.sin(n);
    n += 0.06
  }
};
node.connect(context.destination);
  // context.resume();
}
}
)