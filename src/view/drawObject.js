import * as d3 from "d3";

import { getNodeData, getEdgeData } from "../data/data.js"

import * as nodeInteraction from "./interaction/nodeInteraction.js"
import * as edgeInteraction from "./interaction/edgeInteraction.js"
import { printResult } from "./printResult.js";


export default function drawObject(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    console.log(nodeData, edgeData);

    const radius = 40;


    //INIT
    const nodeGroups = d3.select("#architecture").selectAll(".node").data(nodeData)
    
    //UPDATE
    nodeGroups
        .attr("id", d=>"node"+d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" );

    nodeGroups.select("text")
        .text(d => d.name);

    //ENTER
    const nodeGroupsEnter = nodeGroups.enter().append("g")
        .attr("id", d=>"node"+d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" )
        .attr("class", "node")
        .call(
            d3.drag()
            .on("start", nodeInteraction.dragNodeStart)
            .on("drag", nodeInteraction.dragNode)
            .on("end", nodeInteraction.dragNodeEnd)
        )
        .on("click", nodeInteraction.clickedNode);
    
    nodeGroupsEnter.append("circle")
        .attr("r", radius)
        .attr("fill", "white")
        .style("filter", "url(#drop-shadow)");

    nodeGroupsEnter.append("text")
        .text(d => d.name)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-family", "Roboto");
    
    //EXIT
    nodeGroups.exit().remove();

    

    const edge = d3.select("#architecture").selectAll("line").data(edgeData);
    
    //UPDATE
    edge        
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
    
    //ENTER
    edge
        .enter()
        .append("line")
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke-width", 3)
        .attr("stroke", "gray")
        .style("marker-end", "url(#end)")
        .on("mouseover", edgeInteraction.edgeMouseOver)
        .on("mouseout", edgeInteraction.edgeMouseOut)
        .on("click", edgeInteraction.edgeClicked);

    //EXIT
    edge.exit().remove()


    printResult();
}

