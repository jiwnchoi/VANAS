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

function reorderData(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    
    //Topological Sort by DFS
    const visitedFromInput = [0]
    const frontier = [0];
    const topologicalSort = [];

    while (frontier.length > 0){
        const top = frontier[-1];
        let isIndegree = true;
        for (let edge of edgeData){
            if (edge.sourceNode == top && !visitedFromInput.has(edge.targetNode)){
                visitedFromInput.push(edge.targetNode);
                frontier.push(edge.targetNode);
                isIndegree = false;
            }
        }

        if (isIndegree){
            topologicalSort.push(top);
            const idx = frontier.indexOf(top);
            frontier.splice(idx, 1);
        }
    }
    topologicalSort.reverse();

    //reorder edge sourcenode
    for (let i=0;i<nodeData.length;i++){
        for (let edge of edgeData){
            if(edge.sourceNode == i) edge.sourceNode = topologicalSort[i];
        }
    }

    //reorder edge targetnode
    for (let i=0;i<nodeData.length;i++){
        for (let edge of edgeData){
            if(edge.targetNode == i) edge.targetNode = topologicalSort[i];
        }
    }
    
    //reorder node
    for (let node of nodeData){
        node.id = topologicalSort[node.id];
    }

}


function convertEdgeDataToMatrix(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();

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

    for (let row of matrix){
        console.log(row);
    }

    return matrix;
}

function cellSainityCheck(){

    const edgeData = getEdgeData();

    const matrix = convertEdgeDataToMatrix();


    const numNodes = matrix.length;
    const cellStatus = {
        matrix,
        isConnected : null,
        numEdge : null,
        extraneous : [],
    }
    //input부터 DFS
    const visitedFromInput = new Set([0]);
    const frontierInput = [0];
    console.log(visitedFromInput, frontierInput)
    while (frontierInput.length > 0){
        const top = frontierInput.pop();
        for (let v=top+1; v<numNodes; v++){
            if (matrix[top][v] && !visitedFromInput.has(v)){
                visitedFromInput.add(v);
                frontierInput.push(v);
            }
        }
    }
    //output부터 DFS
    const visitedFromOutput = new Set([numNodes-1]);
    const frontierOutput = [numNodes-1];
    while (frontierOutput.length > 0){
        const top = frontierOutput.pop();
        for (let v=0; v<top; v++){
            if (matrix[v][top] && !visitedFromOutput.has(v)){
                visitedFromOutput.add(v);
                frontierOutput.push(v);
            }
        }
    }
    console.log(visitedFromInput, visitedFromOutput);
    //path상에 존재하지 않는 노드(extraneous) 연산
    const extraneous = new Set([...Array(numNodes).keys()]).difference(
        visitedFromInput.intersection(visitedFromOutput)
    );


    // path상의 노드가 2개 미만이면 연결되어있지 않음
    cellStatus.extraneous = Array.from(extraneous);
    if (numNodes -  cellStatus.extraneous.length < 2){
        cellStatus.isConnected = false;
    }
    else{
        cellStatus.isConnected = true;
    }
    

    let count = 0;
    for (let i=0; i<numNodes; i++){
        for (let j=0; j<numNodes; j++){
            if (matrix[i][j]){
                count ++;
            }
        }
    }
    cellStatus.numEdge = count;

    return cellStatus;

}

export {reorderData, cellSainityCheck, convertEdgeDataToMatrix};


