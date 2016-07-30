var d3 = require('d3');


var D3Map = {
  //Zoomable map http://bl.ocks.org/mbostock/2374239
  zoommap: function() {

    //Width and height
    var w = 800;
    var h = 600;

    //Define map projection
    var projection = d3.geoMercator()
                           .translate([0, 0])
                           .scale([1]);

    //Define path generator
    var path = d3.geoPath()
                     .projection(projection);

    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var zoom = d3.zoom()
                  .on("zoom", zoomed);

    svg.call(zoom);

    //Load in GeoJSON data
    d3.json("/data/aus_lga.json", function(json) {


        // Calculate bounding box transforms for entire collection
        var b = path.bounds( json ),
        s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
        t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

        // Update the projection
        projection
          .scale(s)
          .translate(t);


        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("stroke-width", "1")
           .style("stroke", "black")
           .style("fill", "steelblue");

    });

    function zoomed() {
      console.log("zoomed");
      svg.selectAll("path").attr("transform", d3.event.transform);
    }

  }

}

module.exports = D3Map;
