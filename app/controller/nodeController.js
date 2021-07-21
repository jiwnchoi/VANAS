import { makeEdge } from "./edgeContorller.js"
import { setResult, checkResult } from "../data/result.js";
import { metaData } from "../data/metadata.js";

let isNodeClicked = null;

function dragNodeStart() {
    d3.select(this).select("circle").attr("stroke", "black");
  }

function dragNode(event, d) {
    d.x = event.x;
    d.y = event.y;
    const sourceNodeClass = ".sourcenode"+d.id;
    const targetNodeClass = ".targetnode" + d.id;
    const sourceNode = d3.selectAll(sourceNodeClass);
    const targetNode = d3.selectAll(targetNodeClass);
    sourceNode.attr("x1", d.x).attr("y1", d.y);
    targetNode.attr("x2", d.x).attr("y2", d.y);

    d3.select(this).raise().attr("transform", d => "translate("+d.x+","+d.y+")" );
}

function dragNodeEnd() {
    d3.select(this).select("circle").attr("stroke", null);
}

function clickedNode(){
    const node = d3.select(this);
    const sourceNode = isNodeClicked;
    const targetNode = node.attr('id');

    if(isNodeClicked){    
        if (checkResult(sourceNode, targetNode)){
            setResult(sourceNode, targetNode);
            makeEdge(sourceNode, targetNode);
        }       
        isNodeClicked = null;
        d3.selectAll("circle").style("filter", "url(#drop-shadow)");
    }
    else{
        node.select("circle").style("filter", "url(#drop-shadow-start)");
        isNodeClicked = targetNode;
    }
    d3.selectAll(".node").raise();
}

export function makeNode(svg, radius){
    const nodes = svg.selectAll("node")
        .data(metaData)
        .enter()
        .append("g")
        .attr("transform", d => "translate("+[d.x, d.y]+")" )
        .attr("class", "node")
        .attr("id", d=>d.id)
        .attr("r", radius)
        .call(
            d3.drag()
            .on("start", dragNodeStart)
            .on("drag", dragNode)
            .on("end", dragNodeEnd)
        )
        .on("click", clickedNode);

    nodes.append("circle")   
        .attr("r", radius)
        .attr("fill", "white")
        .style("filter", "url(#drop-shadow)");

    nodes.append("text")
        .text(d => d.name)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-family", "Roboto");
}