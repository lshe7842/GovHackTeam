// Main entry for the app
var Engine = require('../engine');
Engine.init();
Engine.sankeyDemo(950, 500);

var D3Map = require('../d3map');
D3Map.zoommap();
