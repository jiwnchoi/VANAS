
import * as d3 from "d3";

const nodeData = [{
                    id : 0,
                    type : "input",
                    name : "INPUT",
                    x : 100,
                    y : 200,
                },
                {
                    id : 1,
                    type : "output",
                    name : "OUTPUT",
                    x : 700,
                    y : 200,
                }];

const edgeData = [

]



function reorderData(){
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

export function cellSainityCheck(){
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



export function getNodeData(){
    return nodeData;
}

export function addNode(nodeType){
    if (nodeData.length > 7){
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

export function deleteNode(nodeIndex){
    for (let i=0; i<nodeData.length; i++){
        if(nodeData[i].id == nodeIndex){
            nodeData.splice(i, 1);
        }
    }
    reorderData();
}



export function getEdgeData(){
    return edgeData;
}

export function addEdge(sourceNode, targetNode){

    if (sourceNode == targetNode){
        return 0;
    }
    const edgeClassName = "sourcenode"+sourceNode+" targetnode"+targetNode
    const newEdge = {
        sourceNode,
        targetNode,
        edgeClassName,
        x1 : nodeData.filter((d, i) => {
                return d.id == sourceNode;
            })[0].x,
        y1 : nodeData.filter((d, i) => {
                return d.id == sourceNode;
            })[0].y,
        x2 : nodeData.filter((d, i) => {
                return d.id == targetNode;
            })[0].x,
        y2 : nodeData.filter((d, i) => {
                return d.id == targetNode;
            })[0].y,
    }
    edgeData.push(newEdge);
    return 1;
}

export function deleteEdge(edgeClassName){
    for (let i=0; i<edgeData.length; i++){
        if (edgeData[i].edgeClassName == edgeClassName){
            edgeData.splice(i,1);
            break;
        }
    }
}

export function isEdgeExists(sourceNode, targetNode){
    for (let edge of edgeData){
        if ((edge.sourceNode == sourceNode && edge.targetNode == targetNode)
            ||
            (edge.sourceNode == targetNode && edge.targetNode == sourceNode)){
                return true;
            }
    }
    return false;
}

export function updateEdge(node){
    for (let edge of edgeData){
        if (edge.sourceNode == node){
            edge.x1 = nodeData[node].x;
            edge.y1 = nodeData[node].y;
        }
        if (edge.targetNode == node){
            edge.x2 = nodeData[node].x;
            edge.y2 = nodeData[node].y;
        }
    }
    return 0;
}




//http://192.168.0.54:5000/querying
//https://8d11125fda1a.ngrok.io/querying

export function getAccuracy(matrix){
    const ops = nodeData.map(x => x.type);

    d3.json('http://192.168.0.54:5000/querying', {
        method : "POST",
        body : JSON.stringify({
            ops : ops,
            matrix : matrix,
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(json => {
        d3.select("#analytics")
            .attr("class", "alert bg-light alert-secondary")
        d3.select("#trainable_parameters")
            .text(json.trainable_parameters)
        d3.select("#training_time")
            .text(json.training_time)
        d3.select("#train_accuracy")
            .text(json.train_accuracy)
        d3.select("#validation_accuracy")
            .text(json.validation_accuracy)
        d3.select("#test_accuracy")
            .text(json.test_accuracy)
    })
}