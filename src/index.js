import * as d3 from "d3";
import "../public/styles.css";
import { drawButton, svgInit } from "./view/designPreference";
import drawObject from "./view/drawObject.js";
import { makeNode } from "./view/makeObject.js"
import { drawBarChartFromData } from "./view/drawBarChart";
import { initCell } from "./controller/cellController";
import { drawHeatmap } from "./view/drawHeatmap";
import getEdgeSignificance from "./service/getEdgeSignificance";
import printResult from "./view/printResult";
import printRecommendation from "./view/printRecommendation";
import printPreset from "./view/printPreset";
import { colorScheme } from "./view/designPreference";


export let fullDataset = null;
export let unstructuredDataset = null; 
const heatmap = d3.select("#heatmap");
const tooltip = d3.select("#tooltip");
const architecture = d3.select("#architecture");
const sharpleyvalue = d3.select("#sharpleyvalue");


function buttonMouseOver() {
    d3.select(this).attr("opacity", 0.5);
}

function buttonMouseOut() {
    d3.select(this).attr("opacity", 1);
}


svgInit(architecture);
drawButton(architecture);
svgInit(sharpleyvalue);
drawObject();

const fullDatasetPromise = d3.json('./nasbench101_minified.json');
fullDatasetPromise.then((json) => {
    fullDataset = json;
    unstructuredDataset = Object.values(fullDataset).reduce((acc, cur) => acc.concat(cur));
    printRecommendation();
    printPreset();
    generateHeatmap(unstructuredDataset);
    d3.select("#loading").attr("class", "visually-hidden");
    d3.select("#main").attr("class", "bd-main container-xxl bd-layout overflow-hidden");
});



d3.selectAll(".conv1x1-bn-relu")
    .attr("fill", colorScheme.conv11)
    .style("background-color", colorScheme.conv11)

d3.selectAll(".conv3x3-bn-relu")
    .attr("fill", colorScheme.conv33)
    .style("background-color", colorScheme.conv33)

d3.selectAll(".maxpool3x3")
    .attr("fill", colorScheme.pool33)
    .style("background-color", colorScheme.pool33)

d3.selectAll(".gray")
    .attr("fill", colorScheme.gray)
    .style("background-color", colorScheme.gray)

d3.selectAll(".append-button")
    .on("click", makeNode)
    .on("mouseover", buttonMouseOver)
    .on("mouseout", buttonMouseOut);

d3.select("#init")
    .on("click", () => {
        initCell();
        printResult();
        printRecommendation();
    })
    .on("mouseover", buttonMouseOver)
    .on("mouseout", buttonMouseOut);

d3.selectAll("#optionX, #optionY").on("change", () => {
    heatmap.select("svg").remove();
    generateHeatmap(unstructuredDataset);
});


const data = getEdgeSignificance();
data.then(json => drawBarChartFromData(json.children));

function generateHeatmap(heatmapData) {
    let heatmapResult = drawHeatmap()
        .x(d3.select("#optionX").property("value"))
        .y(d3.select("#optionY").property("value"))
        .z("test_accuracy")
        .splitX(50)
        .splitY(30)
        (heatmapData);
    heatmap.append(() => heatmapResult.graph);
    tooltip.append(() => heatmapResult.tooltip);
};