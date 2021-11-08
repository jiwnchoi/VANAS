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

function getPreset() {
    let results = [];
    let inception, highestAccuracy = unstructuredDataset[0], highestPerformance = unstructuredDataset[0];
    unstructuredDataset.forEach((item, i) => {
        if (item[2] === 1156 && item[3] === 2694282) inception = item;
        if (highestAccuracy[6] < item[6]) highestAccuracy = item;
        if ((highestPerformance[6] * highestPerformance[3] / highestPerformance[2]) < (item[6] * item[3] / item[2])) highestPerformance = item;
    });
    results.push(convertItem(inception));
    results.push(convertItem(highestPerformance));
    results.push(convertItem(highestAccuracy));
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
