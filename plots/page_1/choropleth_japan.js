// Reference
// https://observablehq.com/@d3/choropleth
// https://d3-legend.susielu.com/

var tooltip_global = d3.select('body') 
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("background", "#ffad9e")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", "200px")
    .style("height", "70px")

var prefecture_keys = ["Tokyo", "Osaka", "Kanagawa", "Aichi", "Hokkaido", "Hyogo", "Kyoto","Fukuoka"]

d3.csv("./plots/page_1/num_of_restaurant.csv", function (data) {
d3.json("./plots/page_1/japan.json", function (error, jp) {
d3.json("./plots/page_1/japan_restaurant_category.csv", function (error, category) {

    var margin = { top: 25, bottom: 0, left: 0, right: 0 }
    var svgWidth = 800;
    var svgHeight = 800;
    var lon = -138.0;
    var lat = 37;

    var projection = d3.geoAlbers()
        .center([0, lat])
        .rotate([lon, 0])
        .parallels([23, 46])
        .scale(2500).translate([svgWidth / 2, svgHeight / 2]);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select('div.overview')
        .append('svg')
        .attr('width', svgWidth + margin.left + margin.right)
        .attr('height', svgHeight + margin.top + margin.bottom)

    var prefectureMap = new Map();

    console.log(data)

    for (var i = 0; i < data.length; i++) {
        var value = parseInt(data[i]['Stores'].replace(/,/g, ''))
        prefectureMap[data[i]['Prefecture']] = value
    }

    console.log(prefectureMap)

    var colorfn = d3.scaleSequential(d3.interpolateYlGnBu)
        .domain([-7000, 130000])

    svg.append("g")
        .attr("class", "legendLinear")
        .attr('font-size', '10px')
        .attr('transform', 'translate(20,0)')

    var legendLinear = d3.legendColor()
        .shapeWidth(50)
        .cells([3000, 32500, 65000, 97500, 130000])
        .orient('horizontal')
        .scale(colorfn);

    svg.select(".legendLinear")
        .call(legendLinear);

    // var Tooltip = d3.select("div.tooltip_choropleth")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0)
    //     .style("background", "#FFFF00")
    //     .style("border", "solid")
    //     .style("border-width", "2px")
    //     .style("border-radius", "5px")
    //     .style("padding", "5px")
    //     .style("width", "200px")
    //     .style("height", "70px")

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(jp, jp.objects.japan).features)
        .enter()
        .append("path")
        .style("fill", function (d) {
            return colorfn(prefectureMap[d.properties.NAME_1])
        })
        .attr("d", path)
        .on("mouseover", function (d, i) {
            d3.select(this).interrupt();
            d3.select(this)
                .style("fill", "#ff5500")
            tooltip_global
                .html("Prefecture: " + d.properties.NAME_1 + "<br>" + "Restaurants: " + prefectureMap[d.properties.NAME_1])
                // .style('transform', `translate(${d3.mouse(this)[0] + 180}px, ${d3.mouse(this)[1] + 120}px)`)
                .style('left', d3.event.pageX + 50 + 'px')
                .style('top', d3.event.pageY + 'px')
                .style("height", "70px")
                .style("opacity", 1)

        })
        .on("mouseout", function (d, i) {
            d3.select(this).interrupt();
            d3.select(this)
                .style("fill", function (d) {
                    return colorfn(prefectureMap[d.properties.NAME_1])
                })
                tooltip_global.style("opacity", 0)
        })
        .on("click", function (d, i) {

            prefecture = "Other"
            if (prefecture_keys.indexOf(d.properties.NAME_1) >= 0) {
                prefecture = d.properties.NAME_1
            }
            create_pie_donut_catagory(prefecture)
            create_pie_donut_catagory(prefecture)
            create_pie_donut_prefecture(prefecture)
        });

    svg.append("path")
        .datum(topojson.mesh(jp, jp.objects.japan, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
});
});
});