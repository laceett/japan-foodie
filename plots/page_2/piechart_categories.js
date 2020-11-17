create_pie_catagory("./plots/page_2/japan_restaurant_category.csv", "Top Prefectures for Number of Restaurants")

function create_pie_catagory(data_file, title) {
    d3.csv(data_file, function (data) {
        let categoryData = []
        var otherCount = 0;

        // data processing
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (i < 8) {
                categoryData.push(data[i])
            }
            else {
                otherCount += parseFloat(data[i].RestaurantCount)
            }
        }

        // categoryData.push({"Category": "Other", "RestaurantCount": otherCount});
        console.log(categoryData)

        // draw bar chart
        const margin = {
            top: 30,
            bottom: 20,
            left: 0,
            right: 0,
        }
        var svgWidth = 400;
        var svgHeight = 400;
        var radius = Math.min(svgWidth, svgHeight) / 2 - margin.top

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
            .style("background", "lightsteelblue")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("width", "200px")
            .style("height", "35px")


        var color = d3.scaleOrdinal()
            .domain(categoryData)
            .range(["#92a8d1", "#f7cac9", "#b1cbbb", "#b8a9c9", "#878f99", "#f18973", "#b7d7e8", "#ffef96"])
            // .range(d3.schemeSet2);

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
                        .html("Num of Restaurants: " + d.data.RestaurantCount)
                        .style('transform', `translate(${d3.mouse(this)[0]+150}px, ${d3.mouse(this)[1]+250}px)`)
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
            .attr("y", 0 - (margin.top * 6))
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
            .style("font-size", 12)                    
    });
}