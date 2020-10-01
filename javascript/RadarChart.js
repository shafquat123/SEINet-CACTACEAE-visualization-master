var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 6,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 97,
     TranslateY: 80,
     ExtraWidthX: 100,
     ExtraWidthY: 160,
     color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
    };

    console.log(width);
	
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }

    console.log(d);

    
    cfg.maxValue = 100;
    
    var allAxis = (d[0].map(function(i, j){return i.area}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    renderInfo(allAxis[0]);

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w)
        .attr("height", cfg.h)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

		var tooltip;
	
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.35")
       .style("stroke-width", "1px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    // for(var j=0; j<cfg.levels; j++){
    //   var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
    //   g.selectAll(".levels")
    //    .data([1]) //dummy data
    //    .enter()
    //    .append("svg:text")
    //    .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
    //    .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
    //    .attr("class", "legend")
    //    .style("font-family", "sans-serif")
    //    .style("font-size", "10px")
    //    .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
    //    .attr("fill", "#737373")
    //    .text((j+1)*100/cfg.levels);
    // }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "0.35")
      .style("stroke-width", "1px");
    var centerx = cfg.x/2 - 2;
    centery = cfg.h/2 - 2;
    axis.append("image").attr("href","icons/cactus.png").attr("height",27).attr("width",27).attr("x", cfg.w/2 - 13).attr("y",cfg.h/2 - 12)

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "13px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      
    });
    series=0;


    d.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0)})
      .attr("cx", function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
      return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
      .attr("cy", function(j, i){
        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
      })
      .attr("data-id", function(j){return j.area})
      .style("fill", "#fff")
      .style("stroke-width", "2px")
      .style("stroke", cfg.color(series)).style("fill-opacity", .9)
      .on('mouseover', function (d){
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 5;

            tooltip
              .attr('x', newX)
              .attr('y', newY)
              .text(Format(d.value))
              .transition(50)
              .style('opacity', 1)})

      .on('click', function(d){renderInfo(d.area)})  
      .append("svg:title")
      .text(function(j){return Math.max(j.value, 0)})
    
    });
    }
};

function renderInfo(name){

  d3.select(".details").remove();
  d3.select(".map").remove();

    var info = d3.select('body')
    .append('svg')
    .attr('height', 400)
    .attr('width', 800)
    .attr("class", "details")
    .attr("x", 800)
    .attr("y", 300)
    .attr("transform", "translate(600,100)")
    .append("g")
    .attr("transform", "translate(30,30)");

    info.append("text")
    .style("font-family", "sans-serif")
    .style("font-size", "30px")
    .attr("x", "47%")
    //.attr("y", 70)
    .attr("text-anchor", "middle")
    .text("Description");

    info.append("image").attr("href","images/"+name+".jpg").attr("height",250).attr("width",300).attr("x", 10).attr("y", 20)
    .attr("max-width", "100%")
    .attr("max-height", "100%");

    d3.csv('data/Sample.csv', function(data){
      
      
      var filteredData = data.filter(function(d){
        return (d.scientific.indexOf(name) === name); // does it start with the string?
      });
      var newArray = [];
      data.map(function(d){
        newArray.push(d.scientific)

      })

      index = newArray.indexOf(name)
      console.log(index)

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 50)
      .text("Scientific name : "+name);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 80)
      .text("Kingdom : "+data[index].Kingdom);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 110)
      .text("Phylum : "+ data[index].phylum);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 140)
      .text("Order : "+ data[index].order);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 170)
      .text("Family : "+ data[index].family);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 200)
      .text("Country : "+ data[index].country);

      info.append("text")
      .style("font-family", "sans-serif")
      .style("font-size", "20px")
      .attr("x", "41%")
      .attr("y", 230)
      .text("State : "+ data[index].state);

    });


var width = 790;
var height = 380;

// D3 Projection
var path = d3.geoPath();
var projection = d3.geoMercator()
				   .translate([width/2 - 50, height/2 + 37])    // translate to center of screen
				   .scale([100]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","#7CB342","rgb(84,36,55)","rgb(217,91,67)"]);


//Create SVG element and append map to the SVG
var svg = d3.select("viz-6")
			.append("svg")
			.attr("width", width)
      .attr("height", height)
      .attr("class", "map")
      .attr("transform", "translate(0,100)");
        
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
        .style("opacity", 0);
        
  
d3.csv("data/Sample.csv", function(data) {
  color.domain([0,1,2,3]); // setting the range of the input data

  // Load GeoJSON data and merge with states data
  d3.json("data/worldmap.json", function(json) {
    
    // Grab State Name
  var newArray = [];
    data.map(function(d){
    newArray.push(d.scientific)

    })
          
  index = newArray.indexOf(name)
  console.log(newArray)
  var dataCountry = data[index].country;
          
  // Find the corresponding state inside the GeoJSON
  for (var j = 0; j < json.features.length; j++)  {
    var jsonState = json.features[j].properties.name;

    if (dataCountry == jsonState) {

    // Copy the data value into the JSON
    json.features[j].properties.visited = true; 

    // Stop looking through the JSON
    
    } else{
            json.features[j].properties.visited = false;
        }
  }
              
    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
        .on("mouseover", function(d) {      
          div.transition()        
                .duration(100)      
                .style("opacity", .9);      
                div.text(d.properties.name)
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
      })   
    
        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        })
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
               
  });
          
  })

};