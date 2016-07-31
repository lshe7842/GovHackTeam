var d3 = require('d3');
var Engine = require('./engine');

var D3Map ={

    drawMap: function() {
        var data; // a global

        d3.json("/api/gearing", function(error, json) {

            if (error) return console.warn(error);

            data = json;
            var dataLookup = [];
            for (var i = data.length - 1; i >= 0; i--) {
                     var datum = data[i];
                     dataLookup["sa_" + datum.sa4] = datum;
                }

            D3Map.dataLookUp = dataLookup;
            D3Map.zoommap();
        });

                },

    dataLookUp : undefined,

    regionTextLocation : undefined,

    drawLegend: function(g) {

        var x = 10, y = 170;

        g.append("text")
         .attr("x", x)
         .attr("y", y - 20)
         .text("Positive gearing")
         .attr("font-family", "sans-serif")
         .style("fill", D3Map.generateFillColour(50))
         .attr("font-size", "20px");

        g.append("rect")
         .attr("x", x)
         .attr("y", y)
         .attr("width", 50)
         .attr("height", 10)
         .style("fill", D3Map.generateFillColour(50))
         .style("stroke", "none");

        y += 20;

        for (var i = 50; i >= -50; i--) {
            g.append("rect")
             .attr("x", x)
             .attr("y", y)
             .attr("width", 50)
             .attr("height", 2)
             .style("fill", D3Map.generateFillColour(i))
             .style("stroke", "none");

             y += 2;
        }

        y += 15;

        g.append("rect")
         .attr("x", x)
         .attr("y", y)
         .attr("width", 50)
         .attr("height", 10)
         .style("fill", D3Map.generateFillColour(-50))
         .style("stroke", "none");

         g.append("text")
          .attr("x", x)
          .attr("y", y + 40)
          .text("Negative gearing")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .style("fill", D3Map.generateFillColour(-50));


    },

    showRegionLabel: function(node, d, g) {

        if (D3Map.regionTextLocation) {
            D3Map.regionTextLocation.text("");
        }

        var bbox = node.getBBox();
        var coords = { "x" : (bbox.x + bbox.width/2), 
                       "y" : (bbox.y + bbox.height/2) 
                      };

        console.log(coords);

       var elem = document.getElementById("label");
       elem.innerHTML = "Region: " + d.properties.SA4_NAME11;


      

      


          
    },

    
    generateFillColour: function(gearing){

        var color = d3.scale.linear()
                            .domain([-50, 0, 50])
                            .range(["#FF8C00", "white", "#1a75ff"]);
        return color(gearing);
    },

    zoommap: function() {
        //Width and height
        var w = 800;
        var h = 600;
        var strokeWidth = "0.7px";

        console.log("Hi");

        //Define map projection
        var projection = d3.geo.mercator()
            .translate([0, 0])
            .scale([1]);
        //Define path generator
        var path = d3.geo.path()
            .projection(projection);
        //Create SVG element
        var svg = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.append("rect")
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr("width", w)
            .attr("height", h)
            .on("click", reset);

        var g = svg.append("g")
            .style("stroke-width", strokeWidth)
            .style("vector-effect", "non-scaling-stroke");

        var active = d3.select(null);
        //Load in GeoJSON data
        d3.json("data/SA4_2011_AUST.json", function(json) {

            // Calculate bounding box transforms for entire collection
            var b = path.bounds(json),
                s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[
                    1][1] - b[0][1]) / h),
                t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s *
                    (b[1][1] + b[0]
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
                .attr('id', function(d) {
                                return "sa_" + d.properties.SA4_CODE11;
                            })
                .on("click", clicked)
                .style("stroke-width", "0.7px")
                .style("vector-effect", "non-scaling-stroke")
                .style("stroke", "#003300")
                .style("fill", function(d) {
                                   var data = D3Map.dataLookUp["sa_" + d.properties.SA4_CODE11];
                                   data = data ? data : {"positivelyGeared" : 0, "negativelyGeared" : 0};
                                   return D3Map.generateFillColour(data.positivelyGeared - data.negativelyGeared);
                                });

            });

        D3Map.drawLegend(g);

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
                scale = Math.max(1, Math.min(100, 0.9 / Math.max(dx /
                    w, dy / h)));
            translate = [w / 2 - scale * x, h / 2 - scale * y];

            g.transition()
                .duration(750)
                .style("stroke-width", strokeWidth)
                .style("vector-effect", "non-scaling-stroke")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            g.selectAll("path")
                .style("vector-effect", "non-scaling-stroke")
                .style("stroke-width", strokeWidth);

            active.style("stroke-width", "2px");
            
            D3Map.showRegionLabel(this, d, g);


            Engine.setSA4(d.properties.SA4_CODE11, true);
        }

        function reset() {
            active.classed("active", false);
            active.style("fill", "#ffff99");
            active = d3.select(null);
            g.transition()
                .duration(750)
                .style("stroke-width", strokeWidth)
                .style("vector-effect", "non-scaling-stroke")
                .attr("transform", "");

            g.selectAll("path")
                .style("vector-effect", "non-scaling-stroke")
                .style("fill", function(d) {
                                   var data = D3Map.dataLookUp["sa_" + d.properties.SA4_CODE11];
                                   data = data ? data : {"positivelyGeared" : 0, "negativelyGeared" : 0};
                                   return D3Map.generateFillColour(data.positivelyGeared - data.negativelyGeared);
                                })
                .style("stroke-width", strokeWidth);


                var elem = document.getElementById("label");
                elem.innerHTML = "Region: Australia";

            Engine.setSA4("", true);
        }
    }
}


module.exports = D3Map;
