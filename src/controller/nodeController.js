import { getNodeData } from "../data/data";
import { reorderData } from "../data/dataProcessing";

function addNode(nodeType){
    const nodeData = getNodeData();
    if (nodeData.length > 6){
        return 0;
    }
    let nodeName = null;
    if(nodeType == 'conv1x1-bn-relu') nodeName = '1X1 CONV';
    if(nodeType == 'conv3x3-bn-relu') nodeName = '3X3 CONV';
    if(nodeType == 'maxpool3x3') nodeName = '3X3 MAXPOOL';

    const newData = {
        id : nodeData.length,
        type : nodeType,
        name : nodeName,
        x : Math.random() * 400 + 200,
        y : Math.random() * 350 + 100,
    }
    nodeData.push(newData);
    reorderData();
}

function deleteNode(nodeIndex){
    for (let i=0; i<nodeData.length; i++){
        if(nodeData[i].id == nodeIndex){
            nodeData.splice(i, 1);
        }
    }
    reorderData();
}

export {addNode, deleteNode};
