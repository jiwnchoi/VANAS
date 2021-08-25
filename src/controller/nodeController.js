import { getEdgeData, getNodeData } from "../data/data";
import { reorderData } from "../data/dataProcessing";
import { getRecommendNodeData } from "../data/recommendCellData";

function addNode(nodeType, target=0){
    let nodeData;
    if (target==0){
        nodeData = getNodeData();
    }
    else{
        nodeData = getRecommendNodeData(target);
    }

    
    if (nodeData.length > 6){
        return 0;
    }
    let nodeName = null;
    if(nodeType == 'conv1x1-bn-relu') nodeName = '1X1 CONV';
    if(nodeType == 'conv3x3-bn-relu') nodeName = '3X3 CONV';
    if(nodeType == 'maxpool3x3') nodeName = '3X3 MAXPOOL';

    const newData = {
        id : nodeData[nodeData.length-1].id+1,
        type : nodeType,
        name : nodeName,
        x : Math.random() * 400 + 200,
        y : Math.random() * 350 + 100,
    }
    nodeData.push(newData);
    return 1;
}

function deleteNode(nodeIndex){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    
    for (let i=0; i<nodeData.length; i++){
        if(nodeData[i].id == nodeIndex){
            nodeData.splice(i, 1);
        }
    }

    for (let i=0; i<edgeData.length; i++){
        if(edgeData[i].sourceNode == nodeIndex || edgeData[i].targetNode == nodeIndex){
            edgeData.splice(i,1);
            i--;
        }
    }
}

export {addNode, deleteNode};
