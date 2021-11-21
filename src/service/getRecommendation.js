import {  fullDataset, unstructuredDataset } from '..';
import { decodeMatrix, decodeOperations, hashingOperations } from '../data/dataProcessing';
import { matchGraph } from './getQuery';
const codedOperation = {
    'input': 0,
    'output': 1,
    'conv1x1-bn-relu': 2,
    'conv3x3-bn-relu': 3,
    'maxpool3x3': 4
}
function combination(arr, num) {
    const res = [];
    if (num === 1) return arr.map((v) => [v]);

    arr.forEach((v, idx, arr) => {
        const rest = arr.slice(idx + 1);
        const combinations = combination(rest, num - 1);
        const attach = combinations.map((combination) => [v, ...combination]);
        res.push(...attach);
    })
    return res;
}

function matchGraphforRecommend(nodeData, edgeData, dataEdges, dataOps) {
    
    if (edgeData.length == 0){
        return true;
    }
    return matchGraph(nodeData, edgeData, dataEdges, dataOps);

}

export default function getRecommendation(nodeData, edgeData){
    const results = [];
    for (let edgeNum=edgeData.length; edgeNum<10; edgeNum++){
        const tmp = [0, 0, 0, edgeNum];
        for (const node of nodeData) {
            if (node.type == 'conv1x1-bn-relu') tmp[0]++;
            if (node.type == 'conv3x3-bn-relu') tmp[1]++;
            if (node.type == 'maxpool3x3') tmp[2]++;
        }
        const keyString = tmp.join("");
        const dataset = fullDataset[keyString];
        if (dataset == undefined) continue;
        

        for (let data of dataset){
            
            const dataEdges = [];
            for (let i = 0; i < data[0].length; i += 2) {
                dataEdges.push([Number(data[0][i]), Number(data[0][i + 1])]);
            }
            const dataOps = data[1];

            const subGraphs = combination(dataEdges, edgeData.length);
            subGraphs.push([]);
            for (let subGraph of subGraphs){
                const graphMatcher = matchGraphforRecommend(nodeData, edgeData, subGraph, dataOps);

                const decodedOperations = decodeOperations(dataOps);
                if (graphMatcher) {
                    const res = [
                        data[6],
                        decodedOperations,
                        decodeMatrix(dataEdges)
                    ]
                    results.push(res);
                }
            }
        }
    }
    results.sort((a, b) => b[0] - a[0]);
    return results.slice(0, 5);


}