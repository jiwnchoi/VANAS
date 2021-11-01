import { getEdgeData, getNodeData, initEdgeData, initNodeData } from "../data/data";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";
import printRecommendation from "../view/printRecommendation";
import printResult from "../view/printResult";
import { addEdge } from "./edgeController";
import { addNode } from "./nodeController";



function copyCelltoMain(i) {
    const recommendNodeData = getRecommendNodeData(i + 1);
    const recommendEdgeData = getRecommendEdgeData(i + 1);
    const emptyEdgeData = initEdgeData();
    const emptyNodeData = initNodeData();
    emptyNodeData.splice(0);

    for (let node of recommendNodeData) {
        emptyNodeData.push(node);
    }
    for (let edge of recommendEdgeData) {
        emptyEdgeData.push(edge);
    }
    printResult();
    printRecommendation();
}

function initCell(target = 0) {
    let nodeData, edgeData;
    if (target == 0) {
        nodeData = getNodeData();
        edgeData = getEdgeData();
    }
    else {
        nodeData = getRecommendNodeData(target);
        edgeData = getRecommendEdgeData(target);
    }
    nodeData.splice(2, nodeData.length);
    nodeData[0].indegree = 0;
    nodeData[0].outdegree = 0;
    nodeData[1].indegree = 0;
    nodeData[1].outdegree = 0;
    edgeData.splice(0, edgeData.length);
}


//ops랑 matrix는 decode된 것을 넣어야 합니다. 
//./data/dataProcessing의 decodeOperations와 decodeMatrix 함수를 이용해서 넣어주면 됩니다.
function setCell(ops, matrix, target = 0) {
    initCell(target);
    const operations = ops.slice(1, ops.length - 1);

    for (let op of operations) {
        addNode(op, target);
    }

    for (let i = 0; i < matrix.length - 1; i++) {
        for (let j = i + 1; j < matrix.length; j++) {
            if (matrix[i][j] == 1 || matrix[i][j] == "1") {
                if (i == 0 && j == matrix.length - 1) addEdge(0, 1, target);
                else if (i == 0) addEdge(0, j + 1, target);
                else if (j == matrix.length - 1) addEdge(i + 1, 1, target);
                else addEdge(i + 1, j + 1, target);
            }
        }
    }

    if(target == 0){
    }
}

export { setCell, initCell, copyCelltoMain };