create_pie_catagory("./plots/page_4/hours_allprefecture.csv", "Heatmap")

function create_pie_catagory(data_file, title) {
    d3.csv("./plots/page_4/ramen_hours_allprefecture.csv", function (data_ramen) {
        d3.csv("./plots/page_4/sushi_hours_allprefecture.csv", function (data_sushi) {
            d3.csv("./plots/page_4/tempura_hours_allprefecture.csv", function (data_tempura) {
                d3.csv("./plots/page_4/udon_hours_allprefecture.csv", function (data_udon) {

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

                    // data processing
                    // console.log(data);
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
                                    hours[hour_open] += 1
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
                                    hours[hour_open] += 1
                                    hour_open = hour_open + 1
                                    hour_open %= 24
                                    if (hour_open == end_int) {
                                        break;
                                    }
                                }
                            }
                        }
                        // if (start_hour_2 != "" && end_hour_2 != "") {
                        //     start_int = parseInt(start_hour_1)
                        //     end_int = parseInt(end_hour_1)
                        //     hoursData.push({ "category": "ramen", "hour": start_int + ":00" })
                        // }
                    }

                    var addToDataSet = function (data_array, name) {
                        // console.log(data_array)
                        for (var i = 0; i < data_array.length; i++) {
                            hoursData.push({ category: name, hour: times[i], value: data_array[i] })
                        }
                    }

                    // var categories = ['sushi', 'ramen', 'tempura', 'udon', 'bbq', 'izakaya']
                    append_to_hours(data_ramen, hours_ramen)
                    append_to_hours(data_sushi, hours_sushi)
                    append_to_hours(data_tempura, hours_tempura)
                    append_to_hours(data_udon, hours_udon)

                    addToDataSet(hours_ramen, 'sushi')
                    addToDataSet(hours_sushi, 'ramen')
                    addToDataSet(hours_tempura, 'tempura')
                    addToDataSet(hours_udon, 'udon')
                    addToDataSet(hours_ramen, 'bbq')
                    addToDataSet(hours_ramen, 'izakaya')

                    console.log(hoursData)

                    const margin = {
                        top: 50,
                        bottom: 50,
                        left: 50,
                        right: 20,
                    }
                    var svgWidth = 850;
                    var svgHeight = 400;

                    var svg = d3.select('div.hours')
                        .append('svg')
                        .attr('width', svgWidth + margin.left + margin.right)
                        .attr('height', svgHeight + margin.top + margin.bottom);

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

                    y_axis = d3.axisLeft().scale(y);
                    x_axis = d3.axisBottom().scale(x);

                    chart.append('g')
                        .call(y_axis);

                    chart.append('g')
                        .attr('transform', 'translate(0,' + svgHeight + ')')
                        .call(x_axis);

                    var colorFn = d3.scaleSequential(d3.interpolateYlGnBu)
                        .domain([1, 22500])

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

                    var tooltip = d3.select("div.tooltip_hours")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
                        .style("background", "#FFFF00")
                        .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "3px")
                        .style("padding", "4px")
                        .style("width", "200px")
                        .style("height", "40px")

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
                            tooltip
                                .html("Restaurants Open: " + d.value)
                                .style('transform', `translate(${d3.mouse(this)[0] + 100}px, ${d3.mouse(this)[1] + 100}px)`)
                                .style("opacity", 1)
                        })
                        .on("mouseout", function (d, i) {
                            d3.select(this).interrupt();
                            d3.select(this)
                                .style("fill", function (d) {
                                    return colorFn(d.value)
                                })
                            tooltip.style("opacity", 0)
                        });
                });
            });
        });
    });


}