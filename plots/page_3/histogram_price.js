create_histogram_price("./plots/page_3/ramen_allprefecture.csv", "Price range of Ramen (JPY)", "div.price_ramen", [0, 10000])
create_histogram_price("./plots/page_3/sushi_allprefecture.csv", "Price range of Sushi (JPY)", "div.price_sushi", [0, 10000])

function create_histogram_price(data_file, title, div, range) {
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

        // draw histogram 
        const margin = {
            top: 30,
            bottom: 50,
            left: 75,
            right: 25
        }
        var svgWidth = 365;
        var svgHeight = 350;

        var svg = d3.select(div)
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var x = d3.scaleLinear()
            .rangeRound([0, svgWidth])
            .domain(range);

        var histogram = d3.histogram()
            .value(function (d) {
                return d.price;
            })
            .domain(x.domain())
            .thresholds(x.ticks(16)); //the numbers of bins

        var bins = histogram(priceData);
        console.log(bins)

        var y = d3.scaleLinear()
            .range([svgHeight, 0])
            .domain([0, 23000])
        //     .domain([0, d3.max(bins, function (d) {
        //     return d.length;
        // })]);

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
                    // tooltip_global.style("opacity", 1)
                tooltip_global
                    .html("Count: " + d.length + "<br>" + "Price range: ¥" + d.x0 + " - ¥" + d.x1)
                    .style('left', d3.event.pageX + 50 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style("height", "70px")
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        return "#80ced6"
                    })
                tooltip_global.style("opacity", 0)
            });

        chart.append("text")
            .attr("y", 0 - (margin.top / 2))
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);

        chart.append('g')
            .call(y_axis);
        
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - svgHeight/2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Count");      

        chart.append('g')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(x_axis);
        
        chart.append("text")             
            .attr("transform",
                    "translate(" + (svgWidth/2) + " ," + 
                                    (svgHeight + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Price (Yen)");
      

    });
}