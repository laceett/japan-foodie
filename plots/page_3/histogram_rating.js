create_historgram_rating("./plots/page_3/ramen_allprefecture.csv", "div.rating_ramen")
create_historgram_rating("./plots/page_3/sushi_allprefecture.csv", "div.rating_sushi")

function create_historgram_rating(data_file, div) {
    d3.csv(data_file, function (data) {
        let ratingData = []

        // data processing
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].start_price != '0') {
                mid_price = (parseFloat(data[i].start_price) + parseFloat(data[i].max_price)) / 2
                ratingData.push({
                    'price': mid_price
                })
            }
        }

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

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        
        var tooltip = d3.select("div.tooltip_rating")
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

        var x = d3.scaleLinear()
            .rangeRound([0, svgWidth])
            .domain([3, 4.6]);

        var histogram = d3.histogram()
            .value(function (d) {
                return d.rating;
            }) // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(100)); // then the numbers of bins
    
        var bins = histogram(data);
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
                    .style("fill", "#92a8d1")
                    .on("mouseover", function (d, i) {
                        d3.select(this).interrupt();
                        d3.select(this)
                            .style("fill", "#e06377")
                        tooltip
                            .html("Count: " + d.length + "<br>" + "Rating range: " + d.x0 + " - " + d.x1)
                            // .style('transform', `translate(${d3.mouse(this)[0]+500}px, ${d3.mouse(this)[1]+300}px)`)
                            .style("opacity", 1)
                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).interrupt();
                        d3.select(this)
                            .style("fill", function (d) {
                                return "#92a8d1"
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