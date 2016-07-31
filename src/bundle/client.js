// Main entry for the app
var Engine = require('../engine');
Engine.init();
Engine.sankeySA();
// Engine.sankeyDemo(850, 600);

$('#btn-update-gender').on('click', function(){
  Engine.setCategory("sex", true);
});

$('#btn-update-age').on('click', function(){
  Engine.setCategory("age", true);
});

$('#btn-update-occupation').on('click', function(){
  Engine.setCategory("occupation", true);
});

var D3Map = require('../d3map');
D3Map.drawMap();
