import * as d3 from 'd3';
import { addNode } from "../../controller/nodeController";
import { getNodeData } from "../../data/data";
import { makeEdge } from "../makeObject";

function barClicked(source, target){
    const nodeData = getNodeData();
    if (source == "input" && target == "output"){
        makeEdge(0,1);
    }
    else if (source == "input"){
        addNode(target);
        makeEdge(0, nodeData[nodeData.length-1].index);
    }
    else if (target == "output"){
        addNode(source);
        makeEdge(nodeData[nodeData.length-1].index, 1);
    }
    else if (nodeData.length < 6){
        addNode(source);
        addNode(target);
        makeEdge(nodeData[nodeData.length-2].index, nodeData[nodeData.length-1].index);
    }
}

function barMouseOver(){
    d3.select(this).attr("opacity", 0.5);
}

function barMouseOut(){
    d3.select(this).attr("opacity", 1);
}

export {barClicked, barMouseOver, barMouseOut};