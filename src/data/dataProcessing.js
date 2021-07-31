import { getEdgeData, getNodeData } from "./data";


function reorderData(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
    
    for (let i=1; i<nodeData.length; i++){
        if (i!=nodeData.length-1 && nodeData[i].type == "output"){
            const outputNode = nodeData[i];
            nodeData.splice(i,1);
            nodeData.push(outputNode);
            i--;
            continue;
        }
        for (let j=0; j<edgeData.length; j++){
            if (edgeData[j].sourceNode == nodeData[i].id){
                edgeData[j].sourceNode = i;
                const edgeClassName = "sourcenode"+i+" targetnode"+edgeData[j].targetNode;
                edgeData[j].edgeClassName = edgeClassName;
            }
            if (edgeData[j].targetNode == nodeData[i].id){
                edgeData[j].targetNode = i;
                const edgeClassName = "sourcenode"+edgeData[j].sourceNode+" targetnode"+i;
                edgeData[j].edgeClassName = edgeClassName;
            }
        }
        nodeData[i].id = i;
    }

}

function convertEdgeDataToMatrix(){
    const nodeData = getNodeData();
    const edgeData = getEdgeData();
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
    if (numNodes -  cellStatus.extraneous.length > numNodes -2){
        cellStatus.isConnected = true;
    }
    else{
        cellStatus.isConnected = false;
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


