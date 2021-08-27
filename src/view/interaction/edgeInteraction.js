import * as d3 from "d3";
import { getEdgeData } from "../../data/data";
import drawObject from "../drawObject";
import { removeEdge } from "../makeObject";


function edgeMouseOver(){
    const edgeClassName = d3.select(this).attr('class');
    const edgeData = getEdgeData();
    for (let edge of edgeData){
        if (edge.edgeClassName == edgeClassName){
            edge.isDelete = 'delete';
        }
    }
    drawObject();
}

function edgeMouseOut(){
    const edgeClassName = d3.select(this).attr('class');
    const edgeData = getEdgeData();
    for (let edge of edgeData){
        if (edge.edgeClassName == edgeClassName){
            edge.isDelete = null;
        }
    }
    drawObject();
}

function edgeClicked(){
    const edgeClassName = d3.select(this).attr('class');
    removeEdge(edgeClassName);
}

export {edgeMouseOver, edgeMouseOut, edgeClicked}