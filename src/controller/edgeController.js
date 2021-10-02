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
    const edgeClassName = "sourcenode"+sourceNode+" targetnode"+targetNode
    const newEdge = {
        source,
        target,
        edgeClassName,
        isExt : false,
        isDelete : null,
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
        if ((edge.source.index == sourceNode && edge.target.index == targetNode)
            ||
            (edge.source.index == targetNode && edge.target.index == sourceNode)){
                return true;
            }
    }
    return false;
}

// function updateEdge(nodeNum){
//     const edgeData = getEdgeData();
//     const nodeData = getNodeData();
//     let node = null;
//     for (let n of nodeData){
//         if (n.index == nodeNum){
//             node = n;
//         }
//     }
//     for (let edge of edgeData){
//         if (edge.source == node.index){
//             edge.x1 = node.x;
//             edge.y1 = node.y;
//         }
//         if (edge.target == node.index){
//             edge.x2 = node.x;
//             edge.y2 = node.y;
//         }
//     }
//     return 0;
// }

export { addEdge, deleteEdge, isEdgeExists };