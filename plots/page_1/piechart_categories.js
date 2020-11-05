create_pie_catagory("japan_restaurant_category.csv")
// create_historgram_rating("sushi_output.csv")

function create_pie_catagory(data_file) {

    d3.csv(data_file, function(d) {
        return {
            category : d['Category'],
            count : d['RestaurantCount'],
        };
    }).then(function(data) {

        let categoryData = []
        var otherCount = 0;

        // data processing
        console.log(data);
        for(var i = 0; i < data.length; i++) {
            if(i < 5) {
                categoryData.push(data[i])
            }
            else {
                otherCount += parseFloat(data[i].count)
            }
        }

        categoryData.push({"category": "Other", "count": otherCount});
        console.log(categoryData)

        // draw bar chart
        const margin = {top: 40, bottom: 20, left: 80, right: 20}
        var svgWidth = 400;
        var svgHeight = 400;
        var radius = Math.min(svgWidth, svgHeight) / 2 - margin.top

        var svg = d3.select('div.categories')
            .append('svg')
            .attr('width', svgWidth + margin.left + margin.right)
            .attr('height', svgHeight + margin.top + margin.bottom);

        var chart = svg.append('g')
            .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

            // .attr('transform', 'translate('+margin.left+','+margin.top+')')
        
        var color = d3.scaleOrdinal()
            .domain(categoryData)
            .range(d3.schemeSet3);

        var pie = d3.pie()
            .value(function(d) {return d.count; })
                  
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        var arcs = chart.selectAll("arc")
            .data(pie(categoryData))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc);    

        chart.selectAll("arc")
            .data(pie(categoryData))
            .enter()
            .append("text")
            .text(function(d){ 
                console.log(d)
                return d.data.category })
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 12)          

            // svg
            // .selectAll('mySlices')
            // .data(data_ready)
            // .enter()
            // .append('text')
            // .text(function(d){ return "grp " + d.data.key})
            // .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            // .style("text-anchor", "middle")
            // .style("font-size", 17)
          
    });
}