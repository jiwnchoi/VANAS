import * as d3 from "d3";
import { unstructuredDataset } from '..';
import { decodeMatrix, decodeOperations, hashingOperations } from '../data/dataProcessing';
import { copyCelltoMain, setCell } from "../controller/cellController";
import { drawObjectwithForce } from "./drawObject";

function convertItem(item) {
    const res = [
        item[6],
        decodeOperations(item[1]), decodeMatrix(item[0])
    ];
    return res;
}

function performanceCalculator(item, k = 0) {
    let ret = 1;
    ret *= item[6] * item[6] * item[6];
    if (k === 1) console.log(ret);
    ret /= Math.log(Math.log(item[3])) * Math.log(item[2]);
    if (k === 1) console.log(ret);
    return ret;
}

function getPreset() {
    let results = [];
    let inception, bestAccuracy = unstructuredDataset[0], bestThroughput = unstructuredDataset[0];
    unstructuredDataset.forEach((item) => {
        if (item[2] === 1156 && item[3] === 2694282) inception = item;
        if (bestAccuracy[6] < item[6]) bestAccuracy = item;
        if (performanceCalculator(bestThroughput) < performanceCalculator(item, 0)) bestThroughput = item;
    });
    results.push(convertItem(inception));
    results.push(convertItem(bestAccuracy));
    results.push(convertItem(bestThroughput));
    return results;
}

export default function printPreset() {
    const data = getPreset();

    for (let i = 0; i < 3; i++) {
        setCell(data[i][1], data[i][2], i + 6);
        drawObjectwithForce(null, i + 6);
    }

    const presetCell = d3.select("#preset-col").selectAll(".preset-cell").data(data);
    presetCell
        .on("click", (_, d) => {
            const i = data.indexOf(d);
            copyCelltoMain(i + 5);
        });
}
