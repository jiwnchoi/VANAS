import { getAccuracy } from "../service/getAccuracy";
import { getEdgeData, getNodeData } from "./data";
import { cellSainityCheck, createMatrix } from "./dataProcessing";

function getPathFromInput(curruntNode){
    const edgeData = getEdgeData();
    const visited = new Set([curruntNode]);
    const frontier = [curruntNode];
    while (frontier.length > 0){
        const top = frontier.pop();
        for (let edge of edgeData){
            if(edge.targetNode == top && !visited.has(edge.sourceNode)){
                visited.add(edge.sourceNode);
                frontier.push(edge.sourceNode);
            }
        }
    }

    if (visited.has(0)) return visited;
    else return null;
}


function createCandidateMatrix(curruntNode, targetNode){
    const nodeData = getNodeData();
    const newEdgeData = getEdgeData().slice();
    if (targetNode != 1){
        newEdgeData.push(
            {
                sourceNode : targetNode,
                targetNode : 1
            }
        );
    }
    newEdgeData.push({
        sourceNode : curruntNode,
        targetNode : targetNode,
    });
    return createMatrix(cellSainityCheck(nodeData, newEdgeData).extraneous, nodeData, newEdgeData);
}

async function getNextNodeAccuracy(curruntNode){
    const path = getPathFromInput(curruntNode);

    if (path == null){
        return null;
    }

    const nodeData = getNodeData();
    const edgeData = getEdgeData();

    const result = [];
    for (let targetNode of nodeData){
        if (path.has(targetNode.id)){
            continue;
        }
        const edgeClassName = "sourcenode"+curruntNode+" targetnode"+targetNode.id
        let pass = 0;
        for (let edge of edgeData){
            if(edge.edgeClassName == edgeClassName){
                pass = 1;
            }
        }
        if (pass) continue;

        const matrixandops = createCandidateMatrix(curruntNode, targetNode.id);
        const candidateMatrixAccuracy = await getAccuracy(matrixandops).then(
            json => json.test_accuracy
        );
        
        const isDirect = targetNode.id == 1 ? 1 : 0;

        result.push({
                sourceNode : curruntNode,
                targetNode : targetNode.id,
                edgeClassName,
                x1 : nodeData.filter((d, i) => {
                        return d.id == curruntNode;
                    })[0].x,
                y1 : nodeData.filter((d, i) => { 
                        return d.id == curruntNode;
                    })[0].y,
                x2 : nodeData.filter((d, i) => {
                        return d.id == targetNode.id;
                    })[0].x,
                y2 : nodeData.filter((d, i) => {
                        return d.id == targetNode.id;
                    })[0].y,
                label : 1,
                candidateMatrixAccuracy
            });

        if (isDirect != 1){
            result.push({
                sourceNode : targetNode.id,
                targetNode : 1,
                edgeClassName : "sourcenode"+targetNode.id+" targetnode1",
                x1 : nodeData.filter((d, i) => {
                        return d.id == targetNode.id;
                    })[0].x,
                y1 : nodeData.filter((d, i) => { 
                        return d.id == targetNode.id;
                    })[0].y,
                x2 : nodeData.filter((d, i) => {
                        return d.id == 1;
                    })[0].x,
                y2 : nodeData.filter((d, i) => {
                        return d.id == 1;
                    })[0].y,
                label : 0,
                candidateMatrixAccuracy
            });
        }
        
    }
    return result;

}

export { getNextNodeAccuracy };