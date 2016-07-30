var d3 = require('d3');


var D3Map = {

  //http://bl.ocks.org/mbostock/4060606
  choropleth: function () {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var rateById = d3.map();

    var quantize = d3.scaleQuantize()
        .domain([0, 0.15])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var projection = d3.geoAlbersUsa()
        .scale(1280)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    d3.queue()
        .defer(d3.json, "/data/us.json")
        .defer(d3.tsv, "/data/unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
        .await(ready);

    function ready(error, us) {
      if (error) throw error;

      svg.append("g")
          .attr("class", "counties")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
          .attr("class", function(d) { return quantize(rateById.get(d.id)); })
          .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }
  },

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
