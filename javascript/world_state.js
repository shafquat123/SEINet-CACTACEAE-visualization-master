function renderMap(jsondata, name = "") {
  d3.select(".mapNew").remove();
  var width = 962,
          rotated = 80,
          height = 502;

      //countries which have states, needed to toggle visibility
      //for USA/ etc. either show countries or states, not both
      var usa, canada;
      var states; //track states
      //track where mouse was clicked
      var initX;
      //track scale only rotate when s === 1
      var s = 1;
      var mouseClicked = false;


      var projection1 = d3.geo.mercator()
          .scale(340)
          .translate([width/2,height])
          .rotate([rotated,0,0]); //center on USA because 'murica

      var zoomNew = d3.behavior.zoom()
           .scaleExtent([1, 10])
           .on("zoom", zoomed);

      var svgNew = d3.select("#viz-6").append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr('class', 'mapNew')
            //track where user clicked down
            .on("mousedown", function() {
               d3.event.preventDefault();
               //only if scale === 1
               if(s !== 1) return;
                 initX = d3.mouse(this)[0];
                 mouseClicked = true;
            })
            .on("mouseup", function() {
                if(s !== 1) return;
                rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * width));
                mouseClicked = false;
            })
          .call(zoomNew);

        var color = d3.scale.linear()
        			  .range(["rgb(213,222,217)","#7CB342","rgb(84,36,55)","rgb(217,91,67)"]);


        function rotateMap(endX) {
          projection1.rotate([rotated + (endX - initX) * 360 / (s * width),0,0])
              g.selectAll('path')       // re-project path data
             .attr('d', path);
        }
      //for tooltip
      var offsetL = document.getElementById('viz-6').offsetLeft+10;
      var offsetT = document.getElementById('viz-6').offsetTop+10;

      var path = d3.geo.path()
          .projection(projection1);

      var tooltip = d3.select("#viz-6")
           .append("div")
           .attr("class", "tooltip hidden");

      //need this for correct panning
      var g = svgNew.append("g");

    function highlight(data) {
        color.domain([0,1,2,3]); // setting the range of the input data

        // Load GeoJSON data and merge with states data
        d3.json("data/world_state_map.json", function(error, world) {
          console.log("j",data)
          // Grab State Name
        var newArray = [];
        data[0].map((item) => {
          newArray.push(item.name)
        })

        index = newArray.indexOf(name)
        console.log(newArray)
        console.log("json",world)
        var dataCountry =(data[0][index]) ?  data[0][index].country : "";
        var dataState = (data[0][index]) ? data[0][index].state: "";
        console.log("dataState",dataState)
        // Find the corresponding state inside the GeoJSON
        if(dataCountry === 'Mexico'){
          for (var j =0 ; j<world.objects.countries.geometries.length ; j++) {
            var jsonState = world.objects.countries.geometries[j].properties.name;
            if (dataCountry === jsonState) {
              world.objects.countries.geometries[j].properties.visited = true;
            }
            else{
                    world.objects.countries.geometries[j].properties.visited = false;
                }
          }
        }

        for (var j = 0; j < world.objects.states.geometries.length; j++)  {
          var jsonState = world.objects.states.geometries[j].properties.name;
          if (dataState == jsonState) {

          // Copy the data value into the JSON
          world.objects.states.geometries[j].properties.visited = true;

          // Stop looking through the JSON

          } else{
                  world.objects.states.geometries[j].properties.visited = false;
              }
        }

          g.append("g")
              .attr("class", "boundary")
            .selectAll("boundary")
              .data(topojson.feature(world, world.objects.countries).features)
              .enter().append("path")
              .attr("name", function(d) {return d.properties.name;})
              .attr("id", function(d) { return d.id;})
              .attr("d", path)
              .style("fill", function(d) {

              // Get data value
              var value = d.properties.visited;

              if (value) {
              //If value exists
              return color(3);
              } else {
              //If value is undefined
              return color(1);
              }
            });

              usa = d3.select('#USA');
              canada = d3.select('#CAN');
              //states
              g.append("g")
                  .attr("class", "boundary state hidden")
                .selectAll("boundary")
                  .data(topojson.feature(world, world.objects.states).features)
                  .enter().append("path")
                  .attr("name", function(d) { return d.properties.name;})
                  .attr("id", function(d) { return d.id;})
                  .attr("d", path)
                  .style("fill", function(d) {

                  // Get data value
                  var value = d.properties.visited;

                  if (value) {
                  //If value exists
                  return color(3);
                  } else {
                  //If value is undefined
                  return color(1);
                  }
                });

              states = d3.selectAll('.state');

        });

      }

      highlight(jsondata)


      function showTooltip(d) {
        label = d.properties.name;
        var mouse = d3.mouse(svgNew.node())
          .map( function(d) { return parseInt(d); } );
        tooltip.classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
          .html(label);
      }

      function selected() {
        d3.select('.selected').classed('selected', false);
        d3.select(this).classed('selected', true);
      }


      function zoomed() {
        var t = d3.event.translate;
        s = d3.event.scale;
        var h = 0;

        t[0] = Math.min(
          (width/height)  * (s - 1),
          Math.max( width * (1 - s), t[0] )
        );

        t[1] = Math.min(
          h * (s - 1) + h * s,
          Math.max(height  * (1 - s) - h * s, t[1])
        );

        zoomNew.translate(t);
        if(s === 1 && mouseClicked) {
          rotateMap(d3.mouse(this)[0])
          return;
        }

        g.attr("transform", "translate(" + t + ")scale(" + s + ")");

        //adjust the stroke width based on zoom level
        d3.selectAll(".boundary")
          .style("stroke-width", 1 / s);

        //toggle state/USA visability
        if(s > 1.5) {
          states
            .classed('hidden', false);
          usa
            .classed('hidden', true);
          canada
            .classed('hidden', true);
        } else {
        states
          .classed('hidden', true);
        usa
          .classed('hidden', false);
        canada
          .classed('hidden', false);
      }
    }

}
