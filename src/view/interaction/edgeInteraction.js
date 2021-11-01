import * as d3 from "d3";
import { getEdgeData } from "../../data/data";
import drawObject from "../drawObject";
import { removeEdge } from "../makeObject";


function edgeMouseOver(){
    d3.select(this).datum().isDelete = 'delete';
    drawObject();
}

function edgeMouseOut(){
    d3.select(this).datum().isDelete = null;
    drawObject();
}

function edgeClicked(){
    removeEdge(d3.select(this).datum());
    drawObject();
}

export {edgeMouseOver, edgeMouseOut, edgeClicked}