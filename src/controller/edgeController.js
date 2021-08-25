import { getEdgeData, getNodeData } from "../data/data";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";


function addEdge(sourceNode, targetNode, target=0){
    let nodeData, edgeData;
    if (target == 0){
        nodeData = getNodeData();
        edgeData = getEdgeData();
    } 
    else{
        nodeData = getRecommendNodeData(target);
        edgeData = getRecommendEdgeData(target);
    }
    
    console.log(nodeData, edgeData);

    if (sourceNode == targetNode){
        return 0;
    }
    const edgeClassName = "sourcenode"+sourceNode+" targetnode"+targetNode
    const newEdge = {
        sourceNode,
        targetNode,
        edgeClassName,
        x1 : nodeData.filter((d, i) => {
                return d.id == sourceNode;
            })[0].x,
        y1 : nodeData.filter((d, i) => { 
                return d.id == sourceNode;
            })[0].y,
        x2 : nodeData.filter((d, i) => {
                return d.id == targetNode;
            })[0].x,
        y2 : nodeData.filter((d, i) => {
                return d.id == targetNode;
            })[0].y,
    }
    edgeData.push(newEdge);
}

function deleteEdge(edgeClassName){
    const edgeData = getEdgeData();
    for (let i=0; i<edgeData.length; i++){
        if (edgeData[i].edgeClassName == edgeClassName){
            edgeData.splice(i,1);
            break;
        }
    }
}

function isEdgeExists(sourceNode, targetNode){
    const edgeData = getEdgeData();
    for (let edge of edgeData){
        if ((edge.sourceNode == sourceNode && edge.targetNode == targetNode)
            ||
            (edge.sourceNode == targetNode && edge.targetNode == sourceNode)){
                return true;
            }
    }
    return false;
}

function updateEdge(nodeNum){
    const edgeData = getEdgeData();
    const nodeData = getNodeData();
    let node = null;
    for (let n of nodeData){
        if (n.id == nodeNum){
            node = n;
        }
    }
    for (let edge of edgeData){
        if (edge.sourceNode == node.id){
            edge.x1 = node.x;
            edge.y1 = node.y;
        }
        if (edge.targetNode == node.id){
            edge.x2 = node.x;
            edge.y2 = node.y;
        }
    }
    return 0;
}

export { addEdge, deleteEdge, isEdgeExists, updateEdge };