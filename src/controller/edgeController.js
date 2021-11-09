import { getEdgeData, getNodeData } from "../data/data";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";


function addEdge(sourceNode, targetNode, targetCell=0){
    let nodeData, edgeData;
    if (targetCell == 0){
        nodeData = getNodeData();
        edgeData = getEdgeData();
    } 
    else{
        nodeData = getRecommendNodeData(targetCell);
        edgeData = getRecommendEdgeData(targetCell);
    }

    if (sourceNode == targetNode){
        return 0;
    }
    let source, target;
    for (let node of nodeData){
        if (node.index == sourceNode){
            source = node;
        }
        if(node.index == targetNode){
            target = node;
        }
    }

    const newEdge = {
        source,
        target,
        isExt : false,
        isDelete : null,
    }
    edgeData.push(newEdge);
}

function deleteEdge(deleteEdge){
    const edgeData = getEdgeData();
    for (let i=0; i<edgeData.length; i++){
        if (edgeData[i] == deleteEdge){

            edgeData.splice(i,1);
            break;
        }
    }
}

function isEdgeExists(sourceNode, targetNode){
    const edgeData = getEdgeData();
    for (let edge of edgeData){
        if ((edge.source.index == sourceNode && edge.target.index == targetNode)
            ||
            (edge.source.index == targetNode && edge.target.index == sourceNode)){
                return true;
            }
    }
    return false;
}


export { addEdge, deleteEdge, isEdgeExists };