import getQuery from "../service/getQuery";
import { getEdgeData, getNodeData } from "./data";
import { cellSainityCheck } from "./dataProcessing";



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
        let pass = 0;
        for (let edge of edgeData){
            if(edge.source.index == curruntNode && edge.target.index == targetNode.index){
                pass = 1;
            }
        }
        if (pass) continue;

        //edgeData에서 엣지 추가
        const newNodeData = nodeData.slice();
        const newEdgeData = edgeData.slice();
        let source, target;
        if (targetNode.index != 1){
            for (let node of newNodeData){
                if (node.index == targetNode.index) source = node;
                if (node.index == 1) target = node;
            }
            newEdgeData.push(
                {
                    source,
                    target
                }
            );
        }
        for (let node of newNodeData){
            if (node.index == targetNode.index) target = node;
            if (node.index == curruntNode) source = node;
        }
        newEdgeData.push({
            source,
            target,
        });



        //extranous 제거
        const extraneous = cellSainityCheck(newNodeData, newEdgeData).extraneous;
        for (let ext of extraneous){
            for (let i=0; i<newNodeData.length; i++){
                if (newNodeData[i].index == ext){
                    newNodeData.splice(i,1);
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
        
        const testAccuracy = getQuery(newNodeData, newEdgeData).test_accuracy;
        
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