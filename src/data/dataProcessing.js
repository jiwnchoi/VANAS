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



function createMatrix(extraneous, originalNodeData, originalEdgeData){
    const ops = [];
    
    const nodeData = originalNodeData.slice();
    const edgeData = originalEdgeData.slice();
    for (let ext of extraneous){
        for (let i=0; i<nodeData.length; i++){
            if (nodeData[i].index == ext){
                nodeData.splice(i,1);
                i--;
            }
        }
        for (let i=0; i<edgeData.length; i++){
            if (edgeData[i].source.index == ext || 
                edgeData[i].target.index == ext){
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
            if (edge.source.index == top && (visitedFromInput.indexOf(edge.target.index) == -1)){
                visitedFromInput.push(edge.target.index);
                frontier.push(edge.target.index);
                hasChildren = 1;
                break;
            }
        }
        if (!hasChildren){
            topologicalSort.push(frontier.pop());
        }
    }
    topologicalSort.reverse();

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
            if(node.index == objectNodeId){ 
                ops[sortedSourceNodeId] = node.type;
            }
        }
        for (let edge of edgeData){
            if (edge.source.index == objectNodeId){
                const sortedTargetNodeId = topologicalSort.indexOf(edge.target.index);
                matrix[sortedSourceNodeId][sortedTargetNodeId] = 1;
            }
        }

    }

    return [matrix, ops];
}



function cellSainityCheck(nodeData, edgeData){
    if (nodeData == null) nodeData = getNodeData();
    if (edgeData == null) edgeData = getEdgeData();

    

    const numNodes = nodeData.length;
    const numEdges = edgeData.length;
    
    const cellStatus = {
        isConnected : null,
        isAcyclic : true,
        numEdges,
        numNodes,
        extraneous : [],
    }

    //input부터 DFS
    const visitedFromInput = [0];
    const frontierInput = [0];
    while (frontierInput.length > 0){
        let hasChildren = 0;
        const top = frontierInput[frontierInput.length-1];
        visitedFromInput.push(top);
        for (let edge of edgeData){
            if(edge.source.index == top){
                if (frontierInput.indexOf(edge.target.index) != -1){
                    cellStatus.isConnected = false;
                    cellStatus.isAcyclic = false;
                    cellStatus.extraneous = frontierInput.slice(frontierInput.indexOf(edge.target.index));
                    cellStatus.extraneous.push(top);
                    return cellStatus;
                }
                if (visitedFromInput.indexOf(edge.target.index) == -1){
                    
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
    while (frontierOutput.length > 0){
        const top = frontierOutput.pop();
        
        for (let edge of edgeData){
            if(edge.target.index == top && !visitedFromOutput.has(edge.source.index)){
                visitedFromOutput.add(edge.source.index);
                frontierOutput.push(edge.source.index);
            }
        }
    }
    //path상에 존재하지 않는 노드(extraneous) 연산
    const allNodeId = [];
    for (let node of nodeData){
        allNodeId.push(node.index);
    }
    const extraneous = new Set(allNodeId).difference(
        visitedFromOutput.intersection(new Set(visitedFromInput))
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


export {createMatrix, cellSainityCheck};


