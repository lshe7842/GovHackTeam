// Main entry for the app
var Engine = require('../engine');
Engine.init();
// Engine.sankeySA(850, 600, "101", "age");
Engine.sankeyDemo(850, 600);

var D3Map = require('../d3map');
D3Map.zoommap();
