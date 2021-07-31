import { getEdgeData, getNodeData } from "../data/data";


function addEdge(sourceNode, targetNode){ 
    const nodeData = getNodeData();
    const edgeData = getEdgeData();

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
    return 1;
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

function updateEdge(node){
    const edgeData = getEdgeData();
    const nodeData = getNodeData();
    for (let edge of edgeData){
        if (edge.sourceNode == node){
            edge.x1 = nodeData[node].x;
            edge.y1 = nodeData[node].y;
        }
        if (edge.targetNode == node){
            edge.x2 = nodeData[node].x;
            edge.y2 = nodeData[node].y;
        }
    }
    return 0;
}

export { addEdge, deleteEdge, isEdgeExists, updateEdge };