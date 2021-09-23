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
            if(edge.target.index == top && !visited.has(edge.source.index)){
                visited.add(edge.source.index);
                frontier.push(edge.source.index);
            }
        }
    }

    if (visited.has(0)) return visited;
    else return null;
}


function createCandidateMatrix(curruntNode, targetNode){
    const nodeData = getNodeData();
    const newEdgeData = getEdgeData().slice();
    let source, target;
    if (targetNode != 1){
        for (let node of nodeData){
            if (node.index == targetNode) source = node;
            if (node.index == 1) target = node;
        }
        newEdgeData.push(
            {
                source,
                target
            }
        );
    }
    for (let node of nodeData){
            if (node.index == targetNode) target = node;
            if (node.index == curruntNode) source = node;
        }
    newEdgeData.push({
        source,
        target,
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
        if (path.has(targetNode.index)){
            continue;
        }
        let pass = 0;
        for (let edge of edgeData){
            if(edge.source.index == curruntNode && edge.target.index == targetNode.index){
                pass = 1;
            }
        }
        if (pass) continue;

        const matrixandops = createCandidateMatrix(curruntNode, targetNode.index);
        const candidateMatrixAccuracy = await getAccuracy(matrixandops).then(
            json => json.test_accuracy
        );
        
        const isDirect = targetNode.index == 1 ? 1 : 0;

        result.push({
                source : nodeData.filter((d, i) => d.index == curruntNode)[0],
                target : targetNode,
                label : 1,
                candidateMatrixAccuracy
            });

        if (isDirect != 1){
            result.push({
                source : targetNode,
                target : nodeData[1],
                label : 0,
                candidateMatrixAccuracy
            });
        }
        
    }
    return result;

}

export { getNextNodeAccuracy };