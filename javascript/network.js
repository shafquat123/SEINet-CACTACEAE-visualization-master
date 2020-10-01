function network() {
// get the data
d3.csv("data/geneData.csv", function(error, links) {

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
    link.value = +link.value;
});

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
};

//Moves selction to back
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
    }
    });
};
var element = d3.select('#viz-3').node();

var width = element.getBoundingClientRect().width,
    height = element.getBoundingClientRect().height;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(40)
    .charge(-13)
    .on("tick", tick)
    .start();

var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.index }))
            .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0))

var div = d3.select("#viz-3").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var svg = d3.select("#viz-3").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

// add the nodes
node.append("circle")
    .attr("r", 5)
    .style("fill", "#3bd1c2")
    .on("mouseover", function(d) {
      var sel = d3.select(this);
        sel.moveToFront();
     d3.select(this).transition().duration(100).style({'opacity': 1, 'stroke': 'black', 'stroke-width': 1.5});
     div.transition().duration(100)
     .style("opacity", 1)
     div.text(d.name)
     .style("left", (d3.event.pageX) + "px")
     .style("top", (d3.event.pageY -30) + "px");
     })
     .on("mouseout", function() {
      var sel = d3.select(this);
        sel.moveToBack();
     d3.select(this)
     .transition().duration(300)
     .style({'opacity': 0.8, 'stroke': 'white', 'stroke-width': 1});
     div.transition().duration(100)
     .style("opacity", 0);
     });

// add the text
// node.append("text")
//     .attr("x", 12)
//     .attr("dy", ".35em")
//     .text(function(d) { return d.name; });

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; });
}

});
}
network();
