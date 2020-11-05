create_histogram_price("ramen_output.csv")
create_histogram_price("sushi_output.csv")

function create_histogram_price(data_file) {

    d3.csv(data_file, function(d) {
        return {
            start_price : d['dinner_start_price'],
            max_price : d['dinner_max_price'],
            // rating : d['rating'],
        };
    }).then(function(data) {

        let priceData = []

        // data processing
        console.log(data);
        for(var i = 0; i < data.length; i++) {
            if(data[i].start_price != '0') {
                // console.log(parseFloat(data[i].start_price))

                mid_price = (parseFloat(data[i].start_price) + parseFloat(data[i].max_price)) / 2
                priceData.push({'price': mid_price})
            }
        }
        console.log(priceData)

        // draw bar chart
        const margin = {top: 40, bottom: 20, left: 80, right: 20}
        var svgWidth = 400;
        var svgHeight = 400;

        var svg = d3.select('div.price')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate('+margin.left+','+margin.top+')')
        
        var x = d3.scaleLinear()
            .rangeRound([0, svgWidth])
            .domain([0, 10000]);

        var histogram = d3.histogram()
            .value(function(d) { return d.price; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(10)); // then the numbers of bins
    
        var bins = histogram(priceData);
        console.log(bins)

        var y = d3.scaleLinear()
            .range([svgHeight, 0]);

        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    
        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

            // append the bar rectangles to the svg element
        chart.append('g')
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { 
                if(x(d.x1) ==  x(d.x0)) {
                    return 0
                }
                return x(d.x1) - x(d.x0) - 1 ; 
            })
            .attr("height", function(d) { return svgHeight - y(d.length); })
            .style("fill", "#69b3a2")
        
        chart.append('g')
            .call(y_axis);
        chart.append('g')
            .attr('transform', 'translate(0,'+svgHeight+')')
            .call(x_axis);
    
    });
}