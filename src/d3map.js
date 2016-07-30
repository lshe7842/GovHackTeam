var d3 = require('d3');
var D3Map = {
  //Zoomable map http://bl.ocks.org/mbostock/2374239
  zoommap: function() {
    //Width and height
    var w = 800;
    var h = 600;
    //Define map projection
    var projection = d3.geo.mercator()
      .translate([0, 0])
      .scale([1]);
    //Define path generator
    var path = d3.geo.path()
      .projection(projection);
    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var g = svg.append("g")
               .style("stroke-width", "1px");

    var active = d3.select(null);
    
    //Load in GeoJSON data
    d3.json("/data/aus_lga.json", function(json) {
      // Calculate bounding box transforms for entire collection
      var b = path.bounds(json),
        s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) /
          h),
        t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0]
          [1])) / 2];
      // Update the projection
      projection.scale(s)
        .translate(t);
      //Bind data and create one path per GeoJSON feature
      g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("click", clicked)
        .style("stroke-width", "1")
        .style("stroke", "steelblue")
        .style("fill", "white");
    });

    function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this)
        .classed("active", true);
      var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        //scale = .9 / Math.max(dx / w, dy / h),
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / w, dy / h)));
        translate = [w / 2 - scale * x, h / 2 - scale * y];
        strokeWidth =  (1 / scale);
        console.log(scale);
      g.transition()
       .duration(750)
       .style("stroke-width", 1 + "px")
       .attr("transform", "translate(" + translate + ")scale(" + scale +")");
      
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);
      g.transition()
        .duration(750)
        .style("stroke-width", "1px")
        .attr("transform", "");
    }
  }
}
module.exports = D3Map;