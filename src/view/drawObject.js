import * as d3 from "d3";

import { getNodeData, getEdgeData } from "../data/data.js"

import * as nodeInteraction from "./interaction/nodeInteraction.js"
import * as edgeInteraction from "./interaction/edgeInteraction.js"
import { getNextNodeAccuracy } from "../data/recommendNextNode.js";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData.js";

async function drawRecommend(clickedNode){
    let recommendEdgeData = null;
    if (clickedNode == null){
        recommendEdgeData = [];
    }
    else{
        recommendEdgeData = await getNextNodeAccuracy(clickedNode);
    }
    
    const recommendEdgeGroup = d3.select("#architecture").selectAll(".recommendLine").data(recommendEdgeData);
    
    //ENTER
    const recommendEdgeGroupEnter = recommendEdgeGroup.enter().append("g")
        .attr("class", "recommendLine")
    
    recommendEdgeGroupEnter
        .append("line")
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "10,10")
        .attr("d", "M5 40 l215 0")
        .attr("stroke", "gray")
        .style("marker-end", "url(#endRecommend)")

    recommendEdgeGroupEnter
        .append("text")
        .text(d => new String(d.candidateMatrixAccuracy).slice(0,5))
        .attr("fill", "gray")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("font-family", "Roboto")
        .attr("transform", d => "translate("+[(d.x1 + d.x2)/2, (d.y1 + d.y2)/2]+")" );
    

    //EXIT
    recommendEdgeGroup.exit().remove()
}

function drawEdge(target){
    let edgeData, edge;
    if (target == 0){
        edgeData = getEdgeData();
        edge = d3.select("#architecture").selectAll("line").data(edgeData);
    }
    else{
        edgeData = getRecommendEdgeData(target);
        edge = d3.select("#recommend" + target).selectAll("line").data(edgeData);
    }
     
    //UPDATE
    edge        
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
    
    //ENTER
    edge
        .enter()
        .append("line")
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.x1)
        .attr("y1", d => d.y1)
        .attr("x2", d => d.x2)
        .attr("y2", d => d.y2)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .style("marker-end", "url(#end)")
        .on("mouseover", edgeInteraction.edgeMouseOver)
        .on("mouseout", edgeInteraction.edgeMouseOut)
        .on("click", edgeInteraction.edgeClicked);

    //EXIT
    edge.exit().remove()
}

function drawNode(target){
    let nodeData, nodeGroups;
    if (target == 0){
        nodeData = getNodeData();
        nodeGroups = d3.select("#architecture").selectAll(".node").data(nodeData);
    }
    else{
        nodeData = getRecommendNodeData(target);
        nodeGroups = d3.select("#recommend" + target).selectAll(".node").data(nodeData);
    }
    const radius = 40;
    //INIT
    
    //UPDATE
    nodeGroups
        .attr("id", d=>"node"+d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" )
        

    nodeGroups.select("text")
        .text(d => d.name);
    
    nodeGroups.select("circle")
        .style("filter", (d)=>{
            if(d.status == null){
                return "url(#drop-shadow)";
            } 
            else if (d.status == 'ext'){
                return "url(#drop-shadow-ext)"
            }
            else if (d.status == 'clicked'){
                return "url(#drop-shadow-start)"
            }
        });

    //ENTER
    const nodeGroupsEnter = nodeGroups.enter().append("g")
        .attr("id", d=>"node"+d.id)
        .attr("transform", d => "translate("+[d.x, d.y]+")" )
        .attr("class", "node")
        .call(
            d3.drag()
            .on("start", nodeInteraction.dragNodeStart)
            .on("drag", nodeInteraction.dragNode)
            .on("end", nodeInteraction.dragNodeEnd)
        )
        .on("click", nodeInteraction.clickedNode);
    
    nodeGroupsEnter.append("circle")
        .attr("r", radius)
        .attr("fill", "white")
        .style("filter", (d)=>{
            if(d.status == null){
                return "url(#drop-shadow)";
            } 
            else if (d.status == 'ext'){
                return "url(#drop-shadow-ext)"
            }
            else if (d.status == 'clicked'){
                return "url(#drop-shadow-start)"
            }
        });

    nodeGroupsEnter.append("text")
        .text(d => d.name)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 11)
        .attr("font-family", "Roboto");
    
    //EXIT
    nodeGroups.exit().remove();
}


export default async function drawObject(clickedNode, target=0){
    drawNode(target);
    drawEdge(target);
    await drawRecommend(clickedNode);
    d3.selectAll(".node").raise();
}

