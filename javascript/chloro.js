function chloro () {
var width = window.innerWidth, height = window.innerHeight;
var color_domain = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]
var ext_color_domain = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200]
var legend_labels = ["< 5", "10+", "20+", "30+", "40+", "50+", "60+", "70+", "80+", "90+", "100+", "120+", "130+"]
var color = d3.scale.threshold()

.domain(color_domain)
.range(["#dcdcdc", "#B2D8A0", "#54B663", "#41AD63", "#2FA466", "#1D9A6C", "#18875E", "#137451", "#0F6143", "#0B4D35", "#0B4D35", "#083927", "#052418"]);



var svg = d3.select("#viz-1").append("svg")
.attr("width", "100%")
.attr("height", height)
.style("padding-left","15%")
.style("padding-top","10%")
.attr("class", "chloro_svg");
var path = d3.geo.path()

var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

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



   d3.csv("data/countyData.csv", function(data){
       d3.json("data/us.json", function(json){

           var newArray = [];
           data.map(function(d){
           newArray.push(d.county)
           })

           svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("stroke", "#fff")
           .style("stroke-width", "1")
           .style("fill", function(d){
               var Cname = d.properties.NAME;

               //console.log(newArray)
               index = newArray.indexOf(Cname)
               // console.log(newArray[0])
               // console.log(d.properties.NAME)
               // console.log(index)
               if (index >= 0){
                   var value = data[index].count;
                   return color (value);
               } else{
                   return color (0)

               }

           })
           .on("mouseover", function(d) {
               var sel = d3.select(this);
               sel.moveToFront();
               d3.select(this).transition().duration(300).style({'opacity': 1, 'stroke': 'black', 'stroke-width': 1.5});
               div.transition().duration(300)
               .style("opacity", 1)
               var Cname = d.properties.NAME;
               index = newArray.indexOf(Cname)
               if (index >=0 ){
                   div.text(Cname + ": " + data[index].count)
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY -30) + "px");
               }else{
                   div.text(Cname + ": 0")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY -30) + "px");
               }

           })
           .on("mouseout", function() {
               var sel = d3.select(this);
               sel.moveToBack();
               d3.select(this)
               .transition().duration(300)
               .style({'opacity': 0.8, 'stroke': 'white', 'stroke-width': 1});
               div.transition().duration(300)
               .style("opacity", 0);
       })

       })
   })

var legend = svg.selectAll("g.legend")
.data(color_domain)
.enter().append("g")
.attr("class", "legend");

var ls_w = 73, ls_h = 20; //legend width and height

legend.append("rect")
.attr("x", function(d, i){ return width*0.65 - (i*ls_w) - ls_w;})//this needs to change in final code
.attr("y", 550)
.attr("width", ls_w)
.attr("height", ls_h)
.style("fill", function(d, i) { return color(d); })
.style("opacity", 0.8);

legend.append("text")
.attr("x", function(d, i){ return width*0.67  - (i*ls_w) - ls_w;})//this too
.attr("y", 590)
.text(function(d, i){ return legend_labels[i]; });

}
chloro();
