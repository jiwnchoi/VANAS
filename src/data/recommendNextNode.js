import getQuery from "../service/getQuery";
import { getEdgeData, getNodeData } from "./data";
import { cellSainityCheck } from "./dataProcessing";

function addEdge(sourceNode, targetNode, nodeData, edgeData) {
    if (sourceNode == targetNode) {
        return 0;
    }
    let source, target;
    for (let node of nodeData) {
        if (node.index == sourceNode) {
            source = node;
        }
        if (node.index == targetNode) {
            target = node;
        }
    }
    source.outdegree += 1;
    target.indegree += 1;
    const edgeClassName = "sourcenode" + sourceNode + " targetnode" + targetNode
    const newEdge = {
        source,
        target,
        edgeClassName,
        isExt: false,
        isDelete: null,
    }
    edgeData.push(newEdge);
}


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



async function getNextNodeAccuracy(curruntNode){
    return [];
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
        let pass = false;
        for (let edge of edgeData){
            if(edge.source.index == curruntNode && edge.target.index == targetNode.index){
                pass = true;
            }
        }
        if (pass) continue;

        //edgeData에서 엣지 추가
        const newEdgeData = edgeData.slice();
        let source, target;

        if (targetNode.index != 1){
            for (let node of nodeData){
                if (node.index == targetNode.index) source = node;
                if (node.index == 1) target = node;
            }
            addEdge(source, target, nodeData, newEdgeData);
        }
        for (let node of nodeData){
            if (node.index == targetNode.index) target = node;
            if (node.index == curruntNode) source = node;
        }
        addEdge(source, target, nodeData, newEdgeData);



        //extranous 제거
        const extraneous = cellSainityCheck(nodeData, newEdgeData).extraneous;
        for (let ext of extraneous){
            for (let i=0; i<nodeData.length; i++){
                if (nodeData[i].index == ext){
                    nodeData.splice(i,1);
                    i--;
                }
            }
            for (let i=0; i<newEdgeData.length; i++){
                if (newEdgeData[i].source.index == ext || 
                    newEdgeData[i].target.index == ext){
                    newEdgeData.splice(i,1);
                    i--;
                }
            }
        }
        
        const testAccuracy = getQuery(nodeData, newEdgeData).test_accuracy;
        
        const isDirect = targetNode.index == 1 ? 1 : 0;

        result.push({
                source : nodeData.filter((d, i) => d.index == curruntNode)[0],
                target : targetNode,
                label : 1,
                testAccuracy
            });

        if (isDirect != 1){
            result.push({
                source : targetNode,
                target : nodeData[1],
                label : 0,
                testAccuracy
            });
        }
        
    }
    return result;

}

export { getNextNodeAccuracy };