import { metaData } from "../data/metadata";
import { unSetResult } from "../data/result";

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
    const className = edge.attr('class');
    const n1 = className[10];
    const n2 = className[22];
    unSetResult(n1, n2);
    edge.remove()
}

export function makeEdge(sourceNode, targetNode){
    const edgeClassName = "sourcenode"+sourceNode+" targetnode"+targetNode;

    d3.select("svg").append("line")
        .attr("class", edgeClassName)
        .attr("x1", () => {
            const sourceNodeObj = metaData.filter((d, i) => {
                return i == sourceNode
            })[0];
            return sourceNodeObj.x;

        })
        .attr("y1", () => {
            const sourceNodeObj = metaData.filter((d, i) => {
                return i == sourceNode
            })[0];
            return sourceNodeObj.y;

        })
        .attr("x2", () => {
            const targetNodeObj = metaData.filter((d, i) => {
                return i == targetNode
            })[0];
            return targetNodeObj.x;
        })
        .attr("y2", () => {
            const targetNodeObj = metaData.filter((d, i) => {
                return i == targetNode
            })[0];
            return targetNodeObj.y;
        })
        .attr("stroke-width", 3)
        .attr("stroke", "gray")
        .style("marker-end", "url(#end)")
        .on("mouseover", deleteEdgeMouseOver)
        .on("mouseout", deleteEdgeMouseOut)
        .on("click", deleteEdgeClicked);
}