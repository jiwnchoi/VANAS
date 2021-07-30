import * as d3 from "d3";

import { printResult, makeEdge } from "./edgeContorller.js"
import { getEdgeData, getNodeData, deleteNode, addNode, isEdgeExists, updateEdge, deleteEdge } from "../data/result.js";

let isNodeClicked = null;
function deleteEdgeMouseOver(){
    d3.select(this).attr("stroke","tomato").style("marker-end","url(#endDelete)")
    d3.selectAll(".node").raise();
}

function deleteEdgeMouseOut(){
    d3.select(this).attr("stroke","gray").style("marker-end","url(#end)")
    d3.selectAll(".node").raise();
}

function deleteEdgeClicked(){
    const edge = d3.select(this);
    const edgeClassName = edge.attr('class');
    deleteEdge(edgeClassName);
    drawObject();
    edge.remove();
    printResult();
}
function dragNodeStart() {
    d3.select("#deleteBox").attr("visibility","visible");
    d3.select(this).select("circle").attr("stroke", "black");
  }

function dragNode(event, d) {
    d.x = event.x;
    d.y = event.y;
    const nodeNum = d.id;
    const sourceNodeClass = ".sourcenode"+nodeNum;
    const targetNodeClass = ".targetnode" + nodeNum;
    const sourceNode = d3.selectAll(sourceNodeClass);
    const targetNode = d3.selectAll(targetNodeClass);
    sourceNode.attr("x1", d.x).attr("y1", d.y);
    targetNode.attr("x2", d.x).attr("y2", d.y);
    d3.select(this).raise().attr("transform", d => "translate("+d.x+","+d.y+")" );
    updateEdge(nodeNum);
}

function dragNodeEnd(event, d) {
    const selectedNode = d3.select(this);
    d3.select("#deleteBox").attr("visibility","hidden");
    selectedNode.select("circle").attr("stroke", null);
    const nodeIndex = selectedNode.attr('id');
    if (deleteBoxCheck(event.x, event.y, nodeIndex)){
        deleteNode(nodeIndex);
        selectedNode.remove();
        drawObject();

    }

    
}

function deleteBoxCheck(x, y, id){
    const rectMargin = 30;
    const rectHeight = 80;

    if ( rectMargin < x &&
         x < 800-rectMargin &&
         600-rectMargin-rectHeight < y && 
         y < 600-rectMargin &&
         id != 5 &&
         id != 6){
        return true;
    }
    return false;
}

function clickedNode(){
    const node = d3.select(this);
    const sourceNode = isNodeClicked;
    const targetNode = node.attr('id');

    if(isNodeClicked){    
        if (!isEdgeExists(sourceNode, targetNode)){
            makeEdge(sourceNode, targetNode);
        }       
        isNodeClicked = null;
        d3.selectAll("circle").style("filter", "url(#drop-shadow)");
        printResult();
    }
    else{
        node.select("circle").style("filter", "url(#drop-shadow-start)");
        isNodeClicked = targetNode;
    }
    d3.selectAll(".node").raise();
    
}



export function drawObject(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    console.log(nodeData, edgeData);

    const radius = 40;
    const nodes = d3.select("svg").selectAll(".node")
        .data(nodeData)
        .attr("id", d=>d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" )

        .enter()
        .append("g")
        .attr("id", d=>d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" )
        .attr("class", "node")
        .call(
            d3.drag()
            .on("start", dragNodeStart)
            .on("drag", dragNode)
            .on("end", dragNodeEnd)
        )
        .on("click", clickedNode)
        .append("circle") 
        .attr("r", radius)
        .attr("fill", "white")
        .style("filter", "url(#drop-shadow)")
        .insert("text")
        .text(d => d.name)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-family", "Roboto")
        
        .exit()
        .remove();
        
        
    
    d3.select("svg").selectAll("line")
        .data(edgeData)
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)


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
        .on("mouseover", deleteEdgeMouseOver)
        .on("mouseout", deleteEdgeMouseOut)
        .on("click", deleteEdgeClicked);
        


    
}

export function makeNode(){
    const nodeType = d3.select(this).attr("id");
    addNode(nodeType);
    const nodeData = getNodeData();
    drawObject(nodeData);
}