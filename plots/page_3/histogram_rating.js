create_historgram_rating("./plots/page_3/ramen_output.csv", "Rating range of Ramen")
create_historgram_rating("./plots/page_3/sushi_output.csv", "Rating range of Sushi")

function create_historgram_rating(data_file, title) {

    d3.csv(data_file, function (d) {
        return {
            rating: d['rating'],
            // max_price : d['dinner_max_price'],

            // rating : d['rating'],
        };
    }).then(function (data) {

        let ratingData = []

        // data processing
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].start_price != '0') {
                mid_price = (parseFloat(data[i].start_price) + parseFloat(data[i].max_price)) / 2
                ratingData.push({ 'price': mid_price })
            }
        }

        // draw bar chart
        const margin = { top: 40, bottom: 20, left: 80, right: 20 }
        var svgWidth = 400;
        var svgHeight = 400;

        var svg = d3.select('div.rating')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var x = d3.scaleLinear()
            .rangeRound([0, svgWidth])
            .domain([2, 5]);

        var histogram = d3.histogram()
            .value(function (d) { return d.rating; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(100)); // then the numbers of bins

        var bins = histogram(data);
        console.log(bins)

        var y = d3.scaleLinear()
            .range([svgHeight, 0]);

        y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

        // append the bar rectangles to the svg element
        chart.append('g')
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function (d) {
                if (x(d.x1) == x(d.x0)) {
                    return 0
                }
                return x(d.x1) - x(d.x0) - 1;
            })
            .attr("height", function (d) { return svgHeight - y(d.length); })
            .style("fill", "#69b3a2")

        chart.append("text")
            .attr("y", 0 - (margin.top / 2))
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);

        chart.append('g')
            .call(y_axis);
        chart.append('g')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(x_axis);

    });
}