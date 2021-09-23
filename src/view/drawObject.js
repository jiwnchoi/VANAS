import * as d3 from "d3";

import { getNodeData, getEdgeData } from "../data/data.js"

import * as nodeInteraction from "./interaction/nodeInteraction.js"
import * as edgeInteraction from "./interaction/edgeInteraction.js"
import { getNextNodeAccuracy } from "../data/recommendNextNode.js";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData.js";

async function drawNextEdge(clickedNode){
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
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "10,10")
        .attr("d", "M5 40 l215 0")
        .attr("stroke", "gray")
        .style("marker-end", d =>{
            if (d.label == 0 || d.source.index==0 && d.target.index ==1) return "url(#endRecommend)";
            else return null;
        })

    recommendEdgeGroupEnter
        .append("text")
        .text(d => {
            if (d.label == 0){
                return "";
            }
            else return new String(d.candidateMatrixAccuracy).slice(0,5);

        })
        .attr("fill", "gray")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("font-family", "Roboto")
        .attr("transform", d => "translate("+[(d.source.x + d.target.x)/2, (d.source.y + d.target.y)/2]+")" );
    

    //EXIT
    recommendEdgeGroup.exit().remove()
}

function drawEdge(target = 0){
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
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", (d) => {
            if (d.isDelete == 'delete'){
                return "tomato";
            }
            else if (d.isExt == 'ext'){
                return 'orange';
            }
            else{
                return 'black';
            }
        })
        .style("marker-end", (d) => {
            if (d.isDelete == 'delete'){
                return 'url(#endDelete)'
            }
            else if (d.isExt == 'ext'){
                return 'url(#endExt)';
            }
            else{
                return "url(#end)";
            }
        })
    
    //ENTER
    edge
        .enter()
        .append("line")
        .attr("class", d => d.edgeClassName)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke-width", 3)
        .attr("stroke", (d) => {
            if (d.isDelete == 'delete'){
                return "tomato";
            }
            else if (d.isExt == 'ext'){
                return 'orange';
            }
            else{
                return 'black';
            }
        })
        .style("marker-end", (d) => {
            if (d.isDelete == 'delete'){
                return 'url(#endDelete)'
            }
            else if (d.isExt == 'ext'){
                return 'url(#endExt)';
            }
            else{
                return "url(#end)";
            }
        })
        .on("mouseover", edgeInteraction.edgeMouseOver)
        .on("mouseout", edgeInteraction.edgeMouseOut)
        .on("click", edgeInteraction.edgeClicked);

    //EXIT
    edge.exit().remove()
}

function drawNode(target = 0){
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
        .attr("id", d=>"node"+d.index)
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
        .attr("id", d=>"node"+d.index)
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
    d3.selectAll(".node").raise();
    await drawNextEdge(clickedNode);
    d3.selectAll(".node").raise();
}

export function drawObjectwithForce(clickedNode, target = 0){
    calaulateForce(target);
    drawNode(target);
    drawEdge(target);
    d3.selectAll(".node").raise();
}

export function calaulateForce(target){
    let nodeData, edgeData;
    
    if (target){
        nodeData = getRecommendNodeData(target);
        edgeData = getRecommendEdgeData(target);
    }
    else{
        nodeData = getNodeData();
        edgeData = getEdgeData();
    }
    
    const simulation = d3.forceSimulation(nodeData)
        .force('charge', d3.forceManyBody())
        .force('collison', d3.forceCollide(120))
        .force('link', d3.forceLink(edgeData))
        .force('center', d3.forceCenter(400, 300))
        .stop()
        .tick(10000)
    
}

