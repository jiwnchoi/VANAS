import * as d3 from "d3";

import { addNode } from "../controller/nodeController";
import { addEdge, deleteEdge } from "../controller/edgeController";
import { printResult } from "./printResult";
import { calaulateForce, drawObjectwithForce } from "./drawObject";


async function makeNode(){
    const nodeType = d3.select(this).attr("id");
    const result = addNode(nodeType);
    if (result == 0){
        d3.select("#nodeNumberAlert").attr("class", "notcell alert alert-danger");
        await new Promise((r) => setTimeout(r, 3000));
        d3.select("#nodeNumberAlert").attr("class", "notcell alert alert-danger visually-hidden");

    }
    printResult();
}

function makeEdge(sourceNode, targetNode, target=0){
    addEdge(sourceNode, targetNode, target);
    printResult();
}

function removeEdge(edgeClassName){
    deleteEdge(edgeClassName);
    printResult();
}

export {makeNode, makeEdge, removeEdge}