function bubbleChart () {
  var svg = d3.select("#viz-4").append("svg")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "middle")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("id","bubble")
      .attr("height",700);

  var  width = window.innerWidth,
      height = window.innerHeight;


  var g = svg.append("g");


    // Define the div for the tooltip
  var div = d3.select("#viz-4").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  //var color= d3.scaleSequential(d3.interpolateYlGn);
  //var color = d3.scaleOrdinal(d3.schemeBlues[60]);

  function zoom() {
    g.attr("transform", d3.event.transform);
  }

  var pack = d3.pack()
      .size([width-800, height-50])
      .padding(1.5);


  d3.csv("data/avgheight.csv", function(d) {
    d.value = +d["MinimumElevation"];
    d.genus = d["genus"]

    return d;
  }, function(error, data) {
    if (error) throw error;

    function getGenus(data){
      a = [];
      data.forEach(function(d, i) {
        a[i] = d["MinimumElevation"];
      });
      return a;
    }
    //var color = d3.scaleSequential(d3.interpolateYlGn).domain(data.map(function(d){ return d.genus;}));
    var color = d3.scaleSequential()
    .domain(getGenus(data))
    .interpolator(d3.interpolateCool);



    var root = d3.hierarchy({children: data})
        .sum(function(d) { return d.value; })

    var node = svg.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.data.value); })
        .on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);

        var duration = 300;
    data.forEach(function(d, i) {
      //console.log(d.value);
      node.transition().duration(duration).delay(i * duration)
          .attr("r", d.value);
  });


      div.html(" <br>"+"Genus: "+d.data.genus + " <br>"+"Avg Height in Meters: "+d.data.value  )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
      .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });



     node.append("text")
        .text(function(d) {
       if (d.data.value > 400){
         return d.data.genus;
       }
       return "";});

  });

}

bubbleChart();
