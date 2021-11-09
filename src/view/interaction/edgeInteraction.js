import * as d3 from "d3";
import drawObject from "../drawObject";
import { removeEdge } from "../makeObject";


const tooltip = d3.select("#cellBuilder").append("div")
    .attr("class", "tooltipMetric")
    .style("position", "fixed")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .classed("visually-hidden", true)
    .style("font-size", "10px");



function edgeMouseOver(event, d){
    function calcTooltipXcoordinate(event){
        if (event.x < 1350) return (event.x + 10) + "px";
        else return (event.x - 145) + "px";
    }

    d3.select(this).datum().isDelete = 'delete';
    tooltip
        .html("Contribution Rate: " + d.sharpleyValue)
        .style("top", (event.y) + "px")
        .style("left", calcTooltipXcoordinate(event))
        .classed("visually-hidden", false);
    drawObject();
}

function edgeMouseOut(){
    d3.select(this).datum().isDelete = null;
    tooltip.classed("visually-hidden", true);
    drawObject();
}

function edgeClicked(){
    removeEdge(d3.select(this).datum());
    drawObject();
}

export {edgeMouseOver, edgeMouseOut, edgeClicked}