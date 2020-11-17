create_histogram_price("./plots/page_3/ramen_allprefecture.csv", "div.price_ramen")
create_histogram_price("./plots/page_3/sushi_allprefecture.csv", "div.price_sushi")

function create_histogram_price(data_file, div) {
    d3.csv(data_file, function (data) {
        let priceData = []

        // data processing
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].start_price != '0') {
                // console.log(parseFloat(data[i].start_price))
                mid_price = 0
                mid_price_dinner = (parseFloat(data[i].dinner_start_price) + parseFloat(data[i].dinner_max_price)) / 2
                mid_price_lunch = (parseFloat(data[i].lunch_start_price) + parseFloat(data[i].lunch_max_price)) / 2

                if (mid_price_dinner == 0) {
                    mid_price = mid_price_lunch
                }
                else if (mid_price_lunch == 0) {
                    mid_price = mid_price_dinner
                }
                else if (mid_price_dinner != 0 && mid_price_lunch != 0) {
                    mid_price = (mid_price_dinner + mid_price_lunch) / 2
                }
                if (mid_price != 0) {
                    priceData.push({
                        'price': mid_price
                    })
                }
                }
                }
        console.log(priceData)

        // draw bar chart
        const margin = {
            top: 0,
            bottom: 20,
            left: 50,
            right: 50
        }
        var svgWidth = 350;
        var svgHeight = 450;

        var svg = d3.select(div)
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var tooltip = d3.select("div.tooltip_price")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background", "lightsteelblue")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("width", "200px")
            .style("height", "70px")

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        
        var x = d3.scaleLinear()
            .rangeRound([0, svgWidth])
            .domain([0, 10000]);

        var histogram = d3.histogram()
            .value(function (d) {
                return d.price;
            }) // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(20)); // then the numbers of bins
    
        var bins = histogram(priceData);
        console.log(bins)

        var y = d3.scaleLinear()
            .range([svgHeight, 0]);

        y.domain([0, d3.max(bins, function (d) {
            return d.length;
        })]); // d3.hist has to be called before the Y axis obviously
    
        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

            // append the bar rectangles to the svg element
        chart.append('g')
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            })
                .attr("width", function (d) {
                        if (x(d.x1) == x(d.x0)) {
                    return 0
                }
                return x(d.x1) - x(d.x0) - 1;
                })
                .attr("height", function (d) {
                        return svgHeight - y(d.length);
                    })
                    .style("fill", "#80ced6")
                    .on("mouseover", function (d, i) {
                        d3.select(this).interrupt();
                        d3.select(this)
                            .style("fill", "#e06377")
                        tooltip.style("opacity", 1)
                        tooltip
                            .html("Count: " + d.length + "<br>" + "Price range: ¥" + d.x0 + " - ¥" + d.x1)
                            // .style('transform', `translate(${d3.mouse(this)[0]+500}px, ${d3.mouse(this)[1]+300}px)`)
                            .style("opacity", 1)
                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).interrupt();
                        d3.select(this)
                            .style("fill", function (d) {
                                return "#80ced6"
                            })
                        tooltip.style("opacity", 0)
                    });
        
        chart.append('g')
            .call(y_axis);
        chart.append('g')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(x_axis);
    
    });
}