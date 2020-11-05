create_scatterplot("./plots/page_3/ramen_output.csv", "Relationship between price & rating of Ramen")
create_scatterplot("./plots/page_3/sushi_output.csv", "Relationship between price & rating of Sushi")

function create_scatterplot(data_file, title) {

    d3.csv(data_file, function (d) {
        return {
            rating: d['rating'],
            start_price: d['dinner_start_price'],
            max_price: d['dinner_max_price'],
        };
    }).then(function (data) {
        var dataset = []

        for (var i = 0; i < data.length; i++) {
            if (data[i].start_price != '0' && data[i].max_price != '0') {

                mid_price = (parseFloat(data[i].start_price) + parseFloat(data[i].max_price)) / 2
                console.log(mid_price)
                dataset.push({ 'rating': data[i].rating, 'price': mid_price })
            }
        }

        const margin = { top: 40, bottom: 20, left: 80, right: 20 }
        var svgWidth = 400;
        var svgHeight = 400;

        var svg = d3.select('div.correlation')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        // rating
        var x = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, svgWidth]);

        // rating
        var y = d3.scaleLinear()
            .domain([2, 4])
            .range([svgHeight, 0]);

        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);


        chart.append('g')
            .selectAll("dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.price); })
            .attr("cy", function (d) { return y(d.rating); })
            .attr("r", 1.5)
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