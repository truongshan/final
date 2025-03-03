(function () {

    // Create a div for the SVG to be placed into
    var svgDiv = document.createElement("div");
    svgDiv.classList.add("svgdiv");
    svgDiv.id = "spendingTrendsDiv";

    // Create div for chart description
    var descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.id = "spendingTrendsDescription";
    descriptionDiv.innerHTML = "From this chart we can tell that sponsored research and student services take up quite a bit of money. Since these are the major remaining trends associated with total liabilities, we can safely conclude that real estate with assets accounts for the rest of the $1.1B accounted for in 2020. Additionally, this chart tells us that there is much more that factors into WPI's overall budget than just student tuition. Loans, research, and student services are how the tuition is partitioned, and each one plays its own role in accumulating to the total value of liabilities.";

    // Append divs to body
    document.body.appendChild(svgDiv);
    document.body.appendChild(descriptionDiv);

    // Define height, width, margins for svg
    var margin = {top: 50, right: 200, bottom: 50, left: 200},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Define svg
    var svg = d3.select("#spendingTrendsDiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "svg");

    // Read from csv
    d3.csv("maincsv.csv", function (error, data) {
        if (error) {
            throw error;
        }

        // Color scheme
        var color = d3.scaleOrdinal()
            .domain(d3.range(3))
            .range(['#e41a1c', '#377eb8', "green"])


        //My sanity is wearing thin.


        // x and y scales for axes
        let x = d3.scaleBand()
            .padding(0.2)
            .range([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(10);



        // Set x and y domain
        x.domain(data.map(function (d) {
            return d.Year;
        }));

        y.domain([0, d3.max(data, function(d) {
            return parseInt(d.SR)*1000;
        })])


        var xScale = d3.scaleBand().range([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range([height, 0]);

        // x scale
        xScale.domain(data.map(function (d) {
            return d.Year;
        }))
            .range([0, width]);

        // y scale
        yScale.domain([0, d3.max(data, function (d) {
            return d.SR;
        })]);

        // Add x axis label
        svg.append("text")
            .attr("transform", "translate(" + (width/2) + ", " + (height + margin.top) + ")")
            .style("text-anchor", "middle")
            .text("Fiscal Year")
            .style("font-size", "14px")

        // Add y axis left label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left/3 - 30)
            .attr("x", 0 - (height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Dollars")
            .style("font-size", "14px");


        // Add chart title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top/3))
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Sponsored Research, Student Services, Student Loans vs Year");


        // Function for generating multi line chart
        function drawLine(c, data){
            var lineGen = d3.line()
                .x(function(d) {
                    return xScale(d.Year);
                })
                .y(function(d) {
                    return yScale(d[c]);
                })
            return lineGen(data);
        }


        var SRLine = svg.selectAll(".line")
            .data(data).enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", color(0))
            .attr("stroke-width", 2)
            .attr("d", function() {
                return drawLine("SR", data);
            });

        var SSLine = svg.selectAll(".line")
            .data(data).enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", color(1))
            .attr("stroke-width", 2)
            .attr("d", function() {
                return drawLine("SS", data);
            });

        var SLRLine = svg.selectAll(".line")
            .data(data).enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", color(2))
            .attr("stroke-width", 2)
            .attr("d", function() {
                return drawLine("SLR", data);
            });



        // Append x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)"
            });

        // Append y axis left
        svg.append("g")
            .attr("id", "spendingTrendsYAxis")
            .attr("class", "yAxis")
            .call(yAxis);


        // CREATE LEGEND //
        var R = 6; // legend marker
        var svgLegend = svg.append('g')
            .attr('class', 'gLegend')
            .attr("transform", "translate(" + (width + 20) + "," + 0 + ")");

        var legend = svgLegend.selectAll('.legend')
            .data(color.domain())
            .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"});

        legend.append("circle")
            .attr("class", "legend-node")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", R)
            .style("fill", function(d, i){
                return color(i);
        });

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", R*2)
            .attr("y", R/2)
            .style("fill", "#666666")
            .style("font-size", "14px")
            .text(function(d){
                if(d == 0){
                    return "Sponsored Research";
                } else if(d == 1){
                    return "Student Services";
                } else if(d == 2){
                    return "Student Loans Receivable";
                }
            });

    });

})();