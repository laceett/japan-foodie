
var prefecture_piechart = d3.select('div.prefectures_donut')
    .append('svg')
    .attr('width', svgWidth + margin.left + margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

prefecture_piechart
    .append("g")
    .attr("class", "arc");

// var tooltip = d3.select("div.tooltip_piecharts_donut")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0)
//     .style("background", "#ffad9e")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px")
//     .style("width", "260px")
//     .style("height", "70px")

create_pie_donut_prefecture("Tokyo")
create_pie_donut_prefecture("Tokyo")

function create_pie_donut_prefecture(selected_prefecture) {
    d3.csv("./plots/page_1/num_of_restaurant.csv", function (data) {
        let prefectureData = []
        var prefectureKeys = {}
        var otherCount = 0;

        // data processing

        var total = 24682060
        var other_count = 0

        data = data.sort((a, b) => (parseInt(a.Reviews.replace(/,/g, '')) < parseInt(b.Reviews.replace(/,/g, ''))) ? 1 : -1)
        console.log(data);

        for (var i = 0; i < data.length; i++) {
            var value = parseInt(data[i].Reviews.replace(/,/g, ''))

            if (i < 8) {
                percentage = value / total * 100
                prefectureKeys[data[i].Prefecture] = 1
                prefectureData.push({
                    "prefecture": data[i].Prefecture,
                    "reviews": value,
                    "percent": percentage.toFixed(2)
                });    
            }
            else {
                other_count += value;
            }
        }

        prefectureData.push({
            "prefecture": "Other",
            "reviews": other_count,
            "percent": (other_count / total * 100).toFixed(2)
        });

        console.log(prefectureData)

        var color = d3.scaleOrdinal(d3.schemePastel1)
            .domain(prefectureData)

        colorMap = {
            "Tokyo": "#7986db",
            "Osaka": "#9e79db",
            "Kanagawa": "#b9b8b8",
            "Aichi": "#ff9e6d",
            "Hokkaido": "#94d894",
            "Hyogo": "#ffe26d",
            "Kyoto": "#ffffcc",
            "Fukuoka": "#a77b64",
            "Other": "#fddaec",
        }
    
        var pie = d3.pie()
            .value(function (d) {
                return d.reviews;
            })

        radius = Math.min(svgWidth, (svgHeight - margin.top)) / 2;
        var arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.9)

        var arcs = prefecture_piechart.selectAll("arc")
            .data(pie(prefectureData))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                // console.log(selected_prefecture)
 
                if (d.data.prefecture == selected_prefecture) {
                    return "#ff5500"
                 }
                
                return colorMap[d.data.prefecture];
            })
            .attr("d", arc)
            .on("mouseover", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    // .style("fill", "#ff5500")
                tooltip_global.style("opacity", 1)
                tooltip_global
                    .html("Prefecture: " + d.data.prefecture + "<br>"
                        + "Num of Reviews: " + d.data.reviews + "<br>"
                        + "Percentage: " + d.data.percent + "%")
                    // .style('transform', `translate(${d3.mouse(this)[0] + 450}px, ${d3.mouse(this)[1] + 280}px)`)
                    .style('left', d3.event.pageX + 20 + 'px')
                    .style('top', d3.event.pageY + 'px')    
                    .style("height", "95px")
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    // .style("fill", function (d) {
                    //     return colorMap[d.data.prefecture];
                    // })
                    tooltip_global.style("opacity", 0)
            });
        
        prefecture_piechart.selectAll(".title").remove();

        prefecture_piechart.append("text")
            .attr("x", 0 - radius)
            .attr("y", 0 - radius)
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .attr("class", "title")
            .text("Top Prefectures for Number of Reviews - " + selected_prefecture);
            
        var legendRectSize = (radius * 0.06);
        var legendSpacing = radius * 0.05;
            
        var legend = prefecture_piechart.selectAll('.legend')
            .data(prefectureData)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -3 * legendRectSize;
                var vert = i * height - offset - 70;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d) { return colorMap[d.prefecture] })
            .style('stroke', function(d) { return colorMap[d.prefecture] });

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize)
            .style("font-size", 11.5)
            .text(function(d) { return d.prefecture; });

        });
}