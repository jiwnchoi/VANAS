import * as d3 from "d3";
import { drawDeleteBox, svgInit } from "./view/svgInit";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"
import { drawBarChartFromData } from "./view/drawBarChart";
import { initCell } from "./controller/cellController";
import { drawHeatmap } from "./view/drawHeatmap";
import getSharpleyValue from "./service/getSharpleyValue";
import printResult from "./view/printResult";
import printRecommendation from "./view/printRecommendation";

export let fullDataset = null;
export let unstructuredDataset = null;
const heatmap = d3.select("#heatmap");
const tooltip = d3.select("#tooltip");
const architecture = d3.select("#architecture");
const sharpleyvalue = d3.select("#sharpleyvalue");



svgInit(architecture);
drawDeleteBox(architecture);
svgInit(sharpleyvalue);
drawObject();

const fullDatasetPromise = d3.json('/nasbench_minified.json');
fullDatasetPromise.then((json) => {
    fullDataset = json;
    unstructuredDataset = Object.values(fullDataset).reduce((acc, cur) => acc.concat(cur));
    printRecommendation();
    generateHeatmap(unstructuredDataset);
    d3.select("#loading").attr("class","visually-hidden");
    d3.select("#main").attr("class", "bd-main container-xxl bd-layout overflow-hidden");
});


d3.selectAll(".append-button").on("click", makeNode);
d3.select("#init-cell").on("click", () => {
    initCell();
    printResult();
    printRecommendation();
});
d3.select("#generateButton").on("click", () => {
    heatmap.select("svg").remove();
    generateHeatmap(unstructuredDataset);
});


const data = getSharpleyValue();
data.then(json => drawBarChartFromData(json.children));

function generateHeatmap(heatmapData) {
    let heatmapResult = drawHeatmap()
        .x(document.getElementById("optionX").value)
        .y(document.getElementById("optionY").value)
        .z(document.getElementById("optionZ").value)
        .splitX(50)
        .splitY(30)
        (heatmapData);
    heatmap.append(() => heatmapResult.graph);
    tooltip.append(() => heatmapResult.tooltip);
};