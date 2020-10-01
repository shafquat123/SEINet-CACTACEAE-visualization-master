var width = window.innerWidth,
    height = window.innerHeight*0.75;

var projection = d3.geo.mercator()
    .center([90, 40 ])
    .scale(550)
    .rotate([-150,0]);
    // .center([0, 0 ])
    // .scale(50)
    // .rotate([0,0]);

var svg = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);


var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

var tooltip = d3.select("#info")
                        .append("div")
                        .attr("class", "tooltip1")
                        .style("float", "left")
                        .style("margin-left", "50px")
                        .style("opacity", 0);

var tp = d3.select('#info').node();
// load and display the World
d3.json("https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json", function(error, topology) {
var div = d3.select("body").append("div")
    .attr("class", "tooltip1")
    .style("opacity", 0);

d3.csv("data/pro_combined.csv", function(error, data) {
	outerData = data;
    g.selectAll(".mark")
        .data(data)
        .enter()
        .append("svg:image")
        .attr('class','mark')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href","images/pin.png")
        .attr("transform", function(d) {
            if(!isNaN(d.decimalLatitude) && !isNaN(d.decimalLongitude) && !isNaN(projection([parseInt(d.decimalLongitude), parseInt(d.decimalLatitude)])[0] )) {
              return "translate(" + projection([parseInt(d.decimalLongitude)-2, parseInt(d.decimalLatitude)+2.5])+ ")";
            }

        })
        .on("mouseover", function(d) {
                    var imgstring = "<div style= 'width: 14rem;height:10rem' class='img-div'> <img src='./images/"+ d.imgname+ ".jpg' /></div>";
                    var name = "<div class='tt-text'><b> Scientific name: </b>" + d.scientificName + " </div>";

                    var genus = "<div class='tt-text'><b> Genus: </b>" + d.genus + "</div>";
                    var location = "<div class='tt-text'><b> Location: </b>" + d.county + ", " + d.stateProvince + ", " + d.country + "</div>";
                    var habitat ="<div class='tt-text'><b> Habitat: </b>" + d.habitat + "</div>";
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip
                        .html(imgstring + name + genus + location + habitat)
                        .style("left", projection([d.decimalLongitude, d.decimalLatitude])[0] +10 + "px")
                        .style("top",function(){
                                  if(projection([d.decimalLongitude, d.decimalLatitude])[1]+ 520 > window.innerHeight){
                                      return projection([d.decimalLongitude, d.decimalLatitude])[1]-100 + "px";
                                  }else{
                                      return projection([d.decimalLongitude, d.decimalLatitude])[1] + 10 + "px";
                                  }
                              })

                })
                .on("mouseout", function(j, i) {
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                })

});


g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
});

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")
            .attr("d", path.projection(projection));

  });

svg.call(zoom)
