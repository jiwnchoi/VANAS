import * as d3 from "d3";
let isNodeClicked = null;
import { updateEdge, isEdgeExists } from "../../controller/edgeController";
import { deleteNode } from "../../controller/nodeController";
import { makeEdge } from "../makeObject";
import drawObject from "../drawObject";
import { getNodeData } from "../../data/data";
import { printResult } from "../printResult";

function dragNodeStart(event, d) {
    if (d.type == "input" || d.type == "output") return null;
    d3.select("#deleteBox").attr("visibility","visible");
 }

function dragNode(event, d) {
    if (d.type == "input" || d.type == "output") return null;
    d.x = event.x;
    d.y = event.y;
    const nodeNum = d.id;
    updateEdge(nodeNum);
    drawObject();
}

function dragNodeEnd(event, d) {
    if (d.type == "input" || d.type == "output") return null;
    const selectedNode = d3.select(this);
    d3.select("#deleteBox").attr("visibility","hidden");
    const nodeIndex = Number(selectedNode.attr('id').replace('node',''));
    if (deleteBoxCheck(event.x, event.y)){
        deleteNode(nodeIndex);
        printResult();
    }
}

function deleteBoxCheck(x, y){
    const rectMargin = 30;
    const rectHeight = 80;

    if ( rectMargin < x &&
         x < 800-rectMargin &&
         600-rectMargin-rectHeight < y && 
         y < 600-rectMargin){
        return true;
    }
    return false;
}

function clickedNode(){
    const node = d3.select(this);
    const sourceNode = isNodeClicked;
    const targetNode = Number(node.attr('id')[4]);
    const nodeData = getNodeData();

    if(isNodeClicked != null){    
        if (!isEdgeExists(sourceNode, targetNode)){
            makeEdge(sourceNode, targetNode);
        }       
        isNodeClicked = null;
        for (let node of nodeData){
            if(node.status == 'clicked') node.status = null;
        }
    }
    else{
        isNodeClicked = targetNode;
        for (let node of nodeData){
            if(node.id == targetNode) node.status = 'clicked';
        }
    }
    drawObject(isNodeClicked);
    
}

export {dragNodeStart, dragNode, dragNodeEnd, clickedNode};