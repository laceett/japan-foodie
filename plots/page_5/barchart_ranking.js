create_pie_catagory("./plots/page_5/top_sushi_ramen_tokyo.csv", "div.ranking", "div.tooltip_ranking", [3.8, 4.9])
create_pie_catagory("./plots/page_5/top_sushi_ramen_kyoto.csv", "div.ranking_kyoto", "div.tooltip_ranking_kyoto", [3.6, 4.3])

function create_pie_catagory(data_file, div, tooltipdiv, range) {
    d3.csv(data_file, function (data) {

        console.log(data)

        data = data.sort((a, b) => (a.rating < b.rating) ? 1 : -1)

        const margin = {
            top: 50,
            bottom: 50,
            left: 150,
            right: 20,
        }
        var svgWidth = 800;
        var svgHeight = 700;

        var svg = d3.select(div)
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var x = d3.scaleLinear()
            .domain(range)
            .range([0, svgWidth]);

        var y = d3.scaleBand()
            .rangeRound([margin.top, svgHeight - margin.bottom])
            .domain(data.map(function (d) { return d.name; }))
            .padding(0.1)

        x_axis = d3.axisTop().scale(x);
        y_axis = d3.axisLeft().scale(y);
        chart.append('g')
            .attr("transform", `translate(0,${margin.top})`)
            .call(x_axis);

        chart.append('g')
            // .attr("transform", `translate(${margin.left},0)`)
            .call(y_axis);


        // var colorFn = d3.scaleSequential()
        // .interpolator(d3.interpolateViridis)
        //     .domain([1, 2000])
        // .range(["#92a8d1", "#f7cac9", "#b1cbbb", "#b8a9c9", "#878f99", "#f18973", "#b7d7e8", "#ffef96"])
        colorMap = {
            "Tokyo_ramen": "#B0C4DE",
            "Tokyo_sushi": "#f7cac9",
            "Kyoto_ramen": "#D8BFD8",
            "Kyoto_sushi": "#b1cbbb",
        }

        var tooltip = d3.select(tooltipdiv)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background", "#FFFF00")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "3px")
            .style("padding", "3px")
            .style("width", "200px")
            .style("height", "110px")

        chart.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return x(parseFloat(d.rating));
            })
            .attr("height", y.bandwidth())
            .attr("fill", function (d) {
                key = String(d.prefecture) + "_" + String(d.category)
                // console.log(key)
                return colorMap[key]
            })
            .on("mouseover", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", "#ff5500")
                // console.log(d)
                tooltip
                    .html("Rating: " + d.rating
                        + " (" + d.num_reviews + " reviews) <br>"
                        + "Prefecture: " + d.prefecture + "<br>"
                        + "Category: " + d.category + "<br>"
                        + "Price: " + d.price_range)
                    .style('transform', `translate(${d3.mouse(this)[0] + 700}px, ${d3.mouse(this)[1] + 150}px)`)
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        return colorMap["tokyo_ramen"]
                    })
                tooltip.style("opacity", 0)
            });
    });
}