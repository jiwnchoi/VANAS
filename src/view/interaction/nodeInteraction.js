import * as d3 from "d3";
let isNodeClicked = null;
import { updateEdge, isEdgeExists } from "../../controller/edgeController";
import { deleteNode } from "../../controller/nodeController";
import { makeEdge } from "../makeObject";
import drawObject from "../drawObject";
import { getNodeData } from "../../data/data";

function dragNodeStart(event, d) {
    if (d.type == "input" || d.type == "output") return null;
    d3.select("#deleteBox").attr("visibility","visible");
 }

function dragNode(event, d) {
    if (d.type == "input" || d.type == "output") return null;
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
    if (d.type == "input" || d.type == "output") return null;
    const selectedNode = d3.select(this);
    d3.select("#deleteBox").attr("visibility","hidden");
    const nodeIndex = Number(selectedNode.attr('id')[4]);
    if (deleteBoxCheck(event.x, event.y, nodeIndex)){
        deleteNode(nodeIndex);
        drawObject();
    }
}

function deleteBoxCheck(x, y, id){
    const nodeData = getNodeData();
    const rectMargin = 30;
    const rectHeight = 80;

    if ( rectMargin < x &&
         x < 800-rectMargin &&
         600-rectMargin-rectHeight < y && 
         y < 600-rectMargin &&
         id != 0 &&
         id != nodeData.length-1){
        return true;
    }
    return false;
}

function clickedNode(){
    const node = d3.select(this);
    const sourceNode = isNodeClicked;
    const targetNode = Number(node.attr('id')[4]);
    console.log(sourceNode, targetNode);

    if(isNodeClicked != null){    
        if (!isEdgeExists(sourceNode, targetNode)){
            makeEdge(sourceNode, targetNode);
        }       
        isNodeClicked = null;
        // d3.selectAll("circle").style("filter", "url(#drop-shadow)");
    }
    else{
        node.select("circle").style("filter", "url(#drop-shadow-start)");
        isNodeClicked = targetNode;
    }
    d3.selectAll(".node").raise();
    
}

export {dragNodeStart, dragNode, dragNodeEnd, clickedNode};