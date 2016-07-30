var d3 = require('d3');

var D3Map ={

    zoommap: function() {
        //Width and height
        var w = 900;
        var h = 600;
        var strokeWidth = "0.7px";

        
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

        var gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#ffff99")
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#FF8C00")
            .attr("stop-opacity", 1);

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
                .data(json.geometries)
                .enter()
                .append("path")
                .attr("d", path)
                .attr('id', function(d){return "lga_1" ;})
                .on("click", clicked)
                .style("stroke-width", "0.7px")
                .style("vector-effect", "non-scaling-stroke")
                .style("stroke", "#003300")
                .style("fill", "#ffff99");

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
                scale = Math.max(1, Math.min(100, 0.9 / Math.max(dx /
                    w, dy / h)));
            translate = [w / 2 - scale * x, h / 2 - scale * y];
            g.transition()
                .duration(750)
                .style("stroke-width", strokeWidth)
                .style("vector-effect", "non-scaling-stroke")
                .attr("transform", "translate(" + translate +
                    ")scale(" + scale + ")");
            g.selectAll("path")
                .style("vector-effect", "non-scaling-stroke")
                .style("fill", "#ffff99")
                .style("stroke-width", strokeWidth);

            active.style("fill", "url(#gradient)");

            console.log(d.properties);
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
                .style("fill", "#ffff99")
                .style("stroke-width", strokeWidth);
        }
    }
}


module.exports = D3Map;