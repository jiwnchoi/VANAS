import { getEdgeData, getNodeData } from "../data/data";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";
import { addEdge } from "./edgeController";
import { addNode } from "./nodeController";

function initCell(target=0){
    let nodeData, edgeData;
    if (target==0){
        nodeData = getNodeData();
        edgeData = getEdgeData();
    }
    else{
        nodeData = getRecommendNodeData(target);
        edgeData = getRecommendEdgeData(target);
    }
    nodeData.splice(2,nodeData.length);
    edgeData.splice(0,edgeData.length);
}

function setCell(ops, matrix, target=0){
    initCell(target);
    const operations = ops.slice(1,ops.length-1);

    for (let op of operations){
        addNode(op, target);
    }

    for (let i=0; i<matrix.length; i++){
        for(let j=i+1; j<matrix.length; j++){
            if (matrix[i][j] == 1){
                if (i == 0){
                    addEdge(0, j, target);
                }
                else if(j == matrix.length-1){
                    addEdge(i+1, 1, target);
                }
                else{
                    addEdge(i+1, j+1, target);
                }
            }
        }
    }
}

export {setCell, initCell};