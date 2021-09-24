import { getEdgeData, getNodeData } from "../data/data";
import { getRecommendEdgeData, getRecommendNodeData } from "../data/recommendCellData";
import { addEdge } from "./edgeController";
import { addNode } from "./nodeController";

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
    edgeData.splice(0, edgeData.length);
}

function setCell(ops, _matrix, target = 0) {
    initCell(target);
    const operations = ops;

    for (let op of operations) {
        addNode(op, target);
    }
    let matrix = [];
    let matrixLength = _matrix.length / 3;
    for (let i = 0; i < matrixLength; i++) {
        let _line = _matrix[3 * i + 0] + _matrix[3 * i + 1] + _matrix[3 * i + 2];
        let line = parseInt(_line).toString(2).padStart(matrixLength, '0');
        matrix.push(line);
    }

    for (let i = 0; i < matrixLength; i++) {
        for (let j = i + 1; j < matrixLength; j++) {
            if (matrix[i][j] == 1) {
                if (i == 0 && j == matrixLength - 1) addEdge(0, 1, target);
                else if (i == 0) addEdge(0, j + 1, target);
                else if (j == matrixLength - 1) addEdge(i + 1, 1, target);
                else addEdge(i + 1, j + 1, target);
            }
        }
    }
}

export { setCell, initCell };