import {  unstructuredDataset } from '..';
import { decodeMatrix, decodeOperations, hashingOperations } from '../data/dataProcessing';


export default function getRecommendation(nodeData, edgeData) {
    const results = [];
    const opsType = nodeData.map(node => node.type);
    const opsTypeHashed = hashingOperations(opsType);
    for (let data of unstructuredDataset) {

        if (data[0].length / 2 < edgeData.length) continue;

        const decodedOperations = decodeOperations(data[1]);
        const dataTypeHashed = hashingOperations(decodedOperations);
        if (dataTypeHashed != opsTypeHashed) continue;

        const dataEdges = [];
        for (let i = 0; i < data[0].length; i += 2) {
            dataEdges.push([Number(data[0][i]), Number(data[0][i + 1])]);
        }


        const res = [
            data[6],
            decodedOperations,
            decodeMatrix(dataEdges)
        ]
        results.push(res);


    }
    results.sort((a, b) => b[0] - a[0]);
    return results.slice(0, 5);
}
