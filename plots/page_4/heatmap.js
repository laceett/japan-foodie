create_pie_catagory("./plots/page_4/hours_allprefecture.csv", "Heatmap")

function create_pie_catagory(data_file, title) {
    d3.csv("./plots/page_4/ramen_hours_allprefecture.csv", function (data_ramen) {
    d3.csv("./plots/page_4/sushi_hours_allprefecture.csv", function (data_sushi) {
    d3.csv("./plots/page_4/tempura_hours_allprefecture.csv", function (data_tempura) {
    d3.csv("./plots/page_4/udon_hours_allprefecture.csv", function (data_udon) {
    d3.csv("./plots/page_4/bbq_hours_allprefecture.csv", function (data_bbq) {
    d3.csv("./plots/page_4/izakaya_hours_allprefecture.csv", function (data_izakaya) {
        

        var categories = ['sushi', 'ramen', 'tempura', 'udon', 'bbq', 'izakaya']

        var times = ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00",
            "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
            "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"];

        let hoursData = []

        let hours_sushi = new Array(24).fill(0)
        let hours_ramen = new Array(24).fill(0)
        let hours_tempura = new Array(24).fill(0)
        let hours_udon = new Array(24).fill(0)
        let hours_bbq = new Array(24).fill(0)
        let hours_izakaya = new Array(24).fill(0)

        var append_to_hours = function (data, hours) {
            for (var i = 0; i < data.length; i++) {
                start_hour_1 = data[i].start_hour_1.split(':')[0]

                end_hour_1 = data[i].end_hour_1.split(':')[0]

                start_hour_2 = data[i].start_hour_2.split(':')[0]
                end_hour_2 = data[i].end_hour_2.split(':')[0]

                if (start_hour_1 != "" && end_hour_1 != "") {
                    start_int = parseInt(start_hour_1)
                    end_int = parseInt(end_hour_1)
                    hour_open = start_int
                    for (var j = 0; j < 24; j++) {
                        if (hour_open < 24) {
                            hours[hour_open] += 1
                        }
                        hour_open = hour_open + 1
                        hour_open %= 24
                        if (hour_open == end_int) {
                            break;
                        }
                    }
                }
                if (start_hour_2 != "" && end_hour_2 != "") {
                    start_int = parseInt(start_hour_2)
                    end_int = parseInt(end_hour_2)
                    hour_open = start_int
                    for (var j = 0; j < 24; j++) {
                        if (hour_open < 24) {
                            hours[hour_open] += 1
                        }
                        hour_open = hour_open + 1
                        hour_open %= 24
                        if (hour_open == end_int) {
                            break;
                        }
                    }
                }
            }
        }

        var addToDataSet = function (data_array, name) {
            for (var i = 0; i < data_array.length; i++) {
                hoursData.push({ category: name, hour: times[i], value: data_array[i] })
            }
        }

        // var categories = ['sushi', 'ramen', 'tempura', 'udon', 'bbq', 'izakaya']
        append_to_hours(data_ramen, hours_ramen)
        append_to_hours(data_sushi, hours_sushi)
        append_to_hours(data_tempura, hours_tempura)
        append_to_hours(data_udon, hours_udon)
        append_to_hours(data_bbq, hours_bbq)
        append_to_hours(data_izakaya, hours_izakaya)


        addToDataSet(hours_ramen, 'sushi')
        addToDataSet(hours_sushi, 'ramen')
        addToDataSet(hours_tempura, 'tempura')
        addToDataSet(hours_udon, 'udon')
        addToDataSet(hours_bbq, 'bbq')
        addToDataSet(hours_izakaya, 'izakaya')

        console.log(hours_bbq)

        const margin = {
            top: 50,
            bottom: 150,
            left: 75,
            right: 20,
        }
        var svgWidth = 850;
        var svgHeight = 400;

        var svg = d3.select('div.hours')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom)
            .attr('id', 'heatmap')
            .style("font-size", 11)

        var chart = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var x = d3.scaleBand()
            .rangeRound([0, svgWidth])
            .domain(times)
            .padding(0.04);

        var y = d3.scaleBand()
            .rangeRound([0, svgHeight])
            .domain(categories)
            .padding(0.04)

        const annotations = [
            {
                note: {
                title: "Izakaya",
                label: "Casual Japanese bar/restaurant which is open at all times"
                },
                connector: {
                end: "dot",        // Can be none, or arrow or dot
                type: "line",      // ?? don't know what it does
                lineType : "vertical",    // ?? don't know what it does
                endScale: 8     // dot size
                },
                color: ["grey"],
                x: 40,
                y: 440,
                dy: 70,
                dx: 70
            }
            ]
            
            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)
        
            d3.select("#heatmap")
                .append("g")
                .call(makeAnnotations)
              
        y_axis = d3.axisLeft().scale(y);
        x_axis = d3.axisBottom().scale(x);

        chart.append('g')
            .call(y_axis);

        chart.append('g')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .call(x_axis);

        var colorFn = d3.scaleSequential(d3.interpolateYlGnBu)
            .domain([500, 22500])

        svg.append("g")
            .attr("class", "legendLinear")
            .attr('font-size', '10px')
            .attr('transform', 'translate(90,0)')

        var legendLinear = d3.legendColor()
            .shapeWidth(50)
            .cells(10)
            .orient('horizontal')
            .scale(colorFn);

        svg.select(".legendLinear")
            .call(legendLinear);

        chart.selectAll('rect')
            .data(hoursData, function (d) {
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return x(d.hour);
            })
            .attr('y', function (d) {
                // console.log(d)
                return y(d.category);
            })
            .attr('height', y.bandwidth())
            .attr('width', x.bandwidth())
            .attr('fill', function (d) {
                return colorFn(d.value)
            })
            .on("mouseover", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", "#ff5500")
                // console.log(d)
                tooltip_global
                    .html("Restaurants Open: " + d.value)
                    // .style('transform', `translate(${d3.mouse(this)[0] + 100}px, ${d3.mouse(this)[1] + 100}px)`)
                    .style("height", "40px")
                    .style('left', d3.event.pageX + 50 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        return colorFn(d.value)
                    })
                    tooltip_global
                    .style("opacity", 0)

            });
        
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - svgHeight/2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Restaurant Category");      
        
        chart.append("text")             
            .attr("transform",
                    "translate(" + (svgWidth/2) + " ," + 
                                    (svgHeight + margin.bottom - 100) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .text("Time (Hours)");

    });
    });
    });
    });
    });
    });
}