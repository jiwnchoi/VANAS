import { getEdgeData, getNodeData } from "./data";

Set.prototype.intersection = function (setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function (setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}


function isCompleteCell(nodeData, edgeData) {
    const result = cellSainityCheck(nodeData, edgeData);
    if (result.isConnected && result.isAcyclic && result.extraneous.length == 0) {
        return true;
    }
    else {
        return false;
    }

}

function cellSainityCheck(nodeData, edgeData) {
    if (nodeData == null) nodeData = getNodeData();
    if (edgeData == null) edgeData = getEdgeData();

    const numNodes = nodeData.length;
    const numEdges = edgeData.length;

    const cellStatus = {
        isConnected: null,
        isAcyclic: true,
        numEdges,
        numNodes,
        extraneous: [],
    }

    //input부터 DFS
    const visitedFromInput = [0];
    const frontierInput = [0];
    let hasChildren = null;
    while (frontierInput.length > 0) {
        hasChildren = 0;
        const top = frontierInput[frontierInput.length - 1];
        visitedFromInput.push(top);
        for (let edge of edgeData) {
            if (edge.source.index == top) {
                if (frontierInput.indexOf(edge.target.index) != -1) {
                    cellStatus.isConnected = false;
                    cellStatus.isAcyclic = false;
                    cellStatus.extraneous = frontierInput.slice(frontierInput.indexOf(edge.target.index));
                    cellStatus.extraneous.push(top);
                    return cellStatus;
                }
                if (visitedFromInput.indexOf(edge.target.index) == -1) {

                    frontierInput.push(edge.target.index);
                    hasChildren = 1;
                    break;
                }
            }
        }
        if (!hasChildren) frontierInput.pop();
    }


    //output부터 DFS
    const visitedFromOutput = new Set([1]);
    const frontierOutput = [1];
    while (frontierOutput.length > 0) {
        const top = frontierOutput.pop();

        for (let edge of edgeData) {
            if (edge.target.index == top && !visitedFromOutput.has(edge.source.index)) {
                visitedFromOutput.add(edge.source.index);
                frontierOutput.push(edge.source.index);
            }
        }
    }
    //path상에 존재하지 않는 노드(extraneous) 연산
    const allNodeId = [];
    for (let node of nodeData) {
        allNodeId.push(node.index);
    }
    const extraneous = new Set(allNodeId).difference(
        visitedFromOutput.intersection(new Set(visitedFromInput))
    );

    // path상의 노드가 2개 미만이면 연결되어있지 않음
    cellStatus.extraneous = Array.from(extraneous);
    cellStatus.extraneous.sort((a, b) => a - b);
    if (numNodes - cellStatus.extraneous.length < 2) {
        cellStatus.isConnected = false;
    }
    else {
        cellStatus.isConnected = true;
    }

    return cellStatus;
}

function decodeOperations(opsstr) {
    const ops = ['input'];
    const opsarr = String(opsstr).split("");

    for (let op of opsarr) {
        if (op == '2') {
            ops.push('conv1x1-bn-relu');
        }
        else if (op == '3') {
            ops.push('conv3x3-bn-relu');
        }
        else if (op == '4') {
            ops.push('maxpool3x3');
        }
    }
    ops.push('output');
    return ops;
}

function decodeMatrix(edges) {
    let splitEdges = null;
    if (typeof edges == "string") {
        splitEdges = edges.split("");
    } else {
        splitEdges = [];
        for (let edge of edges) {
            splitEdges.push(edge[0]);
            splitEdges.push(edge[1]);
        }
    }
    const nodeIndex = new Set(splitEdges);
    const emptyRow = new Array(nodeIndex.size).fill(0);
    const matrix = [];
    for (let i = 0; i < nodeIndex.size; i++) {
        matrix.push(emptyRow.slice());
    }
    for (let i = 0; i < splitEdges.length; i += 2) {
        matrix[Number(splitEdges[i])][Number(splitEdges[i + 1])] = 1;
    }

    return matrix;
}

function hashingOperations(ops) {
    let res = 0;
    for (let op of ops) {
        if (op == 'conv1x1-bn-relu') {
            res += 100;
        }
        else if (op == 'conv3x3-bn-relu') {
            res += 10;
        }
        else if (op == 'maxpool3x3') {
            res += 1;
        }
    }
    return res.toString().padStart(3, '0');
}

function excludeExtraneous(nodeData, edgeData) {
    const extraneous = cellSainityCheck(nodeData, edgeData).extraneous;

    const newNodeData = nodeData.filter((node) => {
        if (extraneous.indexOf(node.index) == -1) return true;
        else return false;
    })

    const newEdgeData = edgeData.filter((edge) => {
        if (extraneous.indexOf(edge.source.index) != -1 ||
            extraneous.indexOf(edge.target.index) != -1) return false;
        else return true;
    })
    return [newNodeData, newEdgeData];
}

function getChildren(source, edgeData){
    return edgeData.filter(edge => edge.source.index == source)
        .map(edge => edge.index);
}





export { excludeExtraneous, isCompleteCell, cellSainityCheck, decodeMatrix, hashingOperations, decodeOperations };


