create_pie_catagory("./plots/page_2/japan_restaurant_category.csv", "Top Categories for Number of Restaurants")

function create_pie_catagory(data_file, title) {
    d3.csv(data_file, function (data) {
        let categoryData = []
        var otherCount = 0;
        var total = 0;

        for (var i = 0; i < data.length; i++) {
            if (i < 8) {
                total += parseInt(data[i].RestaurantCount)
            }
            else {
                break
            }
        }

        // data processing
        console.log(data);
        console.log(total);

        for (var i = 0; i < data.length; i++) {
            if (i < 8) {
                // categoryData.push(data[i])
                percentage = data[i].RestaurantCount / total * 100

                categoryData.push({
                        Category: data[i].Category,
                        RestaurantCount: data[i].RestaurantCount,
                        Percent: percentage.toFixed(2)
                    })
            }
            else {
                otherCount += parseFloat(data[i].RestaurantCount)
            }
        }

        console.log(categoryData)

        // draw pie chart
        const margin = {
            top: 30,
            bottom: 20,
            left: 0,
            right: 0,
        }
        var svgWidth = 400;
        var svgHeight = 500;
        var radius = Math.min(svgWidth, svgHeight) / 2 - margin.top + 30

        var svg = d3.select('div.categories')
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
            .style("height", "70px")

        var color = d3.scaleOrdinal()
            .domain(categoryData)
            .range(["#fbb4ae", "#b3cde3", "#decbe4", "#ccebc5", "#fed9a6", "#ffffcc", "#fddaec", "#e5d8bd", "#f2f2f2"])

        var pie = d3.pie()
            .value(function (d) {
                return d.RestaurantCount;
            })

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        var arcs = chart.selectAll("arc")
            .data(pie(categoryData))
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
                    .html("Num of Restaurants: " + d.data.RestaurantCount
                        + "<br>" + "Percentage: " + d.data.Percent + "%")
                    .style('transform', `translate(${d3.mouse(this)[0] + 250}px, ${d3.mouse(this)[1] + 200}px)`)
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
            .data(pie(categoryData))
            .enter()
            .append("text")
            .text(function (d) {
                // console.log(d)
                return d.data.Category
            })
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .style("text-anchor", "middle")
            .style("font-size", 11.5)
    });
}