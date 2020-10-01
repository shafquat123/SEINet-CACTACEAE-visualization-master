var SpiderChart = {
    draw: function(id, d, options){
        var jsondata = d;
        var cfg = {
            radius: 6,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 100,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: -20,
            TranslateY: 50,
            ExtraWidthX: 0,
            ExtraWidthY: 0,
            color: "#6F257F"
        };

        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    cfg[i] = options[i];
                }
            }
        }

        var parwidth = cfg.w;
        cfg.w = 300;

        var allAxis = (d[0].map(function(i, j){return i.name}));
        var total = allAxis.length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();
        renderMap(jsondata);

        var g = d3.select(id)
            .append("svg")
            .attr("width", parwidth)
            .attr("height", cfg.h + 100)
            .append("g")
            .attr("transform", "translate(" + (parwidth/4 - 20) + "," + cfg.TranslateY + ")");

        var tooltip = d3.select("#viz-5")
                        .append("div")
                        .attr("class", "tooltip row")
                        .style("float", "left")
                        .style("margin-left", "50px")
                        .style("opacity", 0);

        for(var j=0; j<cfg.levels; j++) {
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

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){
                return cfg.w/2*(1 - cfg.factor*Math.sin(i * cfg.radians/total));})
            .attr("y2", function(d, i){return cfg.h/2*(1 - cfg.factor*Math.cos(i * cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.35")
            .style("stroke-width", "1px");

        axis.append("image").attr("href","icons/cactus.png").attr("height",27).attr("width",27).attr("x", cfg.w/2 - 13).attr("y",cfg.h/2 - 12)

        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "1rem")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -15)"})
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

        var wd = 200,
            ht = 135,
            twoPi = 2 * Math.PI,
            progress = 0,
            formatPercent = d3.format(".0%");

        var arc = d3.svg.arc()
            .startAngle(0)
            .innerRadius(42)
            .outerRadius(56);

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
            .attr("data-id", function(j){ return j.imgname})
            .style("fill", "#fff")
            .style("stroke-width", "2px")
            .style("stroke", cfg.color)
            .style("fill-opacity", .9)
            .on("mouseover", function(j, i) {
                renderMap(jsondata, j.name);
                var imgstring = "<div class='img-div'> <img src=" + "images/" + j.imgname + ".jpg /></div>";
                var name = "<div class='tt-text'> <b> Scientific name: </b>" + j.name + "</div>";
                var genus = "<div class='tt-text'>  <b> Genus: </b>" + j.genus + "</div>";
                var location = "<div class='tt-text'>  <b> Location: </b>" + j.county + ", " + j.state + ", " + j.country + "</div>";

                var details = "<div class='tt-text-div'>" + name + genus + location + "</div>"
                var svgMap = "<div id='svg'></div>"
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip
                    .html(imgstring + details + svgMap)
                    .style("left", cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)) + 150 + "px")
                    .style("top", "20px")

                var simx = cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)) + 150;
                var simy = 220

                var svg = d3.select("#svg").append("svg")
                    .attr("width", wd)
                    .attr("height", ht)
                    .append("g")
                    .attr("transform", "translate(" + 115 + "," + 65 + ")");

                var meter = svg.append("g")
                    .attr("class", "funds-allocated-meter");

                meter.append("path")
                    .attr("class", "background")
                    .attr("d", arc.endAngle(twoPi));

                    var foreground = meter.append("path")
                    .attr("class", "foreground");

                    var percentComplete = meter.append("text")
                                            .attr("text-anchor", "middle")
                                            .attr("class", "percent-complete")
                                            .attr("dy", "0em");

                    var description = meter.append("text")
                                        .attr("text-anchor", "middle")
                                        .attr("class", "description")
                                        .attr("dy", "2.3em")
                                        .text("Similarity");

                    var i = d3.interpolate(progress, (0.01 * j.similarity));

                    d3.transition()
                        .duration(1000)
                        .tween("progress", function() {
                            return function(t) {
                                progress = i(t);
                                foreground.attr("d", arc.endAngle(twoPi * progress));
                                percentComplete.text(formatPercent(progress));
                            };
                        });


            })
            .on("mouseout", function(j, i) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            //.on('click', function(d){renderMap(d.name)})
            .text(function(j){return Math.max(j.value, 0)})

        });

    }

}
