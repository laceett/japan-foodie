create_pie_prefecture("./plots/page_2/num_of_restaurant.csv", "Top Prefectures for Number of Reviews",)

function create_pie_prefecture(data_file, title) {
    d3.csv(data_file, function (data) {
        let prefectureData = []
        var otherCount = 0;

        // data processing
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var value = parseInt(data[i].Reviews.replace(/,/g, ''))

            if (i < 5) {
                prefectureData.push({
                    "prefecture": data[i].Prefecture,
                    "reviews": value
                });
            }
        }

        // prefectureData.push({"prefecture": "Other", "stores": otherCount});
        console.log(prefectureData)

        // draw pie chart
        const margin = {
            top: 30,
            bottom: 20,
            left: 0,
            right: 0
        }
        var svgWidth = 400;
        var svgHeight = 500;
        var radius = Math.min(svgWidth, svgHeight) / 2 - margin.top + 30

        var svg = d3.select('div.prefectures')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

        var tooltip = d3.select("div.tooltip_piecharts")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background", "#FFFF00")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("width", "230px")
            .style("height", "40px")

        var color = d3.scaleOrdinal()
            .domain(prefectureData)
            .range(["#b3cde3", "#ffffcc", "#f2f2f2", "#ccebc5", "#fddaec"])

        var pie = d3.pie()
            .value(function (d) {
                return d.reviews;
            })

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        var arcs = chart.selectAll("arc")
            .data(pie(prefectureData))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc)
            .on("mouseover", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", "#ff5500")
                tooltip.style("opacity", 1)
                tooltip
                    .html("Num of Reviews: " + d.data.reviews)
                    .style('transform', `translate(${d3.mouse(this)[0] + 450}px, ${d3.mouse(this)[1] + 280}px)`)
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        return color(i)
                    })
                tooltip.style("opacity", 0)
            });

        chart.append("text")
            .attr("x", 0 - (margin.top * 5))
            .attr("y", 0 - (margin.top * 6) - 40)
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);

        chart.selectAll("arc")
            .data(pie(prefectureData))
            .enter()
            .append("text")
            .text(function (d) {
                return d.data.prefecture
            })
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .style("font-size", 11.5)
    });
}