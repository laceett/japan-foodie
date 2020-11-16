// Reference
// https://observablehq.com/@d3/choropleth
// https://d3-legend.susielu.com/


d3.csv("./plots/page_1/num_of_restaurant.csv", function (data) {
            d3.json("./plots/page_1/japan.json", function (error, jp) {
        
    const margin = {top: 50, bottom: 25, left: 50, right: 50}
    var svgWidth = 1000;
    var svgHeight = 800;
    var lon = -138.0;
    var lat = 36;
    
    var projection = d3.geoAlbers()
    .center([0, lat])
    .rotate([lon, 0])
    .parallels([23, 46])
    .scale(1700).translate([svgWidth / 2, svgHeight / 2]);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select('div.overview')
        .append('svg')
        .attr('width', svgWidth + margin.left + margin.right)
        .attr('height', svgHeight + margin.top + margin.bottom)

    var prefectureMap = new Map();

    console.log(data)

    for(var i = 0; i < data.length; i++) {
        var value = parseInt(data[i]['Stores'].replace(/,/g, ''))
        prefectureMap[data[i]['Prefecture']] = value
    }

    console.log(prefectureMap)

    var colorfn = d3.scaleSequential(d3.interpolatePuBu).domain([0, 130000])

    svg.append("g")
      .attr("class", "legendLinear")
      .attr('font-size', '8px')
      .attr('transform', 'translate(20,0)')
    
    var legendLinear = d3.legendColor()
      .shapeWidth(50)
      .cells([0, 32500, 65000, 97500, 130000])
      .orient('horizontal')
      .scale(colorfn);
    
    svg.select(".legendLinear")
      .call(legendLinear);

      var Tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background", "lightsteelblue")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("width", "200px")
        .style("height", "35px")

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(jp, jp.objects.japan).features)
        .enter()
        .append("path")
        .style("fill", function(d) {
            return colorfn(prefectureMap[d.properties.NAME_1])
        })
        .attr("d", path)
        .on("mouseover", function(d,i) {
                d3.select(this).interrupt();
                d3.select(this)
                .style("fill", "#ff5500")
                Tooltip.style("opacity", 1)
                Tooltip
                    .html("Prefecture: " + d.properties.NAME_1 + "<br>" + "Store Count: " + prefectureMap[d.properties.NAME_1])
                    .style('transform', `translate(${d3.mouse(this)[0]+10}px, ${d3.mouse(this)[1]-950}px)`)
                    .style("opacity", 1)


            })
        .on("mouseout", function(d,i) {
            d3.select(this).interrupt();
            d3.select(this)
            .style("fill", function(d) {
                return colorfn(prefectureMap[d.properties.NAME_1])
            })
            Tooltip.style("opacity", 0)
        });

    svg.append("path")
        .datum(topojson.mesh(jp, jp.objects.japan, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    });
});