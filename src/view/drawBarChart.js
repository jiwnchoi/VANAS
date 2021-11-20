import * as d3 from "d3";
import * as barInteraction from "./interaction/barInteraction";


export function drawBarChartFromData(data){
    data.sort((a,b) => a.value - b.value);
    const sharpleyvalue = d3.select("#sharpleyvalue");
    const margin = {top : 50, bottom : 0, left : 50, right : 0};
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;
    const x = d3.scaleLinear()
        .range([margin.left, width])
        .domain([
            -0.03, 0.03
        ])

    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .rangeRound([height-margin.bottom, margin.top])
        .padding(0.2);
    
    const rects = sharpleyvalue.selectAll("rect.bar").data(data);

    let colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([-0.03, 0.03]);

    rects
        .enter()
        .append("rect")
        .attr("class","bar")
        
        .attr("width", d => Math.abs(x(d.value) - x(0)))
        .attr("height", y.bandwidth())
        .attr("fill", d => {
            return colorScale(d.value);
        })
        .attr("x", d => x(Math.min(0, d.value)))
        .attr("y", d => y(d.name))
        .on("click", (d) => {
            barInteraction.barClicked(d.target.__data__.source, d.target.__data__.target);
        })
        .on("mouseover", barInteraction.barMouseOver)
        .on("mouseout", barInteraction.barMouseOut);
    

    const xAxisGroup = sharpleyvalue
                        .append("g")
                        .attr("class", "xAxis")
                        .attr("transform", `translate(0, ${margin.top})`);
    const yAxisGroup = sharpleyvalue
                        .append("g")
                        .attr("class", "yAxis")
                        .attr("transform", `translate(${x(0)}, 0)`);

    const xAxis = d3.axisTop(x);
    const yAxis = d3.axisLeft(y);

    
    
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    sharpleyvalue
        .selectAll(".yAxis")
        .selectAll("text")
        .attr("text-anchor", (_, i) => (data[i].value > 0 ? "end" : "start"))
        .attr("x", (_, i) => (data[i].value > 0 ? -9 : 9));
        
    sharpleyvalue
        .selectAll(".yAxis")
        .selectAll("line")
        .attr("x2", (_, i) => (data[i].value > 0 ? -6 : 6));

    sharpleyvalue.selectAll("text").attr("font-size", 14)
    
}
