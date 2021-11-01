import * as d3 from "d3";
import { unstructuredDataset } from '..';
import { decodeMatrix, decodeOperations, hashingOperations } from '../data/dataProcessing';
import { copyCelltoMain, setCell } from "../controller/cellController";
import { drawObjectwithForce } from "./drawObject";

function getPreset() {
    let results = [];
    let sortedDataset = unstructuredDataset;
    sortedDataset.sort((a, b) => (b[6] - a[6]));
    for (let i = 0; i < 5; i++) {
        const res = [
            sortedDataset[i][6],
            decodeOperations(sortedDataset[i][1]),
            decodeMatrix(sortedDataset[i][0])
        ];
        results.push(res);
    }
    return results;
}

export default function printPreset() {
    const data = getPreset();

    for (let i = 0; i < 5; i++) {
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
