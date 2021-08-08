import * as d3 from "d3";



export function drawBarChartFromData(data){
    data.sort((a,b) => a.value > b.value ? 1 : -1);
    const margin = {top : 50, bottom : 20, left : 100, right : 100};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    console.log(data)
    const x = d3.scaleLinear()
        .range([margin.left, width])
        .domain([
            -0.03, 0.03
        ])

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([height-margin.bottom, margin.top])
        .padding(0.2);

    const rects = d3.select("svg").selectAll("rect").data(data);

    rects
        .enter()
        .append("rect")
        .attr("width", d => Math.abs(x(d.value) - x(0)))
        .attr("height", y.bandwidth())
        .attr("fill", d => {
            if (d.value > 0){
                return "#0d6efd";
            }
            else{
                return "#dc3545";
            }
        })
        .attr("x", d => x(Math.min(0, d.value)))
        .attr("y", d => y(d.name))
        
    const xAxisGroup = d3.select("svg")
                        .append("g")
                        .attr("class", "xAxis")
                        .attr("transform", `translate(0, ${margin.top})`);
    const yAxisGroup = d3.select("svg")
                        .append("g")
                        .attr("class", "yAxis")
                        .attr("transform", `translate(${x(0)}, 0)`);

    const xAxis = d3.axisTop(x);
    const yAxis = d3.axisLeft(y)

    
    
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    d3.select("svg")
        .selectAll(".yAxis")
        .selectAll("text")
        .attr("text-anchor", (_, i) => (data[i].value > 0 ? "end" : "start"))
        .attr("x", (_, i) => (data[i].value > 0 ? -9 : 9));
        
    d3.select("svg")
        .selectAll(".yAxis")
        .selectAll("line")
        .attr("x2", (_, i) => (data[i].value > 0 ? -6 : 6));

    
}
