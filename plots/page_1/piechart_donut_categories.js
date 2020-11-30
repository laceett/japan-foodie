
// draw pie chart
var margin = {
    top: 50,
    bottom: 20,
    left: 0,
    right: 0,
}

var svgWidth = 400
var svgHeight = 400;
// var radius = Math.min(svgWidth, svgHeight) / 2 - margin.top + 30

var categories_piechart = d3.select('div.categories_donut')
    .append('svg')
    .attr('width', svgWidth + margin.left + margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

categories_piechart
    .append("g")
    .attr("class", "slices");
// categories_piechart
//     .append("g")
// 	.attr("class", "label");
// categories_piechart
//     .append("g")
// 	.attr("class", "lines");

var categories_tooltip = d3.select("div.tooltip_piecharts_categories_donut")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background", "#FFFF00")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", "230px")
    .style("height", "70px")

create_pie_donut_catagory('Tokyo')
create_pie_donut_catagory('Tokyo')

function create_pie_donut_catagory(selected_prefecture) {
    d3.csv("./plots/page_1/japan_restaurant_category.csv", function (data) {
        let categoryDataRaw = []
        let categoryData = []

        var total = 0;
        var display_count = 6

        // data processing
        console.log(data);
        console.log(total);

        for (var i = 0; i < data.length; i++) {

            if (data[i].Prefecture == selected_prefecture) {
                categoryDataRaw.push(data[i])
                total += parseInt(data[i].RestaurantCount.replace(/,/g, ''))
            }
        }

        for (var i = 0; i < categoryDataRaw.length; i++) {

            if (i < display_count) {
                resCount = parseInt(categoryDataRaw[i].RestaurantCount.replace(/,/g, ''))
                percentage = resCount / total * 100

                categoryData.push({
                    Category: categoryDataRaw[i].Category,
                    RestaurantCount: resCount,
                    Percent: percentage.toFixed(2)
                })
            }

        }
        console.log(categoryData)

        var color = d3.scaleOrdinal(d3.schemePastel2)
            .domain(categoryData)
            // .range(d3.category20().range());

        // var color = d3.scaleOrdinal()
        //     .domain(categoryData)
        //     .range(["#fbb4ae", "#b3cde3", "#decbe4", "#ccebc5", "#fed9a6", "#ffffcc", "#fddaec", "#e5d8bd", "#f2f2f2"])
        colorMap = {
            "Izakaya": "#fbb4ae",
            "Cafe": "#a3d76e",
            "Bar": "#D8BFD8",
            "Tempura": "#ffcc00",
            "Yakitori": "#b3cde3",
            "Ramen": "#ccebc5",
            "Sushi": "#ffffcc",
            "Seafood": "#fddaec",
            "BBQ": "#f2f2f2",
            "Udon": "#f13f84",
        }

        var pie = d3.pie()
            .value(function (d) {
                return d.RestaurantCount;
            })

        radius = Math.min(svgWidth, (svgHeight - margin.top)) / 2;
        var arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.9)
        
        var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

    var slice = categories_piechart.select(".slices").selectAll("path.slice")
        .data(pie(categoryData), function(d){ return d.data.Category });

        slice.enter()
        .insert("path")
        .style("fill", function(d) { return colorMap[d.data.Category]; })
        .attr("class", "slice");

        slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
        slice
        .on("mousemove", function(d){
            // div.style("left", d3.event.pageX+10+"px");
            // div.style("top", d3.event.pageY-25+"px");
            // div.style("display", "inline-block");
            // div.html((d.data.label) + "<br>" + (d.data.value) + "%");
            
            d3.select(this).interrupt();
            // d3.select(this)
            //     .style("fill", "#ff5500")
            tooltip_global.style("opacity", 1)
            tooltip_global
            .html("Category: " + d.data.Category + "<br>"
                + "Num of Stores: " + d.data.RestaurantCount
                + "<br>" + "Percentage: " + d.data.Percent + "%")
                .style('left', d3.event.pageX + 20 + 'px')
                .style('top', d3.event.pageY + 'px')    
                .style("height", "95px")
                .style("opacity", 1)

        });
        slice
        .on("mouseout", function(d){
            // div.style("display", "none");
            d3.select(this).interrupt();
            d3.select(this)
                // .style("fill", function (d) {
                //     return colorMap[d.data.prefecture];
                // })
                tooltip_global.style("opacity", 0)
        });

        slice.exit()
            .remove();
    
    categories_piechart.selectAll(".title").remove();

    categories_piechart.append("text")
        .attr("x", 0 - radius)
        .attr("y", 0 - radius)
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("class", "title")
        .text(" Top Restaurant Categories for " + selected_prefecture);


    var legendRectSize = (radius * 0.06);
    var legendSpacing = radius * 0.05;
    
    categories_piechart.selectAll(".legend").remove();

    var legend = categories_piechart.selectAll('.legend')
        .data(pie(categoryData), function (d) {
            return d.data.Category
        })
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset - 40;
            return 'translate(' + horz + ',' + vert + ')';
        })
        // .transition().duration(1000)

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function(d) { return colorMap[d.data.Category] })
        .style('stroke', function(d) { return colorMap[d.data.Category] });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize)
        .style("font-size", 11.5)
        .text(function(d) { return d.data.Category; });

        
        // /* TEXT */

        // var text = categories_piechart
        //     .select(".label")
        //     .selectAll("text")
        //     .data(pie(categoryData), function (d) {
        //         return d.data.Category
        //     });

        // text.enter()
        //     .append("text")
        //     .attr("dy", ".35em")
        //     .style("font-size", 10.5)
        //     .text(function(d) {
        //         return (d.data.Category+": "+d.data.RestaurantCount);
        //     });

        // function midAngle(d){
        //     return d.startAngle + (d.endAngle - d.startAngle)/2;
        // }

        // text
        // .transition().duration(1000)
        // .attrTween("transform", function(d) {
        //     this._current = this._current || d;
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function(t) {
        //         var d2 = interpolate(t);
        //         var pos = outerArc.centroid(d2);
        //         pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        //         // console.log(pos)
        //         return "translate("+ pos +")";
        //     };
        // })
        // .styleTween("text-anchor", function(d){
        //     this._current = this._current || d;
        //     // console.log(this._current)
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function(t) {
        //         var d2 = interpolate(t);
        //         return midAngle(d2) < Math.PI ? "start":"end";
        //     };
        // })
        // .text(function(d) {
        //     return (d.data.Category+": "+d.data.RestaurantCount);
        // });


        // text.exit()
        //     .remove();
        
        // /* LINES */

        // var polyline = categories_piechart.select(".lines").selectAll("polyline")
        // .data(pie(categoryData), function(d){ return d.data.Category });

        // // opacity: .3;
        // // stroke: black;
        // // stroke-width: 2px;
        // // fill: none;
    
        // polyline.enter()
        //     .append("polyline")
        //     .style("opacity-size", 0.3)
        //     .style("stroke", "black")
        //     .style("stroke-width", "1px")
        //     .style("fill", "none")

        // polyline.transition().duration(1000)
        // .attrTween("points", function(d){
        //     this._current = this._current || d;
        //     var interpolate = d3.interpolate(this._current, d);
        //     this._current = interpolate(0);
        //     return function(t) {
        //         var d2 = interpolate(t);
        //         var pos = outerArc.centroid(d2);
        //         pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        //         return [arc.centroid(d2), outerArc.centroid(d2), pos];
        //     };
        // });

        // polyline.exit()
        // .remove();

    });
}