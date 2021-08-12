import { getEdgeData, getNodeData } from "./data";

Set.prototype.intersection = function(setB) {
        var intersection = new Set();
        for (var elem of setB) {
            if (this.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    }

    Set.prototype.difference = function(setB) {
        var difference = new Set(this);
        for (var elem of setB) {
            difference.delete(elem);
        }
        return difference;
    }


function convertEdgeDataToMatrix(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    
    console.log("convertEdgeDataToMatrix")
    const matrix = [];

    for (let i=0; i<nodeData.length; i++){
        const row = [];
        for (let j=0; j<nodeData.length; j++){
            row.push(0);
        }
        matrix.push(row);
    }

    for (let edge of edgeData){
        if (edge.sourceNode < edge.targetNode){
            matrix[edge.sourceNode][edge.targetNode] = 1;
        }
        else{

            
            matrix[edge.targetNode][edge.sourceNode] = 1;
        }
    }
    console.log(edgeData);
    for (let row of matrix){
        console.log(row);
    }

    return matrix;
}

function createMatrix(cellStatus){
    const originalNodeData = getNodeData();
    const originalEdgeData = getEdgeData();
    const ops = [];
    
    const nodeData = originalNodeData.slice();
    const edgeData = originalEdgeData.slice();
    for (let ext of cellStatus.extraneous){
        for (let i=0; i<nodeData.length; i++){
            if (nodeData[i].id == ext){
                nodeData.splice(i,1);
                i--;
            }
        }
        for (let i=0; i<edgeData.length; i++){
            if (edgeData[i].sourceNode == ext || 
                edgeData[i].targetNode == ext){
                edgeData.splice(i,1);
                i--;
            }
        }
    }

    //Topological Sort by DFS
    const visitedFromInput = [0]
    const frontier = [0];
    const topologicalSort = [];

    while (frontier.length > 0){
        let hasChildren = 0;
        const top = frontier[frontier.length-1];
        for (let edge of edgeData){
            if (edge.sourceNode == top && (visitedFromInput.indexOf(edge.targetNode) == -1)){
                visitedFromInput.push(edge.targetNode);
                frontier.push(edge.targetNode);
                hasChildren = 1;
                break;
            }
        }
        if (!hasChildren){
            topologicalSort.push(frontier.pop());
        }

    }
    topologicalSort.reverse();
    console.log(topologicalSort);

    const matrix = [];
    for (let i=0; i<nodeData.length; i++){
        const row = [];
        for (let j=0; j<nodeData.length; j++){
            row.push(0);
            
        }
        ops.push(null);
        matrix.push(row);
    }

    for (let i=0; i<nodeData.length; i++){
        const sortedSourceNodeId = i;
        const objectNodeId = topologicalSort[i];
        for (let node of originalNodeData){
            if(node.id == objectNodeId){ 
                ops[sortedSourceNodeId] = node.type;
            }
        }
        for (let edge of edgeData){
            if (edge.sourceNode == objectNodeId){
                const sortedTargetNodeId = topologicalSort.indexOf(edge.targetNode);
                matrix[sortedSourceNodeId][sortedTargetNodeId] = 1;
            }
        }

    }
    console.log(matrix)
    console.log(ops)
    return [matrix, ops];
}
function cellSainityCheck(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    console.log(nodeData);
    console.log(edgeData);
    const numNodes = nodeData.length;
    const numEdges = edgeData.length;
    
    const cellStatus = {
        isConnected : null,
        numEdges,
        numNodes,
        extraneous : [],
    }

    //input부터 DFS
    const visitedFromInput = new Set([0]);
    const frontierInput = [0];
    while (frontierInput.length > 0){
        const top = frontierInput.pop();

        for (let edge of edgeData){
            if(edge.sourceNode == top && !visitedFromInput.has(edge.targetNode)){
                visitedFromInput.add(edge.targetNode);
                frontierInput.push(edge.targetNode);
            }
        }
    }
    //output부터 DFS
    const visitedFromOutput = new Set([1]);
    const frontierOutput = [1];
    while (frontierOutput.length > 0){
        const top = frontierOutput.pop();
        
        for (let edge of edgeData){
            if(edge.targetNode == top && !visitedFromOutput.has(edge.sourceNode)){
                visitedFromOutput.add(edge.sourceNode);
                frontierOutput.push(edge.sourceNode);
            }
        }
    }
    //path상에 존재하지 않는 노드(extraneous) 연산
    const allNodeId = [];
    for (let node of nodeData){
        allNodeId.push(node.id);
    }
    const extraneous = new Set(allNodeId).difference(
        visitedFromInput.intersection(visitedFromOutput)
    );

    // path상의 노드가 2개 미만이면 연결되어있지 않음
    cellStatus.extraneous = Array.from(extraneous);
    cellStatus.extraneous.sort((a,b) => a-b);
    if (numNodes -  cellStatus.extraneous.length < 2){
        cellStatus.isConnected = false;
    }
    else{
        cellStatus.isConnected = true;
    }

    return cellStatus;
}


export {createMatrix, cellSainityCheck, convertEdgeDataToMatrix};


