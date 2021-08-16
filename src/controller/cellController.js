import { getEdgeData, getNodeData } from "../data/data";
import { makeEdge } from "../view/makeObject";
import { addNode } from "./nodeController";

function initCell(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    nodeData.splice(2,nodeData.length);
    edgeData.splice(0,edgeData.length);
}

function setCell(ops, matrix){
    initCell();
    const operations = ops.slice(1,ops.length-1);

    for (let op of operations){
        addNode(op);
    }

    for (let i=0; i<matrix.length; i++){
        for(let j=i+1; j<matrix.length; j++){
            if (matrix[i][j] == 1){
                if (i == 0){
                    makeEdge(0, j+1);
                }
                else if(j == matrix.length-1){
                    makeEdge(i+1, 1);
                }
                else{
                    makeEdge(i+1, j+1);
                }
            }
        }
    }
}

export {setCell, initCell};