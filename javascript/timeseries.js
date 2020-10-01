function timeseries() {
var margin = {top: 20, right: 150, bottom: 40, left: 35};

var widther = window.innerWidth;

var width = widther - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//Parses date for correct time format
var parseDate = d3.time.format("%Y").parse;

//Divides date for tooltip placement
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

//Appends the svg to the chart-container div
var svg = d3.select(".g-chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Creates the xScale
var xScale = d3.time.scale()
  .range([0, width]);

//Creates the yScale
var yScale = d3.scale.linear()
  .range([height, 0]);

//Defines the y axis styles
var yAxis = d3.svg.axis()
  .scale(yScale)
  .tickSize(-width)
  .tickPadding(8)
  .orient("left");

//Defines the y axis styles
var xAxis = d3.svg.axis()
  .scale(xScale)
  .tickPadding(8)
  .orient("bottom")
  .tickSize(height)
  .ticks(numTicks(width))
  .tickFormat(d3.time.format("%Y"));

//line function convention (feeds an array)
var line = d3.svg.line()
  .x(function(d) { return xScale(d.date); })
  .y(function(d) { return yScale(d.num); });

//Loads the data
d3.csv("data/yearcount.csv", ready);

function ready(err, data) {

  if (err) throw "error loading data";
  console.log("hello");

  //FORMAT data
  data.forEach(function(d) {
    d.num = +d.count;
    d.date = parseDate(d.year);
  });

  console.log(data);

  data.sort(function(a,b) { return a.date - b.date; });

  //Defines the xScale max
  xScale.domain(d3.extent(data, function(d) { return d.date; }));

  //Defines the yScale max
  yScale.domain(d3.extent(data, function(d) { return d.num; }));

  //Appends the y axis
  var yAxisGroup = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  //Appends the x axis
  var xAxisGroup = svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

  //Binds the data to the line
  var drawline = svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  //Tooltips
  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  //Adds circle to focus point on line
  focus.append("circle")
      .attr("r", 10);

  //Adds text to focus point on line
  focus.append("text")
      .attr("x", 9)
      .attr("y", -30)
      .attr("dy", ".35em")
      .style("background-color","#ffffff")
      .style("padding","10px")
      .style("border","2px solid");

  //Creates larger area for tooltip
  var overlay = svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() {
        focus.style("display", "none");
        div.transition().duration(300)
        .style("opacity", 0);
    })
      .on("mousemove", mousemove);

  //Tooltip mouseovers
  function mousemove() {
    var x0 = xScale.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.num) + ")");
    //focus.select("text").text("Year: "+d.year+","+"No of Occurences: "+d.num);
    div.transition().duration(300)
    .style("opacity", 1)
    div.html("<div><b>Year:</b> "+d.year+"</div><div><b>"+"No of plants discovered: </b>"+d.num + "</div")
    .style("left",function(){
              if((d3.event.pageX)+340 > window.innerWidth){
                  return (d3.event.pageX)-250 + "px";
              }else{
                  return (d3.event.pageX)+20 + "px";
              }
          })
    .style("top", (d3.event.pageY -30) + "px");
  };


  //RESPONSIVENESS
  d3.select(window).on("resize", resized);

  function resized() {

    //new margin
    var newMargin = {top: 10, right: 80, bottom: 20, left: 50};

    //Get the width of the window
    var w = d3.select(".g-chart").node().clientWidth;
    console.log("resized", w);

    //Change the width of the svg
    d3.select("svg")
      .attr("width", w);

    //Change the xScale
    xScale
      .range([0, w - newMargin.right]);

    //Update the line
    line = d3.svg.line()
      .x(function(d) { return xScale(d.date); })
      .y(function(d) { return yScale(d.num); });

    d3.selectAll('.line')
      .attr("d", line);


    //Updates xAxis
    xAxisGroup
      .call(xAxis);

    //Updates ticks
    xAxis
      .scale(xScale)
      .ticks(numTicks(w));

    //Updates yAxis
    yAxis
      .tickSize(-w - newMargin.right)
  };

}

//Determines number of ticks base on width
function numTicks(widther) {
  if (widther <= 900) {
    return 4
    console.log("return 4")
  }
  else {
    return 12
    console.log("return 5")
  }
}
}
timeseries();
