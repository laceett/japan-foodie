create_scatterplot("./plots/page_3/ramen_allprefecture.csv", "Relationship between price & rating of Ramen", "div.correlation_ramen", [0, 10000])
create_scatterplot("./plots/page_3/sushi_allprefecture.csv", "Relationship between price & rating of Sushi", "div.correlation_sushi", [0, 10000])

function create_scatterplot(data_file, title, div, range) {

    d3.csv(data_file, function (data) {

        var dataset = []
        var countMap = {}

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

                if (mid_price != 0 && mid_price < range[1]) {
                    var rating = data[i].rating
                    var price = mid_price

                    if(rating in countMap == false){
                        countMap[rating] = {}; // must initialize the sub-object, otherwise will get 'undefined' errors
                    }

                    if(price in countMap[rating] == false){
                        countMap[rating][price] = 0; // must initialize the sub-object, otherwise will get 'undefined' errors
                    }

                    countMap[rating][price] += 1
                
                    dataset.push({
                        'rating': data[i].rating,
                        'price': mid_price
                    })
                }
            }
        }

        console.log(countMap)

        const margin = {
            top: 30,
            bottom: 50,
            left: 75,
            right: 25
        }
        var svgWidth = 350;
        var svgHeight = 400;

        var svg = d3.select(div)
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        
        // rating
        var x = d3.scaleLinear()
            .domain(range)
            .range([0, svgWidth]);

            // rating
        var y = d3.scaleLinear()
            .domain([3, 4.2])
                .range([svgHeight, 0]);

        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

        var colorFn = d3.scaleSequential(d3.interpolateYlGnBu)
            .domain([-250, 800])
        
        svg.append("g")
            .attr("class", "legendLinear")
            .attr('font-size', '10px')
            .attr('transform', 'translate(100,50)')

        var legendLinear = d3.legendColor()
            .cells([0, 200, 400, 600, 800])
            .shapeWidth(50)
            .orient('horizontal')
            .scale(colorFn);

        svg.select(".legendLinear")
            .call(legendLinear);

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
            .style("fill", function (d) {
                // console.log(countMap[d.rating][d.price])
                count = countMap[d.rating][d.price]
                return colorFn(count)
            })
            .on("mouseover", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", "#e06377")
                // tooltip_global.style("opacity", 1)
                tooltip_global
                    .html("Rating: " + d.rating + " Price: " + d.price + "<br>" + "Count: " + countMap[d.rating][d.price])
                    // .style('transform', `translate(${d3.mouse(this)[0] + 150}px, ${d3.mouse(this)[1] - 700}px)`)
                    .style('left', d3.event.pageX + 50 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style("height", "70px")
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        count = countMap[d.rating][d.price]
                        return colorFn(count)
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
        
        chart.append('g')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(x_axis);
        
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - svgHeight/2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Customer Rating");      

        chart.append("text")             
            .attr("transform",
                    "translate(" + (svgWidth/2) + " ," + 
                                    (svgHeight + margin.bottom - 5) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Price (Yen)");
      

    });  
}