import * as d3 from "d3";

import { addNode } from "../controller/nodeController";
import { addEdge } from "../controller/edgeController";
import drawObject from "./drawObject";

function makeNode(){
    const nodeType = d3.select(this).attr("id");
    addNode(nodeType);
    drawObject();
}

function makeEdge(sourceNode, targetNode){
    addEdge(sourceNode, targetNode);
    drawObject();
}

export {makeNode, makeEdge}