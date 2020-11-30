
var margin_ranking = {
    top: 75,
    bottom: 50,
    left: 175,
    right: 20,
}
var svgWidth_ranking = 800;
var svgHeight_ranking = 700;

var ranking_barchart = d3.select("div.ranking")
.append('svg')
.attr('width', svgWidth_ranking + margin_ranking.left + margin_ranking.right)
.attr('height', svgHeight_ranking + margin_ranking.top + margin_ranking.bottom)
.append('g')
.attr('transform', 'translate(' + margin_ranking.left + ',' + margin_ranking.top + ')')

d3.selectAll("input")
	.on("change", selectDataset);
create_ranking_barchart("sushi")

function selectDataset()
{
	var value = this.value;
  //var value = d3.select('input[name="dataset"]:checked').node().value;

	if (value == "option1")
	{
        create_ranking_barchart("sushi")
	}
	else if (value == "option2")
	{
        create_ranking_barchart("ramen")
    }
    else if (value == "option3")
	{
        create_ranking_barchart("izakaya")
    }
	else if (value == "option4")
	{
        create_ranking_barchart("bbq")
    }

}

function create_ranking_barchart(selected_category) {
    d3.csv("./plots/page_5/top_sushi_ramen.csv", function (data) {

        ranking_barchart.selectAll("*").remove();

        data = data.sort((a, b) => (a.rating < b.rating) ? 1 : -1)
        rankingData = []

        for (var i = 0; i < data.length; i++) {
            if (data[i].category == selected_category) {
                rankingData.push(data[i])
            }
        }

        console.log(rankingData)

        var margin = margin_ranking
        var svgWidth = svgWidth_ranking
        var svgHeight = svgHeight_ranking
    
        var x = d3.scaleLinear()
            .domain([3.0, 5.0])
            .range([0, svgWidth]);

        var y = d3.scaleBand()
            .rangeRound([margin.top, svgHeight - margin.bottom])
            .domain(rankingData.map(function (d) { return d.name; }))
            .padding(0.1)

        x_axis = d3.axisTop().scale(x);
        y_axis = d3.axisLeft().scale(y);
        ranking_barchart.append('g')
            .attr("transform", `translate(0,${margin.top})`)
            .call(x_axis);

        ranking_barchart.append('g')
        .call(y_axis);



        // var colorFn = d3.scaleSequential()
        // .interpolator(d3.interpolateViridis)
        //     .domain([1, 2000])
        // .range(["#92a8d1", "#f7cac9", "#b1cbbb", "#b8a9c9", "#878f99", "#f18973", "#b7d7e8", "#ffef96"])
        colorMap = {
            "Tokyo": "#B0C4DE",
            "Kyoto": "#a3d76e",
            "Osaka": "#D8BFD8",
            "Hokkaido": "#ffcc00",
        }

        ranking_barchart.append("circle").attr("cx", 50).attr("cy", 0).attr("r", 6).style("fill", colorMap['Tokyo'])
        ranking_barchart.append("circle").attr("cx", 150).attr("cy", 0).attr("r", 6).style("fill", colorMap['Kyoto'])
        ranking_barchart.append("circle").attr("cx", 250).attr("cy", 0).attr("r", 6).style("fill", colorMap['Osaka'])
        ranking_barchart.append("circle").attr("cx", 350).attr("cy", 0).attr("r", 6).style("fill", colorMap['Hokkaido'])

        ranking_barchart.append("text").attr("x", 70).attr("y", 0).text("Tokyo").style("font-size", "15px").attr("alignment-baseline", "middle")
        ranking_barchart.append("text").attr("x", 170).attr("y", 0).text("Kyoto").style("font-size", "15px").attr("alignment-baseline", "middle")
        ranking_barchart.append("text").attr("x", 270).attr("y", 0).text("Osaka").style("font-size", "15px").attr("alignment-baseline", "middle")
        ranking_barchart.append("text").attr("x", 370).attr("y", 0).text("Hokkaido").style("font-size", "15px").attr("alignment-baseline", "middle")

        ranking_barchart.selectAll("rect")
            .data(rankingData)
            .enter()
            .append("rect")
            // .transition()
            // .duration(1000)
            .attr("x", 0)
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return x(parseFloat(d.rating));
            })
            .attr("height", y.bandwidth())
            .attr("fill", function (d) {
                key = String(d.prefecture) + "_" + String(d.category)
                // console.log(key)
                return colorMap[d.prefecture]
            })
            .on("mousemove", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", "#ff5500")
                // console.log(d)
                tooltip_global
                    .html("Rating: " + d.rating + "<br>"
                        + "Prefecture: " + d.prefecture + "<br>"
                        + "Category: " + d.category + "<br>"
                        + "Price: " + d.price_range)
                    // .style('transform', `translate(${d3.mouse(this)[0] + 200}px, ${d3.mouse(this)[1] + 150}px)`)
                    .style("height", "120px")
                    .style('left', d3.event.pageX + 50 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style("opacity", 1)
            })
            .on("mouseout", function (d, i) {
                d3.select(this).interrupt();
                d3.select(this)
                    .style("fill", function (d) {
                        return colorMap[d.prefecture]
                    })
                    tooltip_global
                    .style("opacity", 0)
            });
        
        ranking_barchart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - svgHeight/2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Restaurant Name");      

        ranking_barchart.append("text")             
            .attr("transform",
                    "translate(" + (svgWidth/2) + " ," + (0 + 40) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Customer Rating");

            // ranking_barchart.exit()
            // .remove();      
    });
}