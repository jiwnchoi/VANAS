import * as d3 from "d3";



export function drawBubbleChartFromData(data){
    
    const pack = data => d3
        .pack()
        .size([800-2, 500-2])
        .padding(20)(d3.hierarchy(data).sum(d => Math.abs(d.value)));


    const root = pack(data);
    console.log(root);

    const leaf = d3.select("svg").selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
        .attr("id", d => d.data.name);


    leaf.append("circle")
        .attr("r" , d => d.r)
        .attr("fill", "white")
        .style("filter", d => {
            if(d.data.value > 0){
                return "url(#drop-shadow-start)";
            }
            else{
                return "url(#drop-shadow-ext)";
            }
        });;

    leaf.append("text")
        .text(d => d.data.name)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-family", "Roboto");
    

}
