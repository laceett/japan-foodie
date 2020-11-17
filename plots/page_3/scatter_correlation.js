create_scatterplot("./plots/page_3/ramen_allprefecture.csv", "div.correlation_ramen")
create_scatterplot("./plots/page_3/sushi_allprefecture.csv", "div.correlation_sushi")

function create_scatterplot(data_file, div) {

    // d3.csv(data_file, function(d) {
    //     return {
    //         rating : d['rating'],
    //         start_price_dinner : d['dinner_start_price'],
    //         max_price_dinner : d['dinner_max_price'],
    //         start_price_lunch : d['lunch_start_price'],
    //         max_price_lunch : d['lunch_max_price'],
    //     };
    // }).then(function(data) {
    d3.csv(data_file, function (data) {

        var dataset = []

        for (var i = 0; i < data.length; i++) {
            if (data[i].start_price != '0') {
                // console.log(parseFloat(data[i].start_price))
                mid_price = 0
                mid_price_dinner = (parseFloat(data[i].dinner_start_price) + parseFloat(data[i].dinner_max_price)) / 2
                mid_price_lunch = (parseFloat(data[i].lunch_start_price) + parseFloat(data[i].lunch_max_price)) / 2

                if (mid_price_dinner == 0) {
                    mid_price = mid_price_lunch
                } else if (mid_price_lunch == 0) {
                    mid_price = mid_price_dinner
                } else if (mid_price_dinner != 0 && mid_price_lunch != 0) {
                    mid_price = (mid_price_dinner + mid_price_lunch) / 2
                }
                if (mid_price != 0) {
                    dataset.push({
                        'rating': data[i].rating,
                        'price': mid_price
                    })
                }
            }
        }

        // for(var i = 0; i < data.length; i++) {
        //     if(data[i].start_price != '0' && data[i].max_price != '0') {

        //         mid_price = (parseFloat(data[i].start_price) + parseFloat(data[i].max_price)) / 2
        //         console.log(mid_price)
        //         dataset.push({'rating': data[i].rating, 'price': mid_price})
        //     }
        // }

        const margin = {
            top: 40,
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
        
            // rating
        var x = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, svgWidth]);

            // rating
        var y = d3.scaleLinear()
            .domain([2.5, 5])
                .range([svgHeight, 0]);

        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

        
        chart.append('g')
            .selectAll("dot")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                    return x(d.price);
                })
                .attr("cy", function (d) {
                    return y(d.rating);
                })
            .attr("r", 1.5)
            .style("fill", "#87bdd8")
                .on("mouseover", function (d, i) {
                    d3.select(this).interrupt();
                    d3.select(this)
                        .style("fill", "#e06377")
                    tooltip.style("opacity", 1)
                    tooltip
                        .html("Count: " + d.length + "<br>" + "Rating range: " + d.x0 + " - " + d.x1)
                        .style('transform', `translate(${d3.mouse(this)[0]+150}px, ${d3.mouse(this)[1]-700}px)`)
                        .style("opacity", 1)
                })
                .on("mouseout", function (d, i) {
                    d3.select(this).interrupt();
                    d3.select(this)
                        .style("fill", function (d) {
                            return "#87bdd8"
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