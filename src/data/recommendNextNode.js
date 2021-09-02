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
            if(edge.target == top && !visited.has(edge.source.index)){
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
        const edgeClassName = "sourcenode"+curruntNode+" targetnode"+targetNode.index
        let pass = 0;
        for (let edge of edgeData){
            if(edge.edgeClassName == edgeClassName){
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
                sourceNode : curruntNode,
                targetNode : targetNode.index,
                edgeClassName,
                x1 : nodeData.filter((d, i) => {
                        return d.index == curruntNode;
                    })[0].x,
                y1 : nodeData.filter((d, i) => { 
                        return d.index == curruntNode;
                    })[0].y,
                x2 : nodeData.filter((d, i) => {
                        return d.index == targetNode.index;
                    })[0].x,
                y2 : nodeData.filter((d, i) => {
                        return d.index == targetNode.index;
                    })[0].y,
                label : 1,
                candidateMatrixAccuracy
            });

        if (isDirect != 1){
            result.push({
                sourceNode : targetNode.index,
                targetNode : 1,
                edgeClassName : "sourcenode"+targetNode.index+" targetnode1",
                x1 : nodeData.filter((d, i) => {
                        return d.index == targetNode.index;
                    })[0].x,
                y1 : nodeData.filter((d, i) => { 
                        return d.index == targetNode.index;
                    })[0].y,
                x2 : nodeData.filter((d, i) => {
                        return d.index == 1;
                    })[0].x,
                y2 : nodeData.filter((d, i) => {
                        return d.index == 1;
                    })[0].y,
                label : 0,
                candidateMatrixAccuracy
            });
        }
        
    }
    return result;

}

export { getNextNodeAccuracy };